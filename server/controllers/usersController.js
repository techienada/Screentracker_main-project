import { deleteUser, getUserAnalytics, getUserById, listUsers, upsertUser } from "../services/dataService.js";

export async function getUsers(req, res) {
  res.json(await listUsers());
}

export async function getUser(req, res) {
  const user = await getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
}

export async function saveUser(req, res) {
  const payload = { ...req.body, id: req.params.id || req.body?.id };
  res.json(await upsertUser(payload));
}

export async function removeUser(req, res) {
  await deleteUser(req.params.id);
  res.status(204).end();
}

export async function getAnalytics(req, res) {
  const payload = await getUserAnalytics(req.params.id);
  if (!payload) return res.status(404).json({ message: "User not found" });
  res.json(payload);
}
