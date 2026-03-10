import React from "react";

export interface Agent {
  id: string;
  name: string;
  description: string;
  iconColor: string;
  icon: React.ReactNode;
}

const createIcon = (
  path: string,
  viewBox = "0 0 24 24",
  fillType: "fill" | "stroke" = "stroke"
) =>
  React.createElement(
    "svg",
    {
      className: "w-6 h-6",
      fill: fillType === "fill" ? "currentColor" : "none",
      stroke: fillType === "stroke" ? "currentColor" : undefined,
      viewBox: viewBox,
      strokeWidth: fillType === "stroke" ? 2 : undefined,
      strokeLinecap: fillType === "stroke" ? ("round" as const) : undefined,
      strokeLinejoin: fillType === "stroke" ? ("round" as const) : undefined,
    },
    React.createElement("path", { d: path })
  );

export const revenueCycleAgents: Agent[] = [
  {
    id: "payment-reconciliation",
    name: "Patient Smart Scheduler",
    description:
      "Intelligently allocates appointment slots based on provider availability, patient preferences, and clinical needs.",
    iconColor: "bg-blue-500",
    icon: createIcon("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"),
  },
  {
    id: "denial-analytics",
    name: "Eligibility Verification Agent",
    description:
      "Performs real-time insurance eligibility and benefits checks with 95%+ accuracy.",
    iconColor: "bg-pink-500",
    icon: createIcon(
      "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    ),
  },
  {
    id: "compliance-assistant",
    name: "Registration Assistant",
    description:
      "Auto-completes patient intake forms, validates demographics, and eliminates registration errors.",
    iconColor: "bg-cyan-500",
    icon: createIcon(
      "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    ),
  },
  {
    id: "ar-intelligence",
    name: "Prior Authorization Agent",
    description:
      "Automates end-to-end PA creation, submission, document extraction, and follow-up for faster approvals.",
    iconColor: "bg-purple-500",
    icon: createIcon("M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"),
  },
  {
    id: "appeal-automation",
    name: "Clinical Documentation Agent",
    description:
      "Extracts medical data, codes accurately, and validates medical necessity with 98%+ precision.",
    iconColor: "bg-slate-500",
    icon: createIcon(
      "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    ),
  },
  {
    id: "ai-governance",
    name: "Compliance Validator",
    description:
      "Ensures complete alignment with payer policies and regulatory guidelines through automated coding checks.",
    iconColor: "bg-rose-500",
    icon: createIcon(
      "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
    ),
  },
  {
    id: "revenue-audit",
    name: "Claims Automation Agent",
    description:
      "Achieves higher clean claim rate using predictive claim validation and real-time edits.",
    iconColor: "bg-blue-500",
    icon: createIcon(
      "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    ),
  },
  {
    id: "root-cause-analyzer",
    name: "Claims Management Agent",
    description:
      "Accelerates claim routing and tracking with automated payer workflows and exception handling.",
    iconColor: "bg-pink-500",
    icon: createIcon("M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"),
  },
  {
    id: "predictive-forecasting",
    name: "Denial Analytics & Recovery Agent",
    description:
      "Reduces denials with proactive denial prediction and intelligent root-cause prevention.",
    iconColor: "bg-cyan-500",
    icon: createIcon("M13 10V3L4 14h7v7l9-11h-7z"),
  },
  {
    id: "patient-payment",
    name: "Payment Reconciliation Agent",
    description:
      "Automates payment posting with higher accuracy using AI-driven matching and variance detection.",
    iconColor: "bg-purple-500",
    icon: createIcon(
      "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
    ),
  },
  {
    id: "priority-intelligence",
    name: "A/R Intelligence Agent",
    description:
      "Improves collection rates with smart account prioritization and patient engagement automation.",
    iconColor: "bg-slate-500",
    icon: createIcon(
      "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    ),
  },
  {
    id: "continuous-learning",
    name: "Revenue Cycle Audit Agent",
    description:
      "Cuts audit and reconciliation workload significantly using automated financial variance detection and resolution.",
    iconColor: "bg-rose-500",
    icon: createIcon(
      "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    ),
  },
];

export const operationalAgents: Agent[] = [
  {
    id: "patient-scheduler",
    name: "Patient Smart Scheduler",
    description:
      "Optimizes appointment scheduling with intelligent slot allocation and patient preference matching",
    iconColor: "bg-blue-500",
    icon: createIcon(
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    ),
  },
  {
    id: "clinical-documentation",
    name: "Clinical Documentation Agent",
    description:
      "AI-powered clinical documentation with 98% coding accuracy and automated validation",
    iconColor: "bg-pink-500",
    icon: createIcon(
      "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    ),
  },
  {
    id: "claims-automation",
    name: "Claims Automation Agent",
    description:
      "Achieves 95% clean claim rate through predictive analytics and intelligent validation",
    iconColor: "bg-cyan-500",
    icon: createIcon("M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"),
  },
  {
    id: "eligibility-verification",
    name: "Eligibility Verification Agent",
    description:
      "Real-time insurance eligibility verification with 95%+ accuracy in benefits confirmation",
    iconColor: "bg-purple-500",
    icon: createIcon(
      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    ),
  },
  {
    id: "cdi-optimization",
    name: "CDI Optimization Agent",
    description:
      "Increases case mix index by 40% through intelligent documentation improvement",
    iconColor: "bg-slate-500",
    icon: createIcon(
      "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    ),
  },
  {
    id: "claims-management",
    name: "Claims Management Agent",
    description:
      "Accelerates claim processing by 82% with intelligent payer routing and tracking",
    iconColor: "bg-rose-500",
    icon: createIcon("M13 10V3L4 14h7v7l9-11h-7z"),
  },
  {
    id: "prior-authorization",
    name: "Prior Authorization Agent",
    description:
      "Automates prior authorization requests with 75% faster approval times",
    iconColor: "bg-blue-500",
    icon: createIcon(
      "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    ),
  },
  {
    id: "compliance-validator",
    name: "Compliance Validator",
    description:
      "Ensures 100% regulatory adherence with automated coding validation and audit trails",
    iconColor: "bg-pink-500",
    icon: createIcon(
      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    ),
  },
  {
    id: "rcm-analytics",
    name: "RCM Performance Analytics Agent",
    description:
      "Provides 24/7 claim lifecycle tracking with automated exception handling",
    iconColor: "bg-cyan-500",
    icon: createIcon(
      "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    ),
  },
  {
    id: "registration-assistant",
    name: "Registration Assistant",
    description:
      "Streamlines patient registration with intelligent form completion and error prevention",
    iconColor: "bg-purple-500",
    icon: createIcon(
      "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    ),
  },
  {
    id: "query-assistant",
    name: "Query Assistant",
    description:
      "Reduces physician query time by 50% with intelligent clarification requests",
    iconColor: "bg-slate-500",
    icon: createIcon(
      "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ),
  },
  {
    id: "payer-intelligence",
    name: "Payer Intelligence Agent",
    description:
      "Optimizes payer-specific requirements with machine learning pattern recognition",
    iconColor: "bg-rose-500",
    icon: createIcon(
      "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    ),
  },
];

export const allAgents: Agent[] = [...revenueCycleAgents, ...operationalAgents];
