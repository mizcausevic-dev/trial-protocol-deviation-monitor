// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { capaPackets, protocolLanePackets, sampleProtocolDeviationPayload } from "../data/sampleProtocolDeviations.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-30T00:00:00Z";
const report = analyze(sampleProtocolDeviationPayload, {
  now: NOW,
  staleDetectionAfterHours: 72
});

function severityRank(finding: Finding): number {
  return finding.severity === "high" ? 0 : finding.severity === "medium" ? 1 : finding.severity === "low" ? 2 : 3;
}

export function summary() {
  return {
    trials: report.trials,
    onTrackTrials: report.onTrackTrials,
    packets: report.packets,
    highSeverityPackets: report.highSeverityPackets,
    workflowGaps: report.workflowGaps,
    stalePackets: report.stalePackets,
    recommendation:
      "Restore missing source proof, close the CAPA packet gaps, repair stale safety evidence, and stabilize owner routing before the next deviation review deadlines."
  };
}

export function protocolLane() {
  return protocolLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "intake-lane") return finding.code === "protocol-deviation-gap" || finding.code === "workflow-gap";
      if (lane.id === "source-lane") return finding.code === "missing-source-proof" || finding.code === "stale-open-packet";
      if (lane.id === "training-lane") return finding.code === "missing-training-proof";
      if (lane.id === "capa-lane") return finding.code === "missing-capa-proof" || finding.code === "high-severity-unassigned";
      return false;
    }).length
  }));
}

export function deviationRouting() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.owner ??
        (finding.code === "missing-source-proof"
          ? "Clinical Quality"
          : finding.code === "missing-training-proof"
            ? "Site Training"
            : finding.code === "missing-capa-proof"
              ? "Regulatory Affairs"
              : "Clinical Operations")
    }));
}

export function capaPosture() {
  return capaPackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline protocol-deviation analyzer and CLI, not static copy alone.",
    "Trials and deviation packets are synthetic sample data only; no PHI, subject data, or live sponsor records are published.",
    "The control plane keeps missing proof, inspection pressure, stale CAPA attachments, and review readiness visible for life sciences stakeholders.",
    "This surface demonstrates protocol deviation routing and CAPA-safe sequencing, not a generic clinical trial keyword page.",
    "It complements prior authorization, reporting, and evidence operations with a reusable life-sciences review primitive."
  ];
}

export const validation = verification;

export function payload() {
  return {
    summary: summary(),
    protocolLane: protocolLane(),
    deviationRouting: deviationRouting(),
    capaPosture: capaPosture(),
    verification: verification(),
    sample: sampleProtocolDeviationPayload
  };
}
