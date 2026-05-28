// SPDX-License-Identifier: AGPL-3.0-or-later

import express from "express";
import { fileURLToPath } from "node:url";

import {
  capaPosture,
  deviationRouting,
  payload,
  protocolLane,
  summary,
  verification
} from "./services/trialProtocolDeviationMonitorService.js";
import {
  renderCapaPosture,
  renderDeviationRouting,
  renderDocs,
  renderOverview,
  renderProtocolLane,
  renderValidation,
} from "./services/render.js";

const app = express();
const port = Number(process.env.PORT ?? 5523);
const host = process.env.HOST || "0.0.0.0";

app.get("/", (_req, res) => res.type("html").send(renderOverview()));
app.get("/protocol-lane", (_req, res) => res.type("html").send(renderProtocolLane()));
app.get("/deviation-routing", (_req, res) => res.type("html").send(renderDeviationRouting()));
app.get("/capa-posture", (_req, res) => res.type("html").send(renderCapaPosture()));
app.get("/verification", (_req, res) => res.type("html").send(renderValidation()));
app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
app.get("/api/protocol-lane", (_req, res) => res.json(protocolLane()));
app.get("/api/deviation-routing", (_req, res) => res.json(deviationRouting()));
app.get("/api/capa-posture", (_req, res) => res.json(capaPosture()));
app.get("/api/verification", (_req, res) => res.json(verification()));
app.get("/api/sample", (_req, res) => res.json(payload()));

const currentFile = fileURLToPath(import.meta.url);
const invokedDirectly = process.argv[1] !== undefined && currentFile === process.argv[1];

if (invokedDirectly) {
  app.listen(port, host, () => {
    console.log(`Trial Protocol Deviation Monitor listening on http://${host}:${port}`);
  });
}

export default app;
