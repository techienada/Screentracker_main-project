import { getReports } from "../services/dataService.js";

export async function listReports(req, res) {
  res.json(await getReports());
}
