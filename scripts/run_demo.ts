// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  capaPosture,
  deviationRouting,
  protocolLane,
  summary
} from "../src/services/trialProtocolDeviationMonitorService.js";

console.log("trial-protocol-deviation-monitor demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(`protocol lanes: ${protocolLane().length}`);
console.log(`deviation routing findings: ${deviationRouting().length}`);
console.log(`capa packets: ${capaPosture().length}`);
