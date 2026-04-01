import fs from "node:fs/promises";
import path from "node:path";
import { createSeedState } from "./seed.js";

const dataDir = path.resolve(process.cwd(), "server", "data");
const dataFile = path.join(dataDir, "app-data.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(createSeedState(), null, 2), "utf8");
  }
}

async function readStore() {
  await ensureStore();
  return JSON.parse(await fs.readFile(dataFile, "utf8"));
}

async function writeStore(data) {
  await ensureStore();
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf8");
}

export async function withStore(updateFn) {
  const data = await readStore();
  const result = await updateFn(data);
  await writeStore(data);
  return result;
}

export async function getStore() {
  return readStore();
}

export async function resetStore() {
  const seed = createSeedState();
  await writeStore(seed);
  return seed;
}
