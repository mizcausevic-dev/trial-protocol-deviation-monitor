// SPDX-License-Identifier: AGPL-3.0-or-later

export type TrialStatus = "ON_TRACK" | "AT_RISK";
export type PacketStatus = "OPEN" | "RESOLVED";
export type Severity = "high" | "medium" | "low" | "info";
export type EvidenceKind = "Source" | "Training" | "CAPA" | "Safety" | "Monitoring" | string;
export type DeviationDomain = "SOURCE_DATA" | "CONSENT" | "DRUG_ACCOUNTABILITY" | "CAPA" | "SAFETY" | string;

export interface TrialCase {
  id: string;
  study: string;
  site: string;
  cohort: string;
  owner: string;
  status: TrialStatus;
  workflowHealthy: boolean;
  daysToReview: number;
  packet: string;
  excerpt: string;
  nextAction: string;
}

export interface DeviationPacket {
  id: string;
  caseId: string;
  study: string;
  site: string;
  owner?: string;
  domain: DeviationDomain;
  kind: EvidenceKind;
  severity: Severity;
  status: PacketStatus;
  scope: string;
  principal?: string;
  message: string;
  openedAt: string;
  dueAt: string;
}

export interface TrialDeviationExport {
  trials: TrialCase[];
  packets: DeviationPacket[];
}

export type FindingCode =
  | "no-on-track-trials"
  | "protocol-deviation-gap"
  | "missing-source-proof"
  | "missing-training-proof"
  | "missing-capa-proof"
  | "workflow-gap"
  | "stale-open-packet"
  | "high-severity-unassigned";

export interface Finding {
  code: FindingCode;
  severity: Severity;
  subject: "trial" | "packet" | "workflow";
  subjectId: string;
  subjectName?: string;
  owner?: string;
  scope?: string;
  principal?: string;
  message: string;
}

export interface AnalysisOptions {
  now?: string;
  staleDetectionAfterHours?: number;
}

export interface CoverageReport {
  ok: boolean;
  trials: number;
  onTrackTrials: number;
  packets: number;
  highSeverityPackets: number;
  workflowGaps: number;
  stalePackets: number;
  findingsList: Finding[];
}
