"use strict";

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const ENV_PATH = path.join(__dirname, ".env");
let cachedKey = null;

class KeygenError extends Error {
  constructor(message, fix) {
    super(message);
    this.name = "KeygenError";
    this.fix = fix || "Check the MindDo settings in .env.";
  }
}

function readEnv() {
  const values = {};
  const text = fs.readFileSync(ENV_PATH, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 0) continue;
    const name = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[name] = value;
  }
  return values;
}

function makeUrl(baseUrl) {
  return `${baseUrl.replace(/\/+$/, "")}/api/lookup-key`;
}

function validExpiry(expiresAt) {
  const timestamp = Date.parse(expiresAt);
  return Number.isFinite(timestamp) && timestamp > Date.now();
}

async function getKey(forceRefresh = false) {
  if (!forceRefresh && cachedKey && validExpiry(cachedKey.expiresAt)) {
    return cachedKey.apiKey;
  }

  let env;
  try {
    env = readEnv();
  } catch (error) {
    throw new KeygenError("The MindDo connection settings are missing.", "Create .env with KEYGEN_URL and KEYGEN_TOKEN.");
  }

  if (!env.KEYGEN_URL || !env.KEYGEN_TOKEN || env.KEYGEN_URL === "paste-here" || env.KEYGEN_TOKEN === "paste-here") {
    throw new KeygenError("The MindDo connection is not set up yet.", "Put your MindDo URL and token in .env as KEYGEN_URL and KEYGEN_TOKEN.");
  }

  let response;
  let data;
  try {
    response = await fetch(makeUrl(env.KEYGEN_URL), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.KEYGEN_TOKEN}`,
        Accept: "application/json"
      }
    });
    data = await response.json();
  } catch (error) {
    throw new KeygenError("I couldn't connect to MindDo.", "Check your internet connection and KEYGEN_URL.");
  }

  if (!response.ok || (data && data.error)) {
    const problem = data && data.error ? data.error : {};
    throw new KeygenError(
      problem.message || "MindDo could not provide an AI key.",
      problem.fix || "Check KEYGEN_URL and KEYGEN_TOKEN, then try again."
    );
  }

  if (!data.apiKey || !data.expiresAt || !validExpiry(data.expiresAt)) {
    throw new KeygenError("MindDo returned an invalid AI key response.", "Ask MindDo for a response containing apiKey and expiresAt.");
  }

  cachedKey = { apiKey: data.apiKey, expiresAt: data.expiresAt };
  return cachedKey.apiKey;
}

function clearKey() {
  cachedKey = null;
}

async function handleRequest(line) {
  const request = JSON.parse(line);
  if (request.action === "refresh") clearKey();
  const apiKey = await getKey();
  process.stdout.write(`${JSON.stringify({ ok: true, apiKey })}\n`);
}

if (require.main === module) {
  const input = readline.createInterface({ input: process.stdin });
  let queue = Promise.resolve();
  input.on("line", (line) => {
    queue = queue.then(async () => {
      try {
        await handleRequest(line);
      } catch (error) {
        process.stdout.write(`${JSON.stringify({
          ok: false,
          error: {
            message: error.message || "The MindDo connection failed.",
            fix: error.fix || "Check the MindDo settings in .env."
          }
        })}\n`);
      }
    });
  });
}

module.exports = { getKey, clearKey };
