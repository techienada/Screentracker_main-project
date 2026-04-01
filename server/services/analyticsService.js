function classifyRisk(score, screenTimeHours, sleepHours) {
  if (score >= 80 && screenTimeHours <= 4.5 && sleepHours >= 7) return "Low";
  if (score >= 65 && screenTimeHours <= 5.5 && sleepHours >= 6.2) return "Moderate";
  return "High";
}

export function buildTrendFromScore(score) {
  const safeScore = Math.max(35, Math.min(95, Number(score)));
  return [-9, -6, -4, -2, 1, 3, 0].map((offset) => Math.max(30, Math.min(97, safeScore + offset)));
}

function buildUsageFromScreenTime(screenTimeHours) {
  const totalMinutes = Math.max(60, Math.round(Number(screenTimeHours) * 60));
  return [
    { label: "Social", minutes: Math.round(totalMinutes * 0.32), color: "#8b5cf6" },
    { label: "Study", minutes: Math.round(totalMinutes * 0.28), color: "#10b981" },
    { label: "Video", minutes: Math.round(totalMinutes * 0.24), color: "#0ea5e9" },
    { label: "Other", minutes: Math.round(totalMinutes * 0.16), color: "#f59e0b" },
  ];
}

export function buildRecommendations(profile) {
  const recommendations = [];
  const topUsage = [...profile.appUsage].sort((a, b) => b.minutes - a.minutes)[0]?.label || "Social";

  if (profile.sleepHours < profile.goals.minSleep) {
    recommendations.push(`Raise sleep from ${profile.sleepHours.toFixed(1)}h to ${profile.goals.minSleep.toFixed(1)}h by enabling a fixed bedtime cut-off and blocking ${topUsage.toLowerCase()} after 10 PM.`);
  }
  if (profile.screenTimeHours > profile.goals.maxScreenTime) {
    recommendations.push(`Reduce screen time by ${(profile.screenTimeHours - profile.goals.maxScreenTime).toFixed(1)}h using app limits on ${topUsage.toLowerCase()} and one scheduled offline block daily.`);
  }
  if (profile.focusHours < profile.goals.minFocus) {
    recommendations.push(`Add a protected ${Math.max(30, Math.round((profile.goals.minFocus - profile.focusHours) * 60))}-minute focus block before opening entertainment or messaging apps.`);
  }
  if (profile.unlocks >= 55) recommendations.push(`Cut phone pickups from ${profile.unlocks} by turning on notification batching and keeping the device away during study or work blocks.`);
  if (profile.scrollingHours >= 2) recommendations.push(`Limit scrolling sessions to 15 minutes because current scrolling is ${profile.scrollingHours.toFixed(1)}h and is likely driving distraction.`);
  if (profile.hydration < 65) recommendations.push(`Pair break reminders with water prompts because hydration is at ${profile.hydration}% and recovery habits need support.`);
  if (profile.heartRate > 88) recommendations.push("Add two low-stimulation breaks and reduce late-night screen intensity because elevated heart-rate patterns may reflect stress.");
  if (profile.tags.includes("sleep")) recommendations.push("Use a sleep-first routine: dim screen, mute alerts, and stop device use 45 minutes before bed.");
  if (profile.tags.includes("focus")) recommendations.push("Start the day with one focus-first session before social, messaging, or video apps.");
  if (profile.mainIssue) recommendations.push(`Address the main issue directly: ${profile.mainIssue}`);
  if (profile.riskLevel === "Low") recommendations.push("Maintain current balance with one weekly review instead of adding strict new limits.");
  if (profile.riskLevel === "High") recommendations.push("Apply stricter controls this week and review progress daily until the score stabilizes.");

  return recommendations.filter((item, index, list) => list.indexOf(item) === index).slice(0, 4);
}

