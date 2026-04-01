import { getDashboardData, resetAllData } from "../services/dataService.js";

export async function getDashboard(req, res) {
  res.json(await getDashboardData());
}

export async function resetAppData(req, res) {
  const data = await resetAllData();
  res.json({ message: "Store reset", data });
}
