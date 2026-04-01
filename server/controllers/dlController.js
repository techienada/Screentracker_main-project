import { predictUserDeepTrend } from "../services/dataService.js";

export async function predictTrend(req, res) {
  res.json(await predictUserDeepTrend(req.body || {}));
}
