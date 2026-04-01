import { authenticateAdmin } from "../services/dataService.js";

export async function login(req, res) {
  const result = await authenticateAdmin(req.body || {});
  if (!result.ok) return res.status(401).json({ message: "Invalid credentials" });
  res.json(result);
}
