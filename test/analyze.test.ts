import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { TrialDeviationExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): TrialDeviationExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as TrialDeviationExport;

const NOW = "2026-05-30T00:00:00Z";

describe("analyze", () => {
  it("counts trials and packets", () => {
    const report = analyze(fixture("protocol-deviations.json"), { now: NOW });
    expect(report.trials).toBe(3);
    expect(report.onTrackTrials).toBe(1);
    expect(report.packets).toBe(5);
  });

  it("flags missing on-track trials as high", () => {
    const report = analyze({ trials: [], packets: [] }, { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "no-on-track-trials")?.severity).toBe("high");
  });

  it("flags protocol deviation gaps", () => {
    const report = analyze(fixture("protocol-deviations.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "protocol-deviation-gap")?.scope).toBe("Boston Investigational Site 07");
  });

  it("flags source, training, capa, and workflow gaps", () => {
    const report = analyze(fixture("protocol-deviations.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "missing-source-proof")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "missing-training-proof")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "missing-capa-proof")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "workflow-gap")).toBeDefined();
  });

  it("flags stale open packets", () => {
    const report = analyze(fixture("protocol-deviations.json"), { now: NOW, staleDetectionAfterHours: 24 });
    expect(report.findingsList.find((finding) => finding.code === "stale-open-packet")).toBeDefined();
  });

  it("ok=true on a clean fixture", () => {
    const report = analyze(fixture("protocol-deviations-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((finding) => finding.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("toMarkdown ranks high findings first", () => {
    const markdown = toMarkdown(analyze(fixture("protocol-deviations.json"), { now: NOW }));
    expect(markdown).toContain("❌");
    expect(markdown.indexOf("🔴")).toBeLessThan(markdown.indexOf("🟠"));
  });

  it("toSummary emits a one-liner", () => {
    const summary = toSummary(analyze(fixture("protocol-deviations.json"), { now: NOW }));
    expect(summary).toMatch(/trials/);
    expect(summary).toMatch(/packets/);
  });
});
