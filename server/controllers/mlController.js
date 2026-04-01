import { predictUserRisk } from "../services/dataService.js";

export async function predictRisk(req, res) {
  res.json(await predictUserRisk(req.body || {}));
}