export function createUserRecord(partial) {
  const score = Number(partial.wellbeingScore);
  const screenTimeHours = Number(partial.screenTimeHours);
  const focusHours = Number(partial.focusHours);
  const sleepHours = Number(partial.sleepHours);
  const goals = {
    maxScreenTime: Number(partial.goals?.maxScreenTime ?? Math.max(3.5, screenTimeHours - 0.5)),
    minSleep: Number(partial.goals?.minSleep ?? Math.max(7, sleepHours + 0.3)),
    minFocus: Number(partial.goals?.minFocus ?? Math.max(3, focusHours + 0.4)),
  };
  const riskLevel = partial.riskLevel || classifyRisk(score, screenTimeHours, sleepHours);
  const appUsage = partial.appUsage || buildUsageFromScreenTime(screenTimeHours);
  const profile = {
    id: partial.id,
    name: partial.name,
    age: Number(partial.age),
    role: partial.role || "Student",
    device: partial.device || "Smartphone",
    wellbeingScore: score,
    riskLevel,
    screenTimeHours,
    focusHours,
    sleepHours,
    unlocks: Number(partial.unlocks ?? Math.round(screenTimeHours * 10 + 8)),
    scrollingHours: Number(partial.scrollingHours ?? Math.max(0.6, screenTimeHours * 0.38).toFixed(1)),
    typingSpeed: Number(partial.typingSpeed ?? 50),
    heartRate: Number(partial.heartRate ?? 80),
    hydration: Number(partial.hydration ?? 70),
    mainIssue: partial.mainIssue || "Digital habits need review.",
    tags: partial.tags || [],
    goals,
    weeklyTrend: partial.weeklyTrend || buildTrendFromScore(score),
    appUsage,
  };
  return { ...profile, recommendations: partial.recommendations || buildRecommendations(profile) };
}

export function buildBehaviorAnalytics(user) {
  const topUsage = [...user.appUsage].sort((a, b) => b.minutes - a.minutes)[0]?.label || "Social";
  const penalties = [
    Math.max(0, (user.screenTimeHours - user.goals.maxScreenTime) * 8),
    Math.max(0, (user.goals.minSleep - user.sleepHours) * 10),
    Math.max(0, (user.goals.minFocus - user.focusHours) * 9),
    user.unlocks >= 55 ? 8 : user.unlocks >= 40 ? 4 : 0,
    user.scrollingHours >= 3 ? 8 : user.scrollingHours >= 2 ? 4 : 0,
    user.hydration < 65 ? 5 : 0,
    user.heartRate > 88 ? 5 : 0,
  ];
  const behaviorScore = Math.max(0, Math.min(100, Math.round(100 - penalties.reduce((sum, value) => sum + value, 0))));

  let profile = "Balanced user";
  let why = "Core habits are close to target and the current pattern looks stable.";
  if (user.sleepHours < user.goals.minSleep && user.tags.includes("sleep")) {
    profile = "Late-night drifter";
    why = "Sleep is below target and night-time phone use is pushing recovery down.";
  } else if (user.focusHours < user.goals.minFocus && user.unlocks >= 40) {
    profile = "High-switching distracted user";
    why = "Frequent pickups and weak focus time suggest attention is being broken too often.";
  } else if (user.scrollingHours >= 2 || user.tags.includes("social")) {
    profile = "Social overload user";
    why = `${topUsage} is dominating usage and distraction time is above the healthy range.`;
  } else if (user.heartRate > 88 || user.tags.includes("stress")) {
    profile = "Stress-reactive user";
    why = "Stress-linked signals are elevated and recovery habits need support.";
  }

  const strongestSignal =
    user.sleepHours < user.goals.minSleep
      ? "Sleep deficit"
      : user.focusHours < user.goals.minFocus
        ? "Low focus"
        : user.screenTimeHours > user.goals.maxScreenTime
          ? "Screen overload"
          : user.unlocks >= 55
            ? "High pickups"
            : `${topUsage} dominance`;

  return { behaviorScore, profile, why, strongestSignal };
}

export function getBehaviorTrend(user) {
  const trend = user.weeklyTrend || [];
  if (trend.length < 2) return { label: "Stable", tone: "neutral", delta: 0 };
  const latest = trend[trend.length - 1];
  const earlier = trend[Math.max(0, trend.length - 4)];
  const delta = latest - earlier;
  if (delta >= 5) return { label: "Improving", tone: "up", delta };
  if (delta <= -5) return { label: "Worsening", tone: "down", delta };
  return { label: "Stable", tone: "neutral", delta };
}

export function buildBehaviorSnapshot(user) {
  const behavior = buildBehaviorAnalytics(user);
  const trend = getBehaviorTrend(user);
  return {
    behaviorScore: behavior.behaviorScore,
    behaviorProfile: behavior.profile,
    strongestSignal: behavior.strongestSignal,
    trendLabel: trend.label,
    trendDelta: trend.delta,
    whyItMatters: behavior.why,
    nextAction: user.recommendations?.[0] || "",
    weeklyTarget: user.goals ? `Sleep ${user.goals.minSleep}h, screen below ${user.goals.maxScreenTime}h, focus above ${user.goals.minFocus}h.` : "",
  };
}
