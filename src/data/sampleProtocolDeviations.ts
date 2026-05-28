// SPDX-License-Identifier: AGPL-3.0-or-later

import type { TrialDeviationExport } from "../types.js";

export const sampleProtocolDeviationPayload: TrialDeviationExport = {
  trials: [
    {
      id: "DEV-1042",
      study: "ONC-241 Phase II",
      site: "Boston Investigational Site 07",
      cohort: "Dose escalation",
      owner: "Clinical Quality",
      status: "AT_RISK",
      workflowHealthy: false,
      daysToReview: 2,
      packet: "Source data reconciliation packet",
      excerpt: "Monitoring visit identified late AE transcription and missing visit source confirmation.",
      nextAction: "Route the source reconciliation note and coordinator retraining proof before the deviation review board."
    },
    {
      id: "DEV-2077",
      study: "NEU-118 Longitudinal",
      site: "Chicago Research Site 12",
      cohort: "Maintenance arm",
      owner: "Site Operations",
      status: "ON_TRACK",
      workflowHealthy: true,
      daysToReview: 5,
      packet: "Visit window justification packet",
      excerpt: "Deviation packet is complete; only sponsor QA acknowledgment is pending.",
      nextAction: "Keep the packet ready and hold for QA signoff."
    },
    {
      id: "DEV-3109",
      study: "IMM-330 Extension",
      site: "Dallas Site 04",
      cohort: "Open-label extension",
      owner: "Regulatory Affairs",
      status: "AT_RISK",
      workflowHealthy: false,
      daysToReview: 1,
      packet: "CAPA and retraining packet",
      excerpt: "Deviation reopened after drug accountability mismatch and incomplete CAPA chronology.",
      nextAction: "Repair the drug accountability explanation and finalize the CAPA evidence bundle."
    }
  ],
  packets: [
    {
      id: "PKT-001",
      caseId: "DEV-1042",
      study: "ONC-241 Phase II",
      site: "Boston Investigational Site 07",
      owner: "Clinical Quality",
      domain: "SOURCE_DATA",
      kind: "Source",
      severity: "high",
      status: "OPEN",
      scope: "Dose escalation",
      principal: "Visit source confirmation",
      message: "Source packet is still missing the signed visit-source confirmation referenced in the monitoring note.",
      openedAt: "2026-05-24T08:00:00Z",
      dueAt: "2026-05-30T18:00:00Z"
    },
    {
      id: "PKT-002",
      caseId: "DEV-1042",
      study: "ONC-241 Phase II",
      site: "Boston Investigational Site 07",
      owner: "Site Training",
      domain: "CONSENT",
      kind: "Training",
      severity: "medium",
      status: "OPEN",
      scope: "Dose escalation",
      principal: "Retraining signoff",
      message: "Coordinator retraining proof does not yet reconcile the delayed transcription event.",
      openedAt: "2026-05-26T12:00:00Z",
      dueAt: "2026-05-30T18:00:00Z"
    },
    {
      id: "PKT-003",
      caseId: "DEV-3109",
      study: "IMM-330 Extension",
      site: "Dallas Site 04",
      owner: "Regulatory Affairs",
      domain: "CAPA",
      kind: "CAPA",
      severity: "high",
      status: "OPEN",
      scope: "Open-label extension",
      principal: "CAPA chronology",
      message: "CAPA packet is missing the final chronology tying the accountability mismatch to the corrective action plan.",
      openedAt: "2026-05-23T09:30:00Z",
      dueAt: "2026-05-29T21:00:00Z"
    },
    {
      id: "PKT-004",
      caseId: "DEV-3109",
      study: "IMM-330 Extension",
      site: "Dallas Site 04",
      owner: "Safety Operations",
      domain: "SAFETY",
      kind: "Safety",
      severity: "medium",
      status: "OPEN",
      scope: "Open-label extension",
      principal: "Safety narrative appendix",
      message: "Safety narrative appendix needs reattached proof after the reopened deviation review.",
      openedAt: "2026-05-25T16:00:00Z",
      dueAt: "2026-05-29T21:00:00Z"
    },
    {
      id: "PKT-005",
      caseId: "DEV-2077",
      study: "NEU-118 Longitudinal",
      site: "Chicago Research Site 12",
      owner: "Site Operations",
      domain: "SOURCE_DATA",
      kind: "Source",
      severity: "low",
      status: "RESOLVED",
      scope: "Maintenance arm",
      principal: "Visit window justification",
      message: "Visit window packet was accepted on the last sponsor QA touchpoint.",
      openedAt: "2026-05-22T10:00:00Z",
      dueAt: "2026-05-28T17:00:00Z"
    }
  ]
};

export const protocolLanePackets = [
  {
    id: "intake-lane",
    lane: "Deviation intake and packet triage",
    owner: "Clinical Quality",
    focus: "Missing packet capture and inspection-ready deviation context",
    status: "RED",
    nextAction: "Repair the two at-risk packets before inspection posture hardens.",
    note: "The intake desk should surface which deviations are missing proof, not just ticket counts."
  },
  {
    id: "source-lane",
    lane: "Source data reconciliation",
    owner: "Clinical Quality",
    focus: "Visit source confirmation and monitoring evidence",
    status: "YELLOW",
    nextAction: "Close the source confirmation gap for DEV-1042.",
    note: "Source packets need owner-safe routing before they become inspection exceptions."
  },
  {
    id: "training-lane",
    lane: "Training and retraining proof",
    owner: "Site Training",
    focus: "Coordinator signoff and procedural retraining evidence",
    status: "YELLOW",
    nextAction: "Complete retraining reconciliation for the delayed transcription event.",
    note: "Training drift stays visible before it contaminates the CAPA packet."
  },
  {
    id: "capa-lane",
    lane: "CAPA posture",
    owner: "Regulatory Affairs",
    focus: "Corrective action chronology and review-safe packet handoff",
    status: "RED",
    nextAction: "Finalize the chronology and route the IMM-330 CAPA packet to review.",
    note: "CAPA packets must stay readable to both operators and inspectors."
  }
];

export const capaPackets = [
  {
    packetId: "CAPA-14",
    lane: "ONC-241 source reconciliation",
    owner: "Clinical Quality",
    completenessScore: 58,
    status: "RED",
    blocker: "Source confirmation still missing",
    launchWindowHours: 18,
    decisionNote: "Do not close the deviation until the signed source confirmation and retraining proof are bundled together."
  },
  {
    packetId: "CAPA-18",
    lane: "NEU-118 visit window packet",
    owner: "Site Operations",
    completenessScore: 91,
    status: "GREEN",
    blocker: "No active blocker",
    launchWindowHours: 42,
    decisionNote: "Packet is safe for sponsor QA confirmation and operator follow-up."
  },
  {
    packetId: "CAPA-22",
    lane: "IMM-330 CAPA bundle",
    owner: "Regulatory Affairs",
    completenessScore: 63,
    status: "YELLOW",
    blocker: "Safety appendix proof is stale",
    launchWindowHours: 12,
    decisionNote: "CAPA can clear if safety evidence is repaired in the current review cycle."
  }
];
