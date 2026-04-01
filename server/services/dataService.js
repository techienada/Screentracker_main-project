import { getStore, resetStore, withStore } from "../lib/store.js";
import { buildBehaviorSnapshot, createUserRecord } from "./analyticsService.js";
import { predictRisk, trainRiskModel } from "./mlService.js";
import { predictDeepTrend, trainDeepTrendModel } from "./dlService.js";

function nextId(items) {
  return items.length ? Math.max(...items.map((item) => Number(item.id) || 0)) + 1 : 1;
}

export async function authenticateAdmin({ email, password }) {
  const store = await getStore();
  if (email === store.admin.email && password === store.admin.password) {
    const session = {
      id: nextId(store.sessions),
      email,
      createdAt: Date.now(),
      token: `pulsepath-${Date.now()}`,
    };
    await withStore((draft) => {
      draft.sessions.unshift(session);
      return session;
    });
    return { ok: true, session };
  }
  return { ok: false };
}

export async function getDashboardData() {
  const store = await getStore();
  const model = trainRiskModel(store.users);
  const deepModel = trainDeepTrendModel(store.users);
  return {
    admin: store.admin,
    users: store.users,
    activity: [...store.activity].sort((a, b) => b.createdAt - a.createdAt),
    behaviorSnapshots: store.users.map((user) => buildBehaviorSnapshot(user)),
    mlPredictions: store.users.map((user) => ({ userId: user.id, ...predictRisk(user, model) })),
    dlPredictions: store.users.map((user) => ({ userId: user.id, ...predictDeepTrend(user, deepModel) })),
  };
}

export async function listUsers() {
  const store = await getStore();
  return [...store.users].sort((a, b) => a.id - b.id);
}

export async function getUserById(userId) {
  const store = await getStore();
  return store.users.find((user) => Number(user.id) === Number(userId)) || null;
}

export async function upsertUser(payload) {
  return withStore((store) => {
    const normalized = createUserRecord({
      ...payload,
      id: payload.id ? Number(payload.id) : nextId(store.users),
    });
    const index = store.users.findIndex((user) => Number(user.id) === Number(normalized.id));
    if (index >= 0) store.users[index] = normalized;
    else store.users.push(normalized);
    return normalized;
  });
}

export async function deleteUser(userId) {
  return withStore((store) => {
    store.users = store.users.filter((user) => Number(user.id) !== Number(userId));
    store.activity = store.activity.filter((item) => Number(item.userId) !== Number(userId));
    return { ok: true };
  });
}

export async function listActivity() {
  const store = await getStore();
  return [...store.activity].sort((a, b) => b.createdAt - a.createdAt);
}

export async function addActivity(entry) {
  return withStore((store) => {
    const record = {
      id: nextId(store.activity),
      createdAt: entry.createdAt || Date.now(),
      source: entry.source || "api",
      ...entry,
    };
    store.activity.unshift(record);
    return record;
  });
}

export async function getUserAnalytics(userId) {
  const store = await getStore();
  const user = store.users.find((item) => Number(item.id) === Number(userId));
  if (!user) return null;
  const model = trainRiskModel(store.users);
  const deepModel = trainDeepTrendModel(store.users);
  return {
    user,
    behavior: buildBehaviorSnapshot(user),
    mlPrediction: predictRisk(user, model),
    dlPrediction: predictDeepTrend(user, deepModel),
    activity: store.activity.filter((item) => Number(item.userId) === Number(userId)).sort((a, b) => b.createdAt - a.createdAt),
  };
}

export async function getReports() {
  const store = await getStore();
  const model = trainRiskModel(store.users);
  const deepModel = trainDeepTrendModel(store.users);
  return store.users.map((user) => ({
    userId: user.id,
    name: user.name,
    riskLevel: user.riskLevel,
    behavior: buildBehaviorSnapshot(user),
    mlPrediction: predictRisk(user, model),
    dlPrediction: predictDeepTrend(user, deepModel),
  }));
}

export async function predictUserRisk(payload) {
  const store = await getStore();
  const user = createUserRecord({ ...payload, id: payload.id || 999999 });
  const model = trainRiskModel(store.users);
  const prediction = predictRisk(user, model);
  await withStore((draft) => {
    draft.mlPredictions.unshift({
      id: nextId(draft.mlPredictions),
      createdAt: Date.now(),
      userId: payload.id || null,
      prediction,
    });
  });
  return prediction;
}

export async function predictUserDeepTrend(payload) {
  const store = await getStore();
  const user = createUserRecord({ ...payload, id: payload.id || 999998 });
  const model = trainDeepTrendModel(store.users);
  return predictDeepTrend(user, model);
}

export async function resetAllData() {
  return resetStore();
}
