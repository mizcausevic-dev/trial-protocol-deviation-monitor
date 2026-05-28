import { describe, expect, test } from "vitest";

import {
  capaPosture,
  deviationRouting,
  payload,
  protocolLane,
  summary,
  validation
} from "./trialProtocolDeviationMonitorService.js";

describe("trial protocol deviation monitor service", () => {
  test("summary reports trial and packet counts", () => {
    const result = summary();
    expect(result.trials).toBe(3);
    expect(result.onTrackTrials).toBe(1);
    expect(result.packets).toBe(5);
  });

  test("lane and capa packets are present", () => {
    expect(protocolLane()).toHaveLength(4);
    expect(capaPosture()).toHaveLength(3);
  });

  test("payload includes routing findings and verification", () => {
    expect(deviationRouting().length).toBeGreaterThan(0);
    expect(validation()).toHaveLength(5);
    expect(payload().sample.trials[0]?.study).toBe("ONC-241 Phase II");
  });
});
