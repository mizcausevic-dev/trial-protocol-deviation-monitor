// SPDX-License-Identifier: AGPL-3.0-or-later

import { mkdir, writeFile } from "node:fs/promises";

import {
  capaPosture,
  deviationRouting,
  payload,
  protocolLane,
  summary,
  verification
} from "../src/services/trialProtocolDeviationMonitorService.js";
import {
  renderCapaPosture,
  renderDeviationRouting,
  renderDocs,
  renderOverview,
  renderProtocolLane,
  renderValidation
} from "../src/services/render.js";

async function writePage(route: string, html: string) {
  const directory = route === "/" ? "site" : `site${route}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html, "utf8");
}

async function writeJson(name: string, value: unknown) {
  await mkdir("site/api", { recursive: true });
  await writeFile(`site/api/${name}.json`, JSON.stringify(value, null, 2), "utf8");
}

await writePage("/", renderOverview());
await writePage("/protocol-lane", renderProtocolLane());
await writePage("/deviation-routing", renderDeviationRouting());
await writePage("/capa-posture", renderCapaPosture());
await writePage("/verification", renderValidation());
await writePage("/docs", renderDocs());

await writeJson("summary", summary());
await writeJson("protocol-lane", protocolLane());
await writeJson("deviation-routing", deviationRouting());
await writeJson("capa-posture", capaPosture());
await writeJson("verification", verification());
await writeJson("sample", payload());
