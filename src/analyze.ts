// SPDX-License-Identifier: AGPL-3.0-or-later

import type {
  AnalysisOptions,
  CoverageReport,
  DeviationPacket,
  Finding,
  TrialDeviationExport,
} from "./types.js";

function hoursBetween(startIso: string, endIso: string) {
  return Math.max(0, (Date.parse(endIso) - Date.parse(startIso)) / 36e5);
}

function hasOpenPacket(packets: DeviationPacket[], kind: string) {
  return packets.some((packet) => packet.kind === kind && packet.status === "OPEN");
}

export function analyze(
  payload: TrialDeviationExport,
  options: AnalysisOptions = {}
): CoverageReport {
  const now = options.now ?? new Date().toISOString();
  const staleAfterHours = options.staleDetectionAfterHours ?? 72;
  const findingsList: Finding[] = [];

  const onTrackTrials = payload.trials.filter((trial) => trial.status === "ON_TRACK").length;
  const highSeverityPackets = payload.packets.filter(
    (packet) => packet.status === "OPEN" && packet.severity === "high"
  ).length;
  const workflowGaps = payload.trials.filter((trial) => !trial.workflowHealthy).length;

  if (onTrackTrials === 0) {
    findingsList.push({
      code: "no-on-track-trials",
      severity: "high",
      subject: "workflow",
      subjectId: "trials",
      subjectName: "Protocol deviation workflow",
      message: "No study sites are currently on track; the deviation queue is operating entirely in exception mode."
    });
  }

  for (const trial of payload.trials) {
    const trialPackets = payload.packets.filter((packet) => packet.caseId === trial.id && packet.status === "OPEN");

    if (trial.status === "AT_RISK" || trialPackets.length > 0) {
      findingsList.push({
        code: "protocol-deviation-gap",
        severity: trial.status === "AT_RISK" ? "high" : "medium",
        subject: "trial",
        subjectId: trial.id,
        subjectName: `${trial.study} ${trial.id}`,
        owner: trial.owner,
        scope: trial.site,
        message: `${trial.study} case ${trial.id} still has open deviation debt against the ${trial.packet} packet.`
      });
    }

    if (trialPackets.length > 0 && !hasOpenPacket(trialPackets, "Source")) {
      findingsList.push({
        code: "missing-source-proof",
        severity: "medium",
        subject: "trial",
        subjectId: trial.id,
        subjectName: `${trial.study} ${trial.id}`,
        owner: trial.owner,
        scope: trial.site,
        message: "The deviation is in exception flow but does not currently show a clean source-data proof packet in the queue."
      });
    }

    if (!trial.workflowHealthy) {
      findingsList.push({
        code: "workflow-gap",
        severity: "medium",
        subject: "workflow",
        subjectId: trial.id,
        subjectName: `${trial.study} ${trial.id}`,
        owner: trial.owner,
        scope: trial.site,
        message: "Owner-safe routing is degraded; the protocol deviation, CAPA, and review sequence are still split across teams."
      });
    }
  }

  for (const packet of payload.packets) {
    if (packet.status !== "OPEN") continue;

    if (packet.kind === "Source") {
      findingsList.push({
        code: "missing-source-proof",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.study} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (packet.kind === "Training") {
      findingsList.push({
        code: "missing-training-proof",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.study} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (packet.kind === "CAPA") {
      findingsList.push({
        code: "missing-capa-proof",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.study} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (!packet.owner && packet.severity === "high") {
      findingsList.push({
        code: "high-severity-unassigned",
        severity: "high",
        subject: "packet",
        subjectId: packet.id,
        subjectName: packet.kind,
        scope: packet.scope,
        message: "A high-severity deviation packet is still unassigned."
      });
    }

    if (hoursBetween(packet.openedAt, now) >= staleAfterHours) {
      findingsList.push({
        code: "stale-open-packet",
        severity: packet.severity === "high" ? "high" : "medium",
        subject: "packet",
        subjectId: packet.id,
        subjectName: packet.kind,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: `${packet.kind} evidence has been open longer than the deviation review SLA.`
      });
    }
  }

  return {
    ok: findingsList.every((finding) => finding.severity !== "high"),
    trials: payload.trials.length,
    onTrackTrials,
    packets: payload.packets.length,
    highSeverityPackets,
    workflowGaps,
    stalePackets: findingsList.filter((finding) => finding.code === "stale-open-packet").length,
    findingsList
  };
}
