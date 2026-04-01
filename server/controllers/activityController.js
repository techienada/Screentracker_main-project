import { addActivity, listActivity } from "../services/dataService.js";

export async function getActivity(req, res) {
  res.json(await listActivity());
}

export async function createActivity(req, res) {
  res.status(201).json(await addActivity(req.body || {}));
}
