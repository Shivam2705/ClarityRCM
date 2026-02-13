import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClinicalData } from "@/data/clinicalData";
import { WorkflowSteps, WorkflowStep } from "./WorkflowSteps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuditLogsDialog } from "@/components/ui/audit-logs-dialog";
import { getCaseById, Case } from "@/data/mockCases";
import {
  FileText,
  Shield,
  GitBranch,
  FileSearch,
  AlertTriangle,
  Send,
  ArrowRight,
  Edit3,
  CheckCircle2,
  XCircle,
  Bot,
  Sparkles,
  Mail,
  FileWarning,
  Play,
  RefreshCw,
  Eye,
  Loader2,
  FileUp,
  ThumbsUp,
  ThumbsDown,
  ClipboardList,
  HelpCircle,
  Scale,
  Gavel,
  Target,
  CircleDot,
} from "lucide-react";
import { get } from "node:http";

// Type for the agent API response
interface PriorAuthAgentResponse {
  summary: {
    cpt_code: string;
    description: string;
    payer: string;
    overall_recommendation: string;
  };
  pre_certification_analysis: {
    pa_required: boolean;
    authorization_type: string;
    estimated_tat_days: string;
  };
  state_policy_analysis: {
    state: string;
    applicable_laws: { law_name: string; description: string; impact: string }[];
    reviewer_requirement: string;
  };
  decision_tree_validation: {
    policy_id: string;
    policy_wording: string;
    logic_path: { step: number; criteria: string; patient_evidence: string; satisfied: boolean }[];
  };
  gap_comparison_table: {
    requirement: string;
    current_evidence: string;
    status: string;
    action_required: string | null;
  }[];
  final_recommendation: {
    decision: string;
    primary_reason: string;
    risk_of_denial: string;
    next_steps: string[];
  };
}

const BASE_URL = "https://rcmhc-agents-1037311574972.us-central1.run.app";
const APP_NAME = "Prior_Auth_Version2";

async function callPriorAuthAgent(payload: { cpt: string; payer: string; state: string; notes: string }): Promise<PriorAuthAgentResponse> {
  const userId = "u_web_client";
  const sessionId = crypto.randomUUID();

  // 1. Initialize Session
  const sessionUrl = `${BASE_URL}/apps/${APP_NAME}/users/${userId}/sessions/${sessionId}`;
  await fetch(sessionUrl, { method: 'POST' });

  // 2. Run the Multi-Agent Pipeline
  const runUrl = `${BASE_URL}/run`;
  const runPayload = {
    app_name: APP_NAME,
    user_id: userId,
    session_id: sessionId,
    new_message: {
      parts: [{ text: `Analyze CPT ${payload.cpt} for ${payload.payer} in ${payload.state}. Clinical Notes: ${payload.notes}` }]
    }
  };

  const response = await fetch(runUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(runPayload)
  });

  if (!response.ok) {
    throw new Error(`Agent API error: ${response.status}`);
  }

  const events = await response.json();
//   const events = [
//     {
//         "modelVersion": "gemini-2.5-flash",
//         "content": {
//             "parts": [
//                 {
//                     "text": "Aetna requires precertification for CPT 27447, Arthroplasty, knee, condyle and plateau; medial AND lateral compartments with or without patella resurfacing (total knee arthroplasty), especially for elective inpatient admissions. The clinical notes provided for Sarah Johnson, detailing progressively worsening right knee pain consistent with advanced osteoarthritis, persistent severe pain, significant functional limitation, failure of extensive conservative management, and radiographic evidence of end-stage degenerative joint disease, align with Aetna's medical necessity criteria for total knee arthroplasty. Aetna considers a member to have advanced joint disease demonstrated by pain and functional disability that interferes with activities of daily living due to osteoarthritis, among other conditions, as criteria for initial approval. When reviewing precertification requests, Aetna considers the member's clinical circumstances and Milliman Care Guidelines (MCG).\n\nFlorida state laws impact the prior authorization process with specific requirements for health plans operating in the state. Health plans licensed under Chapter 641 must provide treatment authorization 24 hours a day, seven days a week, and establish written procedures for authorization requests. For urgent requests, prior authorization decisions should be made within 24 hours. For non-urgent requests, decisions are expected within 5 business days for plans licensed under Ch. 627, 641, and Medicaid. However, other sources indicate general prior authorization laws in Florida require decisions within 72 hours for urgent electronic requests and 7 days for non-urgent electronic requests, with longer timeframes for non-electronic submissions.\n\nBeginning in 2025, CMS guidelines for Florida mandate that all prior authorization requests be submitted electronically. Florida law also requires insurers to make prior authorization policies, including clinical criteria, easily understandable and accessible online. Adverse decisions must include the reason for denial and information on how to appeal. Prior authorizations are generally presumed valid for at least a year and cannot be revoked or restricted if care is provided within 45 business days of approval.\n\nAs of November 2024, Florida is not among the states that have passed \"Gold Carding\" legislation, which would exempt providers with high prior authorization approval rates from needing prior authorization for certain services. While some payers, such as UnitedHealthcare, have implemented their own Gold Card programs, there is no indication from the provided search results that Aetna in Florida currently has a specific Gold Card program that would apply to this CPT code. Therefore, precertification for CPT 27447 for Sarah Johnson will need to follow the standard Aetna precertification process, adhering to Florida's statutory timelines and electronic submission requirements."
//                 }
//             ],
//             "role": "model"
//         },
//         "groundingMetadata": {
//             "groundingChunks": [
//                 {
//                     "web": {
//                         "domain": "aetna.com",
//                         "title": "aetna.com",
//                         "uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGWOSm0Q3SiDAB7atSx6C6upTAkTF-m3OCZ7hl0kEMlQbER6pb6pfGP8hP-f-ruSUOUOIf_n3cuFpo6R4_mOBI3eGBdpVTpYVORnXWK5O02xH_Uvo8kPpVQaZk1gsxIGUz0VooC5xnThwvwYtfppKsv-qpi"
//                     }
//                 },
//                 {
//                     "web": {
//                         "domain": "aetna.com",
//                         "title": "aetna.com",
//                         "uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFiF_JHCBq4vpmPY3FPjnp4txwizzZg3Vu1ffR-wmQTMt57yejVbcgsi8Cehu3aMepRTJdqisOn9vUqiDtYycCkAnq304geTsoQhyA7gjsWyOJ8jWjTTqlYIj7KMH4yVsblCo6YPl7Yx185vGo_zpRFR0PfFd-cFgjjGUCEqK-PPZ6JD-hil3zHeshtfR6OjZoLKpzf15Ki_MceMlmfHSE="
//                     }
//                 },
//                 {
//                     "web": {
//                         "domain": "mercyoptions.net",
//                         "title": "mercyoptions.net",
//                         "uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQED2tD37KwjBwMNrh6VrG19UxDcqMaz41Af-pm9gq7EmWuZvfl7Hc8-CMlTGqYDHMVi6UpCztm1KaE9SUuJPJ2cUwlULenw6DlWq39LlGERR1Cb_W7omy3CAB6zW1PnIl5SxVxmD6033g9vt8Y5xFtZQDHGO-MjnzgKWVUNdEaagDbQnGTa4K91zFWkl5ebmeeA32wxVywM-Q=="
//                     }
//                 },
//                 {
//                     "web": {
//                         "domain": "fha.org",
//                         "title": "fha.org",
//                         "uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEbBaWbIloQJ05aAPP8sHr16M68qx9IHisy5U8lYX2PQ_TdNGxLGiHSX30DT6qlg--Rp4mfw_bfqLhkzxhx4oHdPuZeZJT5zzXaIjBbP81135di74FZFRaIXnGt6jr8rpgCrG-GhDwq0sHv7HA5BZzq5KOqRE0t57UuxgsamYmv-yIewIdDdWeP0GSCMHanq5NqQxKv_ZFoU4iW6RMXvw0WVyTw6N-u-N2wuOTBYIj-FgXr_jpsUMGmDVRqbSrq_5OMymtucx0hhg=="
//                     }
//                 },
//                 {
//                     "web": {
//                         "domain": "sunknowledge.com",
//                         "title": "sunknowledge.com",
//                         "uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGveO-tqBMRBRJhqsEZrzGdPqnfv2ghNVGZ3hDpxHngcf_JzpYE4ZtLaTfTZHdmUWtsQ74oijHzzxuEvApzHo_jEc_cX7pvyjATxvBTP6b4QTyIYIfDhM7Eb1iB5ktRBug0U5n-K-tZzx82KcoyJ9ACy9PYVg8kZn91NQmO0auUx-kH0r1VsMHBpVs6RvjDEr-fC4prdPkVfztGj-5l_AW2UUPcInnkew=="
//                     }
//                 },
//                 {
//                     "web": {
//                         "domain": "triagecancer.org",
//                         "title": "triagecancer.org",
//                         "uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGKYVcHcMLT8tiW99n1YoxQ1yLjYIZkE3SU6kMAa94bifWdzMqinUlKy3VhPKGsmdx6qWn3Id436ycv_liGcWbG_ydhm7yrkOFBp2h97mXwgu3YqhisJERUulcZaAbVMti8H8DcvzsayqfJm4hfNNE_Tf4ZQwqUh2WiqZ0_eSk_PlgNxA=="
//                     }
//                 },
//                 {
//                     "web": {
//                         "domain": "phslrx.com",
//                         "title": "phslrx.com",
//                         "uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGyihFCzA3X0Zwy_-h_4um7953ArD84UrGsTUD9F8cBwV-8bB7Z-_Ig1owYjM54ruPwDM4DEKJYz_A72nbUsHzaufP2z5hf0are51S7TJyRroyYO4K6sJjVSkwnNzFBHXIZkXDteNF1DmXfmMzti1HOCFsI9rJUM5vfFX9CtGJ8POaItmzdvjnydh2g8Q=="
//                     }
//                 },
//                 {
//                     "web": {
//                         "domain": "flmedical.org",
//                         "title": "flmedical.org",
//                         "uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGQekF1300QxC3EbTtOZrPSl3gkZwttRBTQUyyBSW-J--CXFnG4Hi3VpkEi8CF61YQLaBW3HhbLnYY-HnNeap2zWBEf_KFhJTFnCL8R8zDPklkX9C8qnD9BWAVrnIozlptAobQ82jnw8idPnQPFsJvKOWHQfpMaxZbbm2s9kKuCIrFZnr8feD91uTlFeGxk4wooZenrBnZF"
//                     }
//                 },
//                 {
//                     "web": {
//                         "domain": "floridasocietyofnephrology.com",
//                         "title": "floridasocietyofnephrology.com",
//                         "uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGLlKwr2AzHvocvvH3RSegoAyZB8TZZIWAij7gxpv7xbluM7nsm_blBY6SmRQm3PVoAgLb5gN47kSj0k7UxzTZ0U8D1O6e9_hSoEvsCfsuE2vM_TXAkxQtDrw-rT7JNN9QW-lErLXRMasbKPrT0LbNKvxStMWPW-QUFpbxXvfq1B1UkXphtad0LhDuR_5akSllT7wYEfxbk74I_nnV3ZZPUbQKfQ7pSzmVdI4J1uZhKoyi5WwRgkA=="
//                     }
//                 }
//             ],
//             "groundingSupports": [
//                 {
//                     "groundingChunkIndices": [
//                         0,
//                         1,
//                         2
//                     ],
//                     "segment": {
//                         "endIndex": 228,
//                         "text": "Aetna requires precertification for CPT 27447, Arthroplasty, knee, condyle and plateau; medial AND lateral compartments with or without patella resurfacing (total knee arthroplasty), especially for elective inpatient admissions."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         0
//                     ],
//                     "segment": {
//                         "endIndex": 613,
//                         "startIndex": 229,
//                         "text": "The clinical notes provided for Sarah Johnson, detailing progressively worsening right knee pain consistent with advanced osteoarthritis, persistent severe pain, significant functional limitation, failure of extensive conservative management, and radiographic evidence of end-stage degenerative joint disease, align with Aetna's medical necessity criteria for total knee arthroplasty."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         0
//                     ],
//                     "segment": {
//                         "endIndex": 845,
//                         "startIndex": 614,
//                         "text": "Aetna considers a member to have advanced joint disease demonstrated by pain and functional disability that interferes with activities of daily living due to osteoarthritis, among other conditions, as criteria for initial approval."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         2
//                     ],
//                     "segment": {
//                         "endIndex": 975,
//                         "startIndex": 846,
//                         "text": "When reviewing precertification requests, Aetna considers the member's clinical circumstances and Milliman Care Guidelines (MCG)."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         3
//                     ],
//                     "segment": {
//                         "endIndex": 1275,
//                         "startIndex": 1103,
//                         "text": "Health plans licensed under Chapter 641 must provide treatment authorization 24 hours a day, seven days a week, and establish written procedures for authorization requests."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         3,
//                         4
//                     ],
//                     "segment": {
//                         "endIndex": 1358,
//                         "startIndex": 1276,
//                         "text": "For urgent requests, prior authorization decisions should be made within 24 hours."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         3
//                     ],
//                     "segment": {
//                         "endIndex": 1482,
//                         "startIndex": 1459,
//                         "text": "627, 641, and Medicaid."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         5
//                     ],
//                     "segment": {
//                         "endIndex": 1725,
//                         "startIndex": 1483,
//                         "text": "However, other sources indicate general prior authorization laws in Florida require decisions within 72 hours for urgent electronic requests and 7 days for non-urgent electronic requests, with longer timeframes for non-electronic submissions."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         4
//                     ],
//                     "segment": {
//                         "endIndex": 1847,
//                         "startIndex": 1727,
//                         "text": "Beginning in 2025, CMS guidelines for Florida mandate that all prior authorization requests be submitted electronically."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         5
//                     ],
//                     "segment": {
//                         "endIndex": 1994,
//                         "startIndex": 1848,
//                         "text": "Florida law also requires insurers to make prior authorization policies, including clinical criteria, easily understandable and accessible online."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         5
//                     ],
//                     "segment": {
//                         "endIndex": 2081,
//                         "startIndex": 1995,
//                         "text": "Adverse decisions must include the reason for denial and information on how to appeal."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         5
//                     ],
//                     "segment": {
//                         "endIndex": 2244,
//                         "startIndex": 2082,
//                         "text": "Prior authorizations are generally presumed valid for at least a year and cannot be revoked or restricted if care is provided within 45 business days of approval."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         6
//                     ],
//                     "segment": {
//                         "endIndex": 2472,
//                         "startIndex": 2246,
//                         "text": "As of November 2024, Florida is not among the states that have passed \"Gold Carding\" legislation, which would exempt providers with high prior authorization approval rates from needing prior authorization for certain services."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         7,
//                         8,
//                         6
//                     ],
//                     "segment": {
//                         "endIndex": 2720,
//                         "startIndex": 2473,
//                         "text": "While some payers, such as UnitedHealthcare, have implemented their own Gold Card programs, there is no indication from the provided search results that Aetna in Florida currently has a specific Gold Card program that would apply to this CPT code."
//                     }
//                 }
//             ],
//             "searchEntryPoint": {
//                 "renderedContent": "<style>\n.container {\n  align-items: center;\n  border-radius: 8px;\n  display: flex;\n  font-family: Google Sans, Roboto, sans-serif;\n  font-size: 14px;\n  line-height: 20px;\n  padding: 8px 12px;\n}\n.chip {\n  display: inline-block;\n  border: solid 1px;\n  border-radius: 16px;\n  min-width: 14px;\n  padding: 5px 16px;\n  text-align: center;\n  user-select: none;\n  margin: 0 8px;\n  -webkit-tap-highlight-color: transparent;\n}\n.carousel {\n  overflow: auto;\n  scrollbar-width: none;\n  white-space: nowrap;\n  margin-right: -12px;\n}\n.headline {\n  display: flex;\n  margin-right: 4px;\n}\n.gradient-container {\n  position: relative;\n}\n.gradient {\n  position: absolute;\n  transform: translate(3px, -9px);\n  height: 36px;\n  width: 9px;\n}\n@media (prefers-color-scheme: light) {\n  .container {\n    background-color: #fafafa;\n    box-shadow: 0 0 0 1px #0000000f;\n  }\n  .headline-label {\n    color: #1f1f1f;\n  }\n  .chip {\n    background-color: #ffffff;\n    border-color: #d2d2d2;\n    color: #5e5e5e;\n    text-decoration: none;\n  }\n  .chip:hover {\n    background-color: #f2f2f2;\n  }\n  .chip:focus {\n    background-color: #f2f2f2;\n  }\n  .chip:active {\n    background-color: #d8d8d8;\n    border-color: #b6b6b6;\n  }\n  .logo-dark {\n    display: none;\n  }\n  .gradient {\n    background: linear-gradient(90deg, #fafafa 15%, #fafafa00 100%);\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .container {\n    background-color: #1f1f1f;\n    box-shadow: 0 0 0 1px #ffffff26;\n  }\n  .headline-label {\n    color: #fff;\n  }\n  .chip {\n    background-color: #2c2c2c;\n    border-color: #3c4043;\n    color: #fff;\n    text-decoration: none;\n  }\n  .chip:hover {\n    background-color: #353536;\n  }\n  .chip:focus {\n    background-color: #353536;\n  }\n  .chip:active {\n    background-color: #464849;\n    border-color: #53575b;\n  }\n  .logo-light {\n    display: none;\n  }\n  .gradient {\n    background: linear-gradient(90deg, #1f1f1f 15%, #1f1f1f00 100%);\n  }\n}\n</style>\n<div class=\"container\">\n  <div class=\"headline\">\n    <svg class=\"logo-light\" width=\"18\" height=\"18\" viewBox=\"9 9 35 35\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n      <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M42.8622 27.0064C42.8622 25.7839 42.7525 24.6084 42.5487 23.4799H26.3109V30.1568H35.5897C35.1821 32.3041 33.9596 34.1222 32.1258 35.3448V39.6864H37.7213C40.9814 36.677 42.8622 32.2571 42.8622 27.0064V27.0064Z\" fill=\"#4285F4\"/>\n      <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M26.3109 43.8555C30.9659 43.8555 34.8687 42.3195 37.7213 39.6863L32.1258 35.3447C30.5898 36.3792 28.6306 37.0061 26.3109 37.0061C21.8282 37.0061 18.0195 33.9811 16.6559 29.906H10.9194V34.3573C13.7563 39.9841 19.5712 43.8555 26.3109 43.8555V43.8555Z\" fill=\"#34A853\"/>\n      <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M16.6559 29.8904C16.3111 28.8559 16.1074 27.7588 16.1074 26.6146C16.1074 25.4704 16.3111 24.3733 16.6559 23.3388V18.8875H10.9194C9.74388 21.2072 9.06992 23.8247 9.06992 26.6146C9.06992 29.4045 9.74388 32.022 10.9194 34.3417L15.3864 30.8621L16.6559 29.8904V29.8904Z\" fill=\"#FBBC05\"/>\n      <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M26.3109 16.2386C28.85 16.2386 31.107 17.1164 32.9095 18.8091L37.8466 13.8719C34.853 11.082 30.9659 9.3736 26.3109 9.3736C19.5712 9.3736 13.7563 13.245 10.9194 18.8875L16.6559 23.3388C18.0195 19.2636 21.8282 16.2386 26.3109 16.2386V16.2386Z\" fill=\"#EA4335\"/>\n    </svg>\n    <svg class=\"logo-dark\" width=\"18\" height=\"18\" viewBox=\"0 0 48 48\" xmlns=\"http://www.w3.org/2000/svg\">\n      <circle cx=\"24\" cy=\"23\" fill=\"#FFF\" r=\"22\"/>\n      <path d=\"M33.76 34.26c2.75-2.56 4.49-6.37 4.49-11.26 0-.89-.08-1.84-.29-3H24.01v5.99h8.03c-.4 2.02-1.5 3.56-3.07 4.56v.75l3.91 2.97h.88z\" fill=\"#4285F4\"/>\n      <path d=\"M15.58 25.77A8.845 8.845 0 0 0 24 31.86c1.92 0 3.62-.46 4.97-1.31l4.79 3.71C31.14 36.7 27.65 38 24 38c-5.93 0-11.01-3.4-13.45-8.36l.17-1.01 4.06-2.85h.8z\" fill=\"#34A853\"/>\n      <path d=\"M15.59 20.21a8.864 8.864 0 0 0 0 5.58l-5.03 3.86c-.98-2-1.53-4.25-1.53-6.64 0-2.39.55-4.64 1.53-6.64l1-.22 3.81 2.98.22 1.08z\" fill=\"#FBBC05\"/>\n      <path d=\"M24 14.14c2.11 0 4.02.75 5.52 1.98l4.36-4.36C31.22 9.43 27.81 8 24 8c-5.93 0-11.01 3.4-13.45 8.36l5.03 3.85A8.86 8.86 0 0 1 24 14.14z\" fill=\"#EA4335\"/>\n    </svg>\n    <div class=\"gradient-container\"><div class=\"gradient\"></div></div>\n  </div>\n  <div class=\"carousel\">\n    <a class=\"chip\" href=\"https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF___vfibJeGf4kyh2ipSE2XBKW2uQSFGqor15CrkD_tRBXPoaxAX55VJuMdEJ5SgVqlhTkWRscWvGl3PXUNawYv41vhx4rNNGDvTejUjRK_QL1aoloX4mJ7JM8I6enNqHnlXKIBtLDHpoxrCNegmLkUtL0-FXk1WtvTGKXcAdtrolozqC4r59o_5I6BV58Map8jm1NNRherrlyqz_TSVwlyJgaedclGKtgJI2B2A==\">Florida prior authorization laws insurance</a>\n    <a class=\"chip\" href=\"https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFxPnV9NJjF4sldnvbJ1Mx5Ct9OCCrDnRwtEXAYy7dR6cvPrOUu5_ujCRgP6xWY_QDwRPF_EFd4PF8yERAqs-PDhrrkvl0E-tImMOzpDIy22iHTGztKQYIoGmIFq48pH97lgiKJM9_fX6SpNCf7wCiRH6hWvhkTz6Dok_UaoWwyvRs-2ujvflF_sb1DUgJxv5fFE0ApIcoHvzzgdRBI1aw7d0a7oh8Fk1rsDYXsilbMntoxqDUmNQ==\">Aetna 2026 precertification list CPT 27447 Florida</a>\n    <a class=\"chip\" href=\"https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGcTYhtInViZyH-x0gzL0-oO7HtkPgmz2uSykIYIVWdZvJy3d405MA6WJYxiMSzFa6dra17wE-zI5DwVLeCW9acjSLLtWE9vxqC-6oZrCa2KDEc9AZu6kpult14W7BJlm0h-47TdVD2Cyh_tZqZ2AfWLP1A4LfSZEYzoJrovkIG3IYWNU5rFi5fCOaKOlHir4oRZn1_njHGkP5IRdyjiUjcJFKbGjWfqQwzEg==\">Aetna clinical policy CPT 27447 Florida</a>\n    <a class=\"chip\" href=\"https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEwOldQPMP1IPK0md3kUE3vi-b6kPUwVsRUvD5bCo3yySrRyQpsx-laxcSXO-LuSKVWE-IVrF6tQVsmKkoJcWu5IdLFY4QppaoBkgqlur17_Pd359YfrnNOMy54Dj0oK0Nd92Y_7JQncnd0KPghywDHsRhAs5BWjOQPzq9q6egDrt321jMynMiOFADaj_CO-NO8SXdteUrGTkFp1elz_4HfQygbOkExgJROKV0UqjqITQ==\">Florida statute prior authorization timelines</a>\n    <a class=\"chip\" href=\"https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFOTbgyB8DHL6T8ANggQqBXEdLnmFR4EiT1qzN3T4vYjLLPOIUi5TXdGCHJKmBENMYI8lkSlnzkDdltSPzaqUr3GaiNtyvgROU5eDsdIyJSvzEgHb8xKuyVE_EKEX-ILEA-Fyo6XZxw14G6GT1Ts-VlwvRT_Mv1oqck8Vd-RYXZS4HpX9DepQvcGU5c6HHQA4GMi-Cl2Lvn9kd97RAEQrJldZ21ed5BKU6cDxQeITbO\">Florida gold carding law prior authorization</a>\n  </div>\n</div>\n"
//             },
//             "webSearchQueries": [
//                 "Aetna 2026 precertification list CPT 27447 Florida",
//                 "Aetna clinical policy CPT 27447 Florida",
//                 "Florida prior authorization laws insurance",
//                 "Florida gold carding law prior authorization",
//                 "Florida statute prior authorization timelines"
//             ]
//         },
//         "finishReason": "STOP",
//         "usageMetadata": {
//             "candidatesTokenCount": 543,
//             "candidatesTokensDetails": [
//                 {
//                     "modality": "TEXT",
//                     "tokenCount": 543
//                 }
//             ],
//             "promptTokenCount": 318,
//             "promptTokensDetails": [
//                 {
//                     "modality": "TEXT",
//                     "tokenCount": 318
//                 }
//             ],
//             "thoughtsTokenCount": 1314,
//             "toolUsePromptTokenCount": 212,
//             "toolUsePromptTokensDetails": [
//                 {
//                     "modality": "TEXT",
//                     "tokenCount": 212
//                 }
//             ],
//             "totalTokenCount": 2387,
//             "trafficType": "ON_DEMAND"
//         },
//         "invocationId": "e-a926fa2f-77e7-46a7-b08c-1e036b51db6e",
//         "author": "ComplianceScout",
//         "actions": {
//             "stateDelta": {},
//             "artifactDelta": {},
//             "requestedAuthConfigs": {},
//             "requestedToolConfirmations": {}
//         },
//         "id": "25c6eade-a06c-4336-a938-cde929bc970b",
//         "timestamp": 1770990844.0833
//     },
//     {
//         "modelVersion": "gemini-2.5-flash",
//         "content": {
//             "parts": [
//                 {
//                     "text": "Aetna's Clinical Policy Bulletin (CPB) 0660 for Knee Arthroplasty outlines the medical necessity criteria for CPT 27447, Total Knee Arthroplasty (TKA). This policy generally applies to all Aetna plans, including those in Florida.\n\n**Medical Necessity Wording:**\n\nA Food and Drug Administration (FDA) approved total knee arthroplasty (TKA) prosthesis is considered medically necessary for adult members when specific criteria are met.\n\n**Step-by-Step Criteria for Approval (Total Knee Arthroplasty - CPT 27447):**\n\nFor a primary Total Knee Arthroplasty (CPT 27447) to be considered medically necessary, the adult member must meet the following criteria:\n\n1.  **Advanced Joint Disease:** The member must have advanced joint disease demonstrated by one of the following:\n    *   Pain and functional disability that interferes with activities of daily living (ADLs) due to osteoarthritis (degenerative joint disease).\n    *   Pain and functional disability that interferes with ADLs due to post-traumatic arthritis.\n    *   Pain and functional disability that interferes with ADLs due to inflammatory arthritis (e.g., rheumatoid arthritis).\n    *   Failure of a previous osteotomy with pain interfering with ADLs.\n    *   Distal femur or proximal tibia malunion by imaging with pain interfering with ADLs.\n    *   Distal femur or proximal tibia fracture or nonunion.\n    *   Malignancy of the distal femur, proximal tibia, knee joint, or adjacent soft tissues by imaging.\n    *   Failure of previous unicompartmental knee replacement with pain interfering with ADLs.\n\n2.  **Radiographic Evidence:** The member must have radiographic evidence of one of the following:\n    *   Moderate/severe osteoarthritis of the knee joint (i.e., Kellgren-Lawrence Grade 3 or 4).\n    *   Avascular necrosis (osteonecrosis) of the tibial or femoral condyle.\n    *   Rheumatoid arthritis (joint space narrowing).\n\n3.  **Failure of Conservative Therapy:** There must be an inadequate response to conservative measures. While not explicitly detailed as a duration for TKA in the provided snippets, Aetna policies generally require failure of conservative management for knee arthroplasty procedures. For example, for knee arthroscopy, failure of conservative therapy (including rest, activity modification, physical therapy, NSAIDs, analgesics, or corticosteroid injections) for at least three months is often specified. The provided clinical notes indicate Sarah Johnson's failure of extensive conservative management over more than two years, including NSAIDs, physical therapy, bracing, activity modification, and corticosteroid injections, which aligns with this requirement.\n\n**Absolute Contraindications (if any of these are present, TKA is generally not considered medically necessary):**\n\n*   Active infection of the joint or active systemic bacteremia that has not been totally eradicated.\n*   Active skin infection (exception recurrent cutaneous staph infections) or open wound within the planned surgical site of the knee.\n*   Corticosteroid injection into the joint within 12 weeks of the planned arthroplasty.\n*   Vascular insufficiency, significant muscular atrophy of the leg, or neuromuscular disease severe enough to compromise implant stability or post-operative recovery or quadriplegia.\n*   Osseous abnormalities that cannot be optimally managed and would increase the likelihood of a poor surgical outcome (e.g., inadequate bone stock to support the implant).\n*   Allergy to components of the implant (e.g., cobalt, chromium, or alumina).\n\nAetna requires precertification for elective inpatient admissions, including total knee arthroplasty (CPT 27447). Providers are encouraged to review CPB 0660 and use the precertification information request form to submit necessary documentation, including current history and physical, description of proposed treatment, and supporting medical records documenting clinical findings, conservative management with outcome, and current plan of care."
//                 }
//             ],
//             "role": "model"
//         },
//         "groundingMetadata": {
//             "groundingChunks": [
//                 {
//                     "web": {
//                         "domain": "aetna.com",
//                         "title": "aetna.com",
//                         "uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHqDoTrEqs5Jh9a9q3NJ1PhOEUctTAvvMbCIOPLAu4Ki7bqP37lVzzoiKEi99emnAynkgG5t2z656M3D1xeK6Ix0HBDn7mAW1MYToG4qybQtYj9_MksZ9dSQAuUNQLenHd5WD7p4juHfl24vWivKHgir0YUUG7pZZIKIdXoHNPwbAP2d7QfNpYsBtTCPUqAJIiyhuI8WQDYf3rwojyBKa1lUGOnMz1kLrmQCaFzxqCksf_jyw=="
//                     }
//                 },
//                 {
//                     "web": {
//                         "domain": "aetna.com",
//                         "title": "aetna.com",
//                         "uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHLwUFlUHTLjtN7lYw4fFf9QnUNFq967apXzP1XTis62e5CCmr6r5_2LxQouK_BoKeU_mofw02WYwqan_ZJhl5ML3m6TR3FwuS0mDYUmR-IE-OhGWuVzFJbKLqu9Yyl56CJGlz4AReHH-CAPUOAGH9n0Ew="
//                     }
//                 },
//                 {
//                     "web": {
//                         "domain": "aetna.com",
//                         "title": "aetna.com",
//                         "uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFOSOKLvBH7j2LJ457QPmzpO9ZLMh2_cb-YV6-jPD2xVo9xLeycY9s_YzbwXOAE73s7b6Y9CAgJiT9OZjIJPzQYHAFPaiZaihHVFhsTtg6cTW65e8aShBpjo8UUaDCmul6AH7RX5VHfgyzBtamcYiuZ6Qs="
//                     }
//                 },
//                 {
//                     "web": {
//                         "domain": "covenanthealthcare.com",
//                         "title": "covenanthealthcare.com",
//                         "uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH4HpDXNOJrQH3u9CIWUBWtQMnmsIP2h8dpnw7PQbjbC-fJPQCjkFU4fos7hSE17q3ky-Y5fROpH64LN4YUaBMFHRDk0giFHH7Ik5_hO-6-2WjpUVSylUA1kAou2m2SHMYt_A5Ok9vUhFwXQKubkuUJx-9XGOFeSWAuPKwrSPFDTGl0lrCKU2725et07oIs7dh5_zXTKgzEndLP3Hg_u38LiN6Jq4Ui"
//                     }
//                 },
//                 {
//                     "web": {
//                         "domain": "aetna.com",
//                         "title": "aetna.com",
//                         "uri": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH8Rp_C6e7WU8M2k8iBSbo0BC7ROSLY8GercLdryXDODOqgQlR2ODlDbwqrCOOWKfZFci111hb-UMucQrHVNEpJAlfwDJS4L3PSMb1BPMaavdxuBPyCODhIMhOjo8CwAIbxrVh4Anw60bmY-weQUqaCmJPMRTSxi4tIZhbE5hi9-RxtZ4NDvuc8JO3d3DjrRQp1qqV80XMH0NyM-q0J_9hoQCzfDGBHxe9_4Khg3tv6Idt8cw=="
//                     }
//                 }
//             ],
//             "groundingSupports": [
//                 {
//                     "groundingChunkIndices": [
//                         0
//                     ],
//                     "segment": {
//                         "endIndex": 228,
//                         "startIndex": 152,
//                         "text": "This policy generally applies to all Aetna plans, including those in Florida"
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1
//                     ],
//                     "segment": {
//                         "endIndex": 432,
//                         "startIndex": 263,
//                         "text": "A Food and Drug Administration (FDA) approved total knee arthroplasty (TKA) prosthesis is considered medically necessary for adult members when specific criteria are met"
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1
//                     ],
//                     "segment": {
//                         "endIndex": 766,
//                         "startIndex": 658,
//                         "text": "**Advanced Joint Disease:** The member must have advanced joint disease demonstrated by one of the following"
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1
//                     ],
//                     "segment": {
//                         "endIndex": 913,
//                         "startIndex": 766,
//                         "text": ":\n    *   Pain and functional disability that interferes with activities of daily living (ADLs) due to osteoarthritis (degenerative joint disease)."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1
//                     ],
//                     "segment": {
//                         "endIndex": 1209,
//                         "startIndex": 1141,
//                         "text": "*   Failure of a previous osteotomy with pain interfering with ADLs."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1
//                     ],
//                     "segment": {
//                         "endIndex": 1301,
//                         "startIndex": 1214,
//                         "text": "*   Distal femur or proximal tibia malunion by imaging with pain interfering with ADLs."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1
//                     ],
//                     "segment": {
//                         "endIndex": 1362,
//                         "startIndex": 1306,
//                         "text": "*   Distal femur or proximal tibia fracture or nonunion."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1
//                     ],
//                     "segment": {
//                         "endIndex": 1467,
//                         "startIndex": 1367,
//                         "text": "*   Malignancy of the distal femur, proximal tibia, knee joint, or adjacent soft tissues by imaging."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1
//                     ],
//                     "segment": {
//                         "endIndex": 1562,
//                         "startIndex": 1472,
//                         "text": "*   Failure of previous unicompartmental knee replacement with pain interfering with ADLs."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1
//                     ],
//                     "segment": {
//                         "endIndex": 1661,
//                         "startIndex": 1568,
//                         "text": "**Radiographic Evidence:** The member must have radiographic evidence of one of the following"
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1
//                     ],
//                     "segment": {
//                         "endIndex": 1759,
//                         "startIndex": 1661,
//                         "text": ":\n    *   Moderate/severe osteoarthritis of the knee joint (i.e., Kellgren-Lawrence Grade 3 or 4)."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1
//                     ],
//                     "segment": {
//                         "endIndex": 1836,
//                         "startIndex": 1764,
//                         "text": "*   Avascular necrosis (osteonecrosis) of the tibial or femoral condyle."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1
//                     ],
//                     "segment": {
//                         "endIndex": 1890,
//                         "startIndex": 1841,
//                         "text": "*   Rheumatoid arthritis (joint space narrowing)."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         2
//                     ],
//                     "segment": {
//                         "endIndex": 2395,
//                         "startIndex": 2176,
//                         "text": "For example, for knee arthroscopy, failure of conservative therapy (including rest, activity modification, physical therapy, NSAIDs, analgesics, or corticosteroid injections) for at least three months is often specified"
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1,
//                         0
//                     ],
//                     "segment": {
//                         "endIndex": 2768,
//                         "startIndex": 2657,
//                         "text": "**Absolute Contraindications (if any of these are present, TKA is generally not considered medically necessary)"
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1,
//                         0
//                     ],
//                     "segment": {
//                         "endIndex": 2874,
//                         "startIndex": 2773,
//                         "text": "*   Active infection of the joint or active systemic bacteremia that has not been totally eradicated."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1,
//                         0
//                     ],
//                     "segment": {
//                         "endIndex": 3009,
//                         "startIndex": 2875,
//                         "text": "*   Active skin infection (exception recurrent cutaneous staph infections) or open wound within the planned surgical site of the knee."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1
//                     ],
//                     "segment": {
//                         "endIndex": 3098,
//                         "startIndex": 3010,
//                         "text": "*   Corticosteroid injection into the joint within 12 weeks of the planned arthroplasty."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         1,
//                         0
//                     ],
//                     "segment": {
//                         "endIndex": 3282,
//                         "startIndex": 3099,
//                         "text": "*   Vascular insufficiency, significant muscular atrophy of the leg, or neuromuscular disease severe enough to compromise implant stability or post-operative recovery or quadriplegia."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         0
//                     ],
//                     "segment": {
//                         "endIndex": 3456,
//                         "startIndex": 3283,
//                         "text": "*   Osseous abnormalities that cannot be optimally managed and would increase the likelihood of a poor surgical outcome (e.g., inadequate bone stock to support the implant)."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         0
//                     ],
//                     "segment": {
//                         "endIndex": 3535,
//                         "startIndex": 3457,
//                         "text": "*   Allergy to components of the implant (e.g., cobalt, chromium, or alumina)."
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         0,
//                         3
//                     ],
//                     "segment": {
//                         "endIndex": 3649,
//                         "startIndex": 3537,
//                         "text": "Aetna requires precertification for elective inpatient admissions, including total knee arthroplasty (CPT 27447)"
//                     }
//                 },
//                 {
//                     "groundingChunkIndices": [
//                         0,
//                         4
//                     ],
//                     "segment": {
//                         "endIndex": 3983,
//                         "startIndex": 3651,
//                         "text": "Providers are encouraged to review CPB 0660 and use the precertification information request form to submit necessary documentation, including current history and physical, description of proposed treatment, and supporting medical records documenting clinical findings, conservative management with outcome, and current plan of care"
//                     }
//                 }
//             ],
//             "searchEntryPoint": {
//                 "renderedContent": "<style>\n.container {\n  align-items: center;\n  border-radius: 8px;\n  display: flex;\n  font-family: Google Sans, Roboto, sans-serif;\n  font-size: 14px;\n  line-height: 20px;\n  padding: 8px 12px;\n}\n.chip {\n  display: inline-block;\n  border: solid 1px;\n  border-radius: 16px;\n  min-width: 14px;\n  padding: 5px 16px;\n  text-align: center;\n  user-select: none;\n  margin: 0 8px;\n  -webkit-tap-highlight-color: transparent;\n}\n.carousel {\n  overflow: auto;\n  scrollbar-width: none;\n  white-space: nowrap;\n  margin-right: -12px;\n}\n.headline {\n  display: flex;\n  margin-right: 4px;\n}\n.gradient-container {\n  position: relative;\n}\n.gradient {\n  position: absolute;\n  transform: translate(3px, -9px);\n  height: 36px;\n  width: 9px;\n}\n@media (prefers-color-scheme: light) {\n  .container {\n    background-color: #fafafa;\n    box-shadow: 0 0 0 1px #0000000f;\n  }\n  .headline-label {\n    color: #1f1f1f;\n  }\n  .chip {\n    background-color: #ffffff;\n    border-color: #d2d2d2;\n    color: #5e5e5e;\n    text-decoration: none;\n  }\n  .chip:hover {\n    background-color: #f2f2f2;\n  }\n  .chip:focus {\n    background-color: #f2f2f2;\n  }\n  .chip:active {\n    background-color: #d8d8d8;\n    border-color: #b6b6b6;\n  }\n  .logo-dark {\n    display: none;\n  }\n  .gradient {\n    background: linear-gradient(90deg, #fafafa 15%, #fafafa00 100%);\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .container {\n    background-color: #1f1f1f;\n    box-shadow: 0 0 0 1px #ffffff26;\n  }\n  .headline-label {\n    color: #fff;\n  }\n  .chip {\n    background-color: #2c2c2c;\n    border-color: #3c4043;\n    color: #fff;\n    text-decoration: none;\n  }\n  .chip:hover {\n    background-color: #353536;\n  }\n  .chip:focus {\n    background-color: #353536;\n  }\n  .chip:active {\n    background-color: #464849;\n    border-color: #53575b;\n  }\n  .logo-light {\n    display: none;\n  }\n  .gradient {\n    background: linear-gradient(90deg, #1f1f1f 15%, #1f1f1f00 100%);\n  }\n}\n</style>\n<div class=\"container\">\n  <div class=\"headline\">\n    <svg class=\"logo-light\" width=\"18\" height=\"18\" viewBox=\"9 9 35 35\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n      <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M42.8622 27.0064C42.8622 25.7839 42.7525 24.6084 42.5487 23.4799H26.3109V30.1568H35.5897C35.1821 32.3041 33.9596 34.1222 32.1258 35.3448V39.6864H37.7213C40.9814 36.677 42.8622 32.2571 42.8622 27.0064V27.0064Z\" fill=\"#4285F4\"/>\n      <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M26.3109 43.8555C30.9659 43.8555 34.8687 42.3195 37.7213 39.6863L32.1258 35.3447C30.5898 36.3792 28.6306 37.0061 26.3109 37.0061C21.8282 37.0061 18.0195 33.9811 16.6559 29.906H10.9194V34.3573C13.7563 39.9841 19.5712 43.8555 26.3109 43.8555V43.8555Z\" fill=\"#34A853\"/>\n      <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M16.6559 29.8904C16.3111 28.8559 16.1074 27.7588 16.1074 26.6146C16.1074 25.4704 16.3111 24.3733 16.6559 23.3388V18.8875H10.9194C9.74388 21.2072 9.06992 23.8247 9.06992 26.6146C9.06992 29.4045 9.74388 32.022 10.9194 34.3417L15.3864 30.8621L16.6559 29.8904V29.8904Z\" fill=\"#FBBC05\"/>\n      <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M26.3109 16.2386C28.85 16.2386 31.107 17.1164 32.9095 18.8091L37.8466 13.8719C34.853 11.082 30.9659 9.3736 26.3109 9.3736C19.5712 9.3736 13.7563 13.245 10.9194 18.8875L16.6559 23.3388C18.0195 19.2636 21.8282 16.2386 26.3109 16.2386V16.2386Z\" fill=\"#EA4335\"/>\n    </svg>\n    <svg class=\"logo-dark\" width=\"18\" height=\"18\" viewBox=\"0 0 48 48\" xmlns=\"http://www.w3.org/2000/svg\">\n      <circle cx=\"24\" cy=\"23\" fill=\"#FFF\" r=\"22\"/>\n      <path d=\"M33.76 34.26c2.75-2.56 4.49-6.37 4.49-11.26 0-.89-.08-1.84-.29-3H24.01v5.99h8.03c-.4 2.02-1.5 3.56-3.07 4.56v.75l3.91 2.97h.88z\" fill=\"#4285F4\"/>\n      <path d=\"M15.58 25.77A8.845 8.845 0 0 0 24 31.86c1.92 0 3.62-.46 4.97-1.31l4.79 3.71C31.14 36.7 27.65 38 24 38c-5.93 0-11.01-3.4-13.45-8.36l.17-1.01 4.06-2.85h.8z\" fill=\"#34A853\"/>\n      <path d=\"M15.59 20.21a8.864 8.864 0 0 0 0 5.58l-5.03 3.86c-.98-2-1.53-4.25-1.53-6.64 0-2.39.55-4.64 1.53-6.64l1-.22 3.81 2.98.22 1.08z\" fill=\"#FBBC05\"/>\n      <path d=\"M24 14.14c2.11 0 4.02.75 5.52 1.98l4.36-4.36C31.22 9.43 27.81 8 24 8c-5.93 0-11.01 3.4-13.45 8.36l5.03 3.85A8.86 8.86 0 0 1 24 14.14z\" fill=\"#EA4335\"/>\n    </svg>\n    <div class=\"gradient-container\"><div class=\"gradient\"></div></div>\n  </div>\n  <div class=\"carousel\">\n    <a class=\"chip\" href=\"https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGzx5_cMDXNkPI5b9_e8Af1QsHoF4vYKdC0_WLqLsRdKEjIdOrNaD9CGIi2jyyMSRsOyquOrOIdw7IBqjtsRBS8EDbB_sbS57aUgJskqw_VUyIVyHghWjHz0GmFjXRlnsJZJEGkDAdonz7R-NrBnjuMy_FdeT3242lHZvemu2xJf7vNIKZ552_aWi4L5iI28_s=\">Aetna CPB 0241</a>\n    <a class=\"chip\" href=\"https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHHKNc-Rapvm3iiYccsTaszpTQeQWwWMiBE1y9fao8CtV9fVtvt8bG84DoFkS7KRIYKVVT6_1tR9blovObuuVHxt1nX_VEA3K3byR-_LKLS69RerI8J1VuCdTybbI9JmCiixnSbEasYBRvKtM1Ib5RPLBrfVmQEYK3RuvprJQzN8jYnlwxv2cxtDnNiZbUGxjMx4qN0C_rbxUdCDqKbXNVvYVvHo9sIH1smvub4CAH8b4-sySdYTsBAxjc2o9GfGrcFGi0=\">Aetna medical necessity criteria total knee arthroplasty Florida</a>\n    <a class=\"chip\" href=\"https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGqETAL0sJyqvI-aFmM3gE3Z-rdFuN9ENtvYX1CYOBJRqf2ZxkEa4WjYAby75p7jP8fE9UelJi94s61ndzz1yyFIZWNAGuFRnhEgYCKezIMrSV8kpvpFIdng6ww6Nb5bkURFZoeIzdkZfFmaLtFM4P25oh1SSUzffDPygyUjsmKGQz-0DKZXx1zrtGR6neZJB6Qolg70syfK2H2KfnyRDTzo9aKhm2R3XxF6Q4pTzZpbQ7Gbvia8irU-l0=\">Aetna clinical policy total knee arthroplasty CPT 27447</a>\n    <a class=\"chip\" href=\"https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEkhUgnara-nJwJuux1lHN1k--HkBgn5NqRIIrQAHXl2GlQHH26Ok_7tKj3OhWI52V2jg9E1Pct8RtD2pvL7PKMQ7c0LcEiJLiVOxNAUgyIx9bKnbOcRg649txfSxD4qO-d-49YVWO818U9H6mFPegr_IbYysps1qTojSZyKxdJuMD_Omr28eHv3yCH9v_CijE4Wy4TRZQW-Nw0YTW-E3OBzlUv-oUb3LAT\">Aetna clinical policy knee arthroplasty</a>\n  </div>\n</div>\n"
//             },
//             "webSearchQueries": [
//                 "Aetna clinical policy total knee arthroplasty CPT 27447",
//                 "Aetna medical necessity criteria total knee arthroplasty Florida",
//                 "Aetna clinical policy knee arthroplasty",
//                 "Aetna CPB 0241"
//             ]
//         },
//         "finishReason": "STOP",
//         "usageMetadata": {
//             "candidatesTokenCount": 846,
//             "candidatesTokensDetails": [
//                 {
//                     "modality": "TEXT",
//                     "tokenCount": 846
//                 }
//             ],
//             "promptTokenCount": 873,
//             "promptTokensDetails": [
//                 {
//                     "modality": "TEXT",
//                     "tokenCount": 873
//                 }
//             ],
//             "thoughtsTokenCount": 628,
//             "toolUsePromptTokenCount": 178,
//             "toolUsePromptTokensDetails": [
//                 {
//                     "modality": "TEXT",
//                     "tokenCount": 178
//                 }
//             ],
//             "totalTokenCount": 2525,
//             "trafficType": "ON_DEMAND"
//         },
//         "invocationId": "e-a926fa2f-77e7-46a7-b08c-1e036b51db6e",
//         "author": "PolicyScout",
//         "actions": {
//             "stateDelta": {},
//             "artifactDelta": {},
//             "requestedAuthConfigs": {},
//             "requestedToolConfirmations": {}
//         },
//         "id": "660a6ed7-6b58-4b22-abf0-42d426cfcc20",
//         "timestamp": 1770990858.004921
//     },
//     {
//         "modelVersion": "gemini-2.5-pro",
//         "content": {
//             "parts": [
//                 {
//                     "text": "{\n  \"summary\": {\n    \"cpt_code\": \"27447\",\n    \"description\": \"Arthroplasty, knee, condyle and plateau; medial AND lateral compartments with or without patella resurfacing (total knee arthroplasty)\",\n    \"payer\": \"Aetna\",\n    \"overall_recommendation\": \"Hold - Missing Documentation\"\n  },\n  \"pre_certification_analysis\": {\n    \"pa_required\": \"Yes\",\n    \"authorization_type\": \"Precertification for Elective Inpatient Admission\",\n    \"estimated_tat_days\": \"7\"\n  },\n  \"state_policy_analysis\": {\n    \"state\": \"Florida\",\n    \"applicable_laws\": [\n      {\n        \"law_id\": \"Florida Statutes Chapter 641\",\n        \"description\": \"Requires health plans to provide treatment authorization 24/7 and establish written procedures for authorization requests.\"\n      },\n      {\n        \"law_id\": \"Florida Statutes Chapter 627\",\n        \"description\": \"Specifies a 5-business day turnaround time for non-urgent prior authorization decisions.\"\n      },\n      {\n        \"law_id\": \"CMS Guidelines for Florida (2025)\",\n        \"description\": \"Mandates electronic submission for all prior authorization requests starting in 2025.\"\n      }\n    ],\n    \"reviewer_requirement\": \"Not specified in provided documentation.\"\n  },\n  \"decision_tree_validation\": {\n    \"policy_id\": \"Aetna CPB 0660\",\n    \"policy_wording\": \"A Food and Drug Administration (FDA) approved total knee arthroplasty (TKA) prosthesis is considered medically necessary for adult members when specific criteria are met.\",\n    \"logic_path\": [\n      {\n        \"step\": 1,\n        \"criteria\": \"Advanced joint disease demonstrated by pain and functional disability from osteoarthritis.\",\n        \"patient_evidence\": \"Patient has progressively worsening right knee pain over more than two years, rated up to 9/10, with significant functional limitation affecting ambulation and activities of daily living.\",\n        \"satisfied\": true\n      },\n      {\n        \"step\": 2,\n        \"criteria\": \"Radiographic evidence of moderate/severe osteoarthritis (Kellgren-Lawrence Grade 3 or 4).\",\n        \"patient_evidence\": \"Radiographs show severe medial compartment joint space narrowing, consistent with end-stage degenerative joint disease (Kellgren-Lawrence Grade IV).\",\n        \"satisfied\": true\n      },\n      {\n        \"step\": 3,\n        \"criteria\": \"Inadequate response to conservative measures.\",\n        \"patient_evidence\": \"Patient has failed extensive conservative management including NSAIDs, physical therapy, bracing, activity modification, and corticosteroid injections over more than two years.\",\n        \"satisfied\": true\n      },\n      {\n        \"step\": 4,\n        \"criteria\": \"Absence of absolute contraindications, specifically no corticosteroid injection into the joint within 12 weeks of the planned arthroplasty.\",\n        \"patient_evidence\": \"Clinical notes confirm corticosteroid injections were administered, but the date of the last injection is not documented.\",\n        \"satisfied\": false\n      }\n    ]\n  },\n  \"gap_comparison_table\": [\n    {\n      \"requirement\": \"Advanced joint disease (pain and functional disability from osteoarthritis)\",\n      \"current_evidence\": \"Progressively worsening pain up to 9/10 over two years with significant functional limitation in ADLs.\",\n      \"status\": \"met\",\n      \"action_required\": null\n    },\n    {\n      \"requirement\": \"Radiographic evidence of severe osteoarthritis (Kellgren-Lawrence Grade 3 or 4)\",\n      \"current_evidence\": \"Radiographs show Kellgren-Lawrence Grade IV changes.\",\n      \"status\": \"met\",\n      \"action_required\": null\n    },\n    {\n      \"requirement\": \"Failure of conservative therapy\",\n      \"current_evidence\": \"Documented failure of extensive conservative management including NSAIDs, physical therapy, bracing, and injections.\",\n      \"status\": \"met\",\n      \"action_required\": null\n    },\n    {\n      \"requirement\": \"Absence of contraindication: No corticosteroid injection within 12 weeks of surgery.\",\n      \"current_evidence\": \"Notes confirm corticosteroid injections were part of failed conservative therapy, but the date of the last injection is not documented.\",\n      \"status\": \"gap\",\n      \"action_required\": \"Obtain and document the date of the last corticosteroid injection to confirm it was not administered within 12 weeks of the surgery date.\"\n    }\n  ],\n  \"final_recommendation\": {\n    \"decision\": \"DO_NOT_SUBMIT\",\n    \"primary_reason\": \"Missing documentation for the date of the last corticosteroid injection. Aetna policy (CPB 0660) lists a steroid injection within 12 weeks of surgery as an absolute contraindication. The current notes do not provide the date of the last injection, creating a high risk of denial.\",\n    \"risk_of_denial\": \"High\",\n    \"next_steps\": [\n      \"Hold submission of the claim.\",\n      \"Review patient's detailed medication and procedure history to find the date of the last corticosteroid injection.\",\n      \"Provide an addendum to the clinical notes specifying the date of the last injection, ensuring it was administered more than 12 weeks prior to the total knee arthroplasty.\"\n    ]\n  }\n}"
//                 }
//             ],
//             "role": "model"
//         },
//         "finishReason": "STOP",
//         "usageMetadata": {
//             "candidatesTokenCount": 1225,
//             "candidatesTokensDetails": [
//                 {
//                     "modality": "TEXT",
//                     "tokenCount": 1225
//                 }
//             ],
//             "promptTokenCount": 2256,
//             "promptTokensDetails": [
//                 {
//                     "modality": "TEXT",
//                     "tokenCount": 2256
//                 }
//             ],
//             "thoughtsTokenCount": 1790,
//             "totalTokenCount": 5271,
//             "trafficType": "ON_DEMAND"
//         },
//         "avgLogprobs": -0.3263682338169643,
//         "invocationId": "e-a926fa2f-77e7-46a7-b08c-1e036b51db6e",
//         "author": "IntakeArchitect",
//         "actions": {
//             "stateDelta": {
//                 "final_prior_auth_json": {
//                     "summary": {
//                         "cpt_code": "27447",
//                         "description": "Arthroplasty, knee, condyle and plateau; medial AND lateral compartments with or without patella resurfacing (total knee arthroplasty)",
//                         "payer": "Aetna",
//                         "overall_recommendation": "Hold - Missing Documentation"
//                     },
//                     "pre_certification_analysis": {
//                         "pa_required": "Yes",
//                         "authorization_type": "Precertification for Elective Inpatient Admission",
//                         "estimated_tat_days": "7"
//                     },
//                     "state_policy_analysis": {
//                         "state": "Florida",
//                         "applicable_laws": [
//                             {
//                                 "law_id": "Florida Statutes Chapter 641",
//                                 "description": "Requires health plans to provide treatment authorization 24/7 and establish written procedures for authorization requests."
//                             },
//                             {
//                                 "law_id": "Florida Statutes Chapter 627",
//                                 "description": "Specifies a 5-business day turnaround time for non-urgent prior authorization decisions."
//                             },
//                             {
//                                 "law_id": "CMS Guidelines for Florida (2025)",
//                                 "description": "Mandates electronic submission for all prior authorization requests starting in 2025."
//                             }
//                         ],
//                         "reviewer_requirement": "Not specified in provided documentation."
//                     },
//                     "decision_tree_validation": {
//                         "policy_id": "Aetna CPB 0660",
//                         "policy_wording": "A Food and Drug Administration (FDA) approved total knee arthroplasty (TKA) prosthesis is considered medically necessary for adult members when specific criteria are met.",
//                         "logic_path": [
//                             {
//                                 "step": 1,
//                                 "criteria": "Advanced joint disease demonstrated by pain and functional disability from osteoarthritis.",
//                                 "patient_evidence": "Patient has progressively worsening right knee pain over more than two years, rated up to 9/10, with significant functional limitation affecting ambulation and activities of daily living.",
//                                 "satisfied": true
//                             },
//                             {
//                                 "step": 2,
//                                 "criteria": "Radiographic evidence of moderate/severe osteoarthritis (Kellgren-Lawrence Grade 3 or 4).",
//                                 "patient_evidence": "Radiographs show severe medial compartment joint space narrowing, consistent with end-stage degenerative joint disease (Kellgren-Lawrence Grade IV).",
//                                 "satisfied": true
//                             },
//                             {
//                                 "step": 3,
//                                 "criteria": "Inadequate response to conservative measures.",
//                                 "patient_evidence": "Patient has failed extensive conservative management including NSAIDs, physical therapy, bracing, activity modification, and corticosteroid injections over more than two years.",
//                                 "satisfied": true
//                             },
//                             {
//                                 "step": 4,
//                                 "criteria": "Absence of absolute contraindications, specifically no corticosteroid injection into the joint within 12 weeks of the planned arthroplasty.",
//                                 "patient_evidence": "Clinical notes confirm corticosteroid injections were administered, but the date of the last injection is not documented.",
//                                 "satisfied": false
//                             }
//                         ]
//                     },
//                     "gap_comparison_table": [
//                         {
//                             "requirement": "Advanced joint disease (pain and functional disability from osteoarthritis)",
//                             "current_evidence": "Progressively worsening pain up to 9/10 over two years with significant functional limitation in ADLs.",
//                             "status": "met"
//                         },
//                         {
//                             "requirement": "Radiographic evidence of severe osteoarthritis (Kellgren-Lawrence Grade 3 or 4)",
//                             "current_evidence": "Radiographs show Kellgren-Lawrence Grade IV changes.",
//                             "status": "met"
//                         },
//                         {
//                             "requirement": "Failure of conservative therapy",
//                             "current_evidence": "Documented failure of extensive conservative management including NSAIDs, physical therapy, bracing, and injections.",
//                             "status": "met"
//                         },
//                         {
//                             "requirement": "Absence of contraindication: No corticosteroid injection within 12 weeks of surgery.",
//                             "current_evidence": "Notes confirm corticosteroid injections were part of failed conservative therapy, but the date of the last injection is not documented.",
//                             "status": "gap",
//                             "action_required": "Obtain and document the date of the last corticosteroid injection to confirm it was not administered within 12 weeks of the surgery date."
//                         }
//                     ],
//                     "final_recommendation": {
//                         "decision": "DO_NOT_SUBMIT",
//                         "primary_reason": "Missing documentation for the date of the last corticosteroid injection. Aetna policy (CPB 0660) lists a steroid injection within 12 weeks of surgery as an absolute contraindication. The current notes do not provide the date of the last injection, creating a high risk of denial.",
//                         "risk_of_denial": "High",
//                         "next_steps": [
//                             "Hold submission of the claim.",
//                             "Review patient's detailed medication and procedure history to find the date of the last corticosteroid injection.",
//                             "Provide an addendum to the clinical notes specifying the date of the last injection, ensuring it was administered more than 12 weeks prior to the total knee arthroplasty."
//                         ]
//                     }
//                 }
//             },
//             "artifactDelta": {},
//             "requestedAuthConfigs": {},
//             "requestedToolConfirmations": {}
//         },
//         "id": "7ebd955d-e172-4724-a9a8-dfdba3fa2b65",
//         "timestamp": 1770990868.986844
//     }
// ]
  // 3. Find the Final Agent Output
  const finalEvent = events.reverse().find((e: any) =>
    e.actions && e.actions.stateDelta && e.actions.stateDelta.final_prior_auth_json
  );

  if (!finalEvent) {
    throw new Error("No final_prior_auth_json found in agent response");
  }

  const result:any = finalEvent.actions.stateDelta.final_prior_auth_json;
  // The result may be a string (JSON) or already parsed
  return typeof result === "string" ? JSON.parse(result) : result;
}

// Initial steps - only eligibility is active, others locked
const initialSteps: WorkflowStep[] = [
  {
    id: "eligibility",
    title: "Eligibility & Benefits",
    description: "Insurance verification",
    status: "active",
    canEdit: true,
  },
  {
    id: "document-analysis",
    title: "Document Analysis",
    description: "Document summary & review",
    status: "pending",
    canEdit: false,
  },
  {
    id: "prior-auth-decision",
    title: "Prior Auth Readiness Check",
    description: "Pre-certification & policy check",
    status: "pending",
    canEdit: false,
  },
  // {
  //   id: "gap-analysis",
  //   title: "Gap Analysis & Review",
  //   description: "Clinical audit & gaps",
  //   status: "pending",
  //   canEdit: false,
  // },
  {
    id: "submit-to-payer",
    title: "Submit to Payer",
    description: "Final submission & notification",
    status: "pending",
    canEdit: false,
  },
];

interface PreAuthProviderWorkflowProps {
  caseData: {
    id: string;
    patientName: string;
    patientId: string;
    dateOfBirth: string;
    encounterType: string;
    orderingProvider: string;
    payerName: string;
    procedureCode?: string;
    procedureName?: string;
    hasGaps?: boolean;
  };
}

export function PreAuthProviderWorkflow({ caseData }: PreAuthProviderWorkflowProps) {
  const { caseId } = useParams();
  const [currentStep, setCurrentStep] = useState("eligibility");
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [agentData, setAgentData] = useState<PriorAuthAgentResponse | null>();
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [corrections, setCorrections] = useState<Record<string, boolean>>({});
  const [eligibilityStatus, setEligibilityStatus] = useState<"idle" | "processing" | "eligible" | "not-eligible">(
    "idle",
  );
  const [hasAutoRun, setHasAutoRun] = useState(false);
  const [workflowPhase, setWorkflowPhase] = useState<
    "eligibility" | "document-analysis" | "unlocked" | "complete"
  >("eligibility");

  // Fetch case data from mockCases based on caseId
  const matchedCase: Case | undefined = caseId ? getCaseById(caseId) : undefined;
  // Use fetched case data, fallback to caseData prop if not found
  const activeCase = matchedCase || caseData;

  // Document summary available after analysis phase
  const documentSummary = getCaseById(caseId)?.documentSummary || "";
  
  // const documentSummary = `Patient documentation includes comprehensive clinical notes from ${activeCase.orderingProvider} documenting progressive knee condition with failed conservative management. Imaging studies confirm significant findings. Physical therapy records show treatment with limited improvement. All documentation supports medical necessity for ${activeCase.procedureName || "requested procedure"}.`;
  // Determine if this case has gaps based on caseId
  const caseHasGaps = caseId === "CASE-001" || activeCase.hasGaps;

  // Auto-run only eligibility and document analysis, then unlock manual navigation
  useEffect(() => {
    if (!hasAutoRun && eligibilityStatus === "idle") {
      setHasAutoRun(true);
      setEligibilityStatus("processing");

      // Phase 1: Eligibility (2 seconds)
      setTimeout(() => {
        const isEligible = true;
        const status = isEligible ? "eligible" : "not-eligible";
        setEligibilityStatus(status);
        setSteps((prev) =>
          prev.map((s) => {
            if (s.id === "eligibility") {
              return { ...s, status: "completed" as const, eligibilityStatus: status };
            }
            if (isEligible && s.id === "document-analysis") {
              return {
                ...s,
                status: "active" as const,
                documentAnalysisStatus: "in-progress" as const,
                canEdit: false,
              };
            }
            return s;
          }),
        );
        if (isEligible) {
          setCurrentStep("document-analysis");
          setWorkflowPhase("document-analysis");
        }
      }, 2000);
    }
  }, [hasAutoRun, eligibilityStatus]);

  // Phase 2: Document Analysis auto-run, then mark document analysis complete but keep other steps locked
  useEffect(() => {
    if (workflowPhase === "document-analysis") {
      const timer = setTimeout(() => {
        setSteps((prev) =>
          prev.map((s) => {
            if (s.id === "document-analysis") {
              return { ...s, status: "completed" as const, documentAnalysisStatus: "analyzed" as const, canEdit: true };
            }
            return s;
          }),
        );
        // Stay on document-analysis so user can click "Proceed to Readiness Check"
        setWorkflowPhase("unlocked");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [workflowPhase]);

  // Check if user can access a step based on eligibility and step status
  const canAccessStep = useCallback(
    (stepId: string) => {
      if (stepId === "eligibility") return true;
      if (eligibilityStatus !== "eligible") return false;
      const step = steps.find((s) => s.id === stepId);
      return step?.status === "completed" || step?.status === "active";
    },
    [eligibilityStatus, steps],
  );

  const handleStepClick = useCallback(
    (stepId: string) => {
      if (canAccessStep(stepId)) {
        setCurrentStep(stepId);
      }
    },
    [canAccessStep],
  );

  const handleEditStep = useCallback(
    (stepId: string) => {
      if (canAccessStep(stepId)) {
        setEditingStep(stepId);
        setCurrentStep(stepId);
      }
    },
    [canAccessStep],
  );

  const handleSaveCorrection = useCallback((stepId: string) => {
    setCorrections((prev) => ({ ...prev, [stepId]: true }));
    setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, hasCorrections: true } : s)));
    setEditingStep(null);
    setCurrentStep("gap-analysis");
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingStep(null);
    setCurrentStep("gap-analysis");
  }, []);

  // Handle eligibility check completion - unlocks next step
  const handleEligibilityComplete = useCallback((status: "eligible" | "not-eligible") => {
    setEligibilityStatus(status);
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id === "eligibility") {
          return {
            ...s,
            status: "completed" as const,
            eligibilityStatus: status === "eligible" ? "eligible" : "not-eligible",
          };
        }
        if (status === "eligible" && s.id === "document-analysis") {
          return { ...s, status: "active" as const, canEdit: true };
        }
        return s;
      }),
    );
    if (status === "eligible") {
      setCurrentStep("document-analysis");
    }
  }, []);

  // Progress to next step
  const handleStepComplete = useCallback((completedStepId: string, nextStepId: string) => {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id === completedStepId) {
          return { ...s, status: "completed" as const, canEdit: true };
        }
        if (s.id === nextStepId) {
          return { ...s, status: "active" as const, canEdit: false };
        }
        return s;
      }),
    );
    setCurrentStep(nextStepId);
  }, []);

  const handleProceedToSubmit = useCallback(() => {
    handleStepComplete("gap-analysis", "submit-to-payer");
  }, [handleStepComplete]);

  // Handle "Proceed to Readiness Check" — calls the backend agent API
  const handleProceedToReadinessCheck = useCallback(async () => {
    setCurrentStep("prior-auth-decision");
    setAgentLoading(true);
    setAgentError(null);
    setAgentData(null);

    setSteps((prev) =>
      prev.map((s) => {
        if (s.id === "prior-auth-decision") return { ...s, status: "active" as const, canEdit: true };
        return s;
      }),
    );

    try {
      // Build clinical notes from document summary and patient metadata
      const clinicalNotes = documentSummary;
      const patientMeta = `Patient: ${activeCase.patientName}, DOB: ${activeCase.dateOfBirth}, ID: ${activeCase.patientId}, Encounter: ${activeCase.encounterType}, Provider: ${activeCase.orderingProvider}`;

      const result = await callPriorAuthAgent({
        cpt: activeCase.procedureCode || "29881",
        payer: activeCase.payerName,
        state: "Florida",
        notes: documentSummary,
        // notes: `${patientMeta}. Procedure: ${activeCase.procedureName || ""}. Clinical Notes: ${documentSummary}`,
      });
      setAgentData(result);

      setSteps((prev) =>
        prev.map((s) => {
          if (s.id === "prior-auth-decision") return { ...s, status: "completed" as const, canEdit: true };
          if (s.id === "gap-analysis") return { ...s, status: "active" as const, canEdit: true };
          if (s.id === "submit-to-payer") return { ...s, status: "active" as const, canEdit: true };
          return s;
        }),
      );
    } catch (err) {
      setAgentError(err instanceof Error ? err.message : "Failed to run prior auth agent");
    } finally {
      setAgentLoading(false);
    }
  }, []);

  const renderPanel = () => {
    switch (currentStep) {
      case "eligibility":
        return (
          <EligibilitySection
            isEditing={editingStep === "eligibility"}
            onSave={() => handleSaveCorrection("eligibility")}
            onCancel={handleCancelEdit}
            eligibilityStatus={eligibilityStatus}
            onStatusChange={setEligibilityStatus}
            onComplete={handleEligibilityComplete}
          />
        );
      case "document-analysis":
        return (
          <DocumentAnalysisSection
            isEditing={editingStep === "document-analysis"}
            onSave={() => handleSaveCorrection("document-analysis")}
            onCancel={handleCancelEdit}
            onComplete={handleProceedToReadinessCheck}
            caseData={caseData}
          />
        );
      case "prior-auth-decision":
        return (
          <PriorAuthDecisionSection
            isEditing={editingStep === "prior-auth-decision"}
            onSave={() => handleSaveCorrection("prior-auth-decision")}
            onCancel={handleCancelEdit}
            onComplete={() => setCurrentStep("submit-to-payer")}
            agentData={agentData}
            agentLoading={agentLoading}
            agentError={agentError}
            onRetry={handleProceedToReadinessCheck}
          />
        );
      case "gap-analysis":
        return (
          <GapAnalysisSection
            onProceed={handleProceedToSubmit}
            onEditStep={handleEditStep}
            corrections={corrections}
            hasGaps={caseHasGaps}
            agentData={agentData}
          />
        );
      case "submit-to-payer":
        return <SubmitToPayerSection />;
      default:
        return (
          <EligibilitySection
            isEditing={false}
            eligibilityStatus={eligibilityStatus}
            onStatusChange={setEligibilityStatus}
            onComplete={handleEligibilityComplete}
          />
        );
    }
  };

  return (
    <div className="flex gap-6">
      <div className="w-80 shrink-0">
        <div className="sticky top-24">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Provider Journey</h4>
                <p className="text-xs text-muted-foreground">Pre-Authorization Workflow</p>
              </div>
            </div>
            <WorkflowSteps
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              onEditStep={handleEditStep}
              lockedSteps={
                eligibilityStatus !== "eligible"
                  ? ["document-analysis", "prior-auth-decision", "gap-analysis", "submit-to-payer"]
                  : workflowPhase === "document-analysis"
                    ? ["prior-auth-decision", "gap-analysis", "submit-to-payer"]
                    : []
              }
            />
          </Card>
        </div>
      </div>
      <div className="flex-1 min-w-0">{renderPanel()}</div>
    </div>
  );
}

// Section Components
interface SectionProps {
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
}

interface EligibilitySectionProps {
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  eligibilityStatus: "idle" | "processing" | "eligible" | "not-eligible";
  onStatusChange: (status: "idle" | "processing" | "eligible" | "not-eligible") => void;
  onComplete: (status: "eligible" | "not-eligible") => void;
}

function EligibilityHeader({
  status,
  eligibilityStatus,
  onRun,
  isRunning,
}: {
  status: "idle" | "processing" | "complete";
  eligibilityStatus: "idle" | "processing" | "eligible" | "not-eligible";
  onRun: () => void;
  isRunning: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center ${
          status === "processing"
            ? "bg-primary/20 ring-2 ring-primary/30"
            : status === "complete"
              ? "bg-success/20"
              : "bg-muted"
        }`}
      >
        <Shield
          className={`h-5 w-5 ${
            status === "processing"
              ? "text-primary animate-pulse-soft"
              : status === "complete"
                ? "text-success"
                : "text-muted-foreground"
          }`}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">Agent</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRun} disabled={isRunning}>
          {isRunning ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : eligibilityStatus === "eligible" || eligibilityStatus === "not-eligible" ? (
            <RefreshCw className="h-4 w-4 mr-1" />
          ) : (
            <Play className="h-4 w-4 mr-1" />
          )}
          {eligibilityStatus === "eligible" || eligibilityStatus === "not-eligible" ? "Run Again" : "Run Check"}
        </Button>
        <AuditLogsDialog agentName="Eligibility" />
      </div>
    </div>
  );
}

function AgentHeader({
  name,
  status,
  showRunButton,
  onRun,
  isRunning,
}: {
  name: string;
  status: "active" | "complete" | "idle" | "new";
  showRunButton?: boolean;
  onRun?: () => void;
  isRunning?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center ${
          status === "active"
            ? "bg-primary/20 ring-2 ring-primary/30"
            : status === "complete"
              ? "bg-success/20"
              : status === "new" ? "bg-black" : "bg-muted"
        }`}
      >
        <Sparkles
          className={`h-5 w-5 ${
            status === "active"
              ? "text-primary animate-pulse-soft"
              : status === "complete"
                ? "text-success"
                : "text-muted-foreground"
          }`}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{name}</p>
      </div>
      <div className="flex items-center gap-2">
        {showRunButton && (
          <Button variant="outline" size="sm" onClick={onRun} disabled={isRunning}>
            {isRunning ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : status === "complete" ? (
              <RefreshCw className="h-4 w-4 mr-1" />
            ) : (
              <Play className="h-4 w-4 mr-1" />
            )}
            {status === "complete" ? "Run Again" : "Run Check"}
          </Button>
        )}
        <AuditLogsDialog agentName={name} />
      </div>
    </div>
  );
}

function EligibilitySection({
  isEditing,
  onSave,
  onCancel,
  eligibilityStatus,
  onStatusChange,
  onComplete,
}: EligibilitySectionProps) {
  const handleRunCheck = () => {
    onStatusChange("processing");
    setTimeout(() => {
      const isEligible = true;
      const status = isEligible ? "eligible" : "not-eligible";
      onComplete(status);
    }, 2000);
  };

  const hasResults = eligibilityStatus === "eligible" || eligibilityStatus === "not-eligible";
  const isRunning = eligibilityStatus === "processing";

  return (
    <Card className="p-6 bg-card border-border">
      <EligibilityHeader
        status={isRunning ? "processing" : hasResults ? "complete" : "idle"}
        eligibilityStatus={eligibilityStatus}
        onRun={handleRunCheck}
        isRunning={isRunning}
      />
      <h3 className="text-lg font-semibold text-foreground mb-4">Insurance & Eligibility Verification</h3>

      {hasResults ? (
        <div className="grid gap-4">
          <Card
            className={`p-4 ${eligibilityStatus === "eligible" ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              {eligibilityStatus === "eligible" ? (
                <>
                  <Shield className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">Eligibility Verified</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">Not Eligible</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {eligibilityStatus === "eligible"
                ? "Member is active with valid coverage for requested procedure"
                : "Member coverage is not active or does not cover requested procedure"}
            </p>
          </Card>

          {eligibilityStatus === "eligible" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <InfoCard
                  icon={<Shield className="h-4 w-4" />}
                  label="Payer"
                  value="Blue Cross Blue Shield"
                  editable={isEditing}
                />
                <InfoCard icon={<Shield className="h-4 w-4" />} label="Plan Type" value="PPO" editable={isEditing} />
              </div>

              <Card className="p-4 bg-secondary/30 border-border/50">
                <h4 className="text-sm font-medium text-foreground mb-2">Member Benefits</h4>
                <div className="space-y-2 text-sm">
                  <DataRow label="Member ID" value="BCB-987654321" />
                  <DataRow label="Group Number" value="GRP-12345" />
                  <DataRow label="Effective Date" value="01/01/2024" />
                  <DataRow label="In-Network Deductible" value="$500 (Met)" highlight />
                  <DataRow label="Out-of-Pocket Max" value="$3,000 / $6,000" />
                </div>
              </Card>

              <Card className="p-4 bg-secondary/30 border-border/50">
                <h4 className="text-sm font-medium text-foreground mb-2">Coverage Details</h4>
                <div className="space-y-2 text-sm">
                  <DataRow label="Surgical Coverage" value="80% after deductible" />
                  <DataRow label="Prior Auth Required" value="Yes - Orthopedic Surgery" highlight />
                  <DataRow label="Network Status" value="In-Network Provider" />
                </div>
              </Card>
            </>
          )}
        </div>
      ) : isRunning ? (
        <Card className="p-6 bg-primary/5 border-primary/20 text-center">
          <Loader2 className="h-12 w-12 mx-auto text-primary mb-3 animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying member eligibility and benefits...</p>
        </Card>
      ) : (
        <Card className="p-6 bg-muted/30 border-border/50 text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-3">
            Click "Run Check" to verify member eligibility and benefits
          </p>
        </Card>
      )}

      {isEditing && (
        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <Button onClick={onSave} className="flex-1">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );
}

function DocumentAnalysisSection({ isEditing, onSave, onCancel, onComplete, caseData }: SectionProps & { caseData: PreAuthProviderWorkflowProps['caseData'] }) {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(true);

  const documents = [
    { name: "Clinical Notes - Dr. Chen", date: "2024-01-15", status: "analyzed" },
    { name: "X-Ray Report - Right Knee", date: "2024-01-10", status: "analyzed" },
    { name: "MRI Report - Right Knee", date: "2024-01-08", status: "analyzed" },
    { name: "Physical Therapy Progress Notes", date: "2024-01-05", status: "analyzed" },
    { name: "Injection Records (3x)", date: "2023-12-15", status: "analyzed" },
  ];

  // const documentSummary = `Patient documentation includes comprehensive clinical notes documenting progressive knee condition with failed conservative management. Imaging studies (X-ray and MRI) confirm significant findings with joint space narrowing. Physical therapy records show 12 weeks of treatment with limited improvement. Three corticosteroid injections administered over 6 months provided temporary relief only. All documentation supports medical necessity for the requested procedure.`;
const documentSummary = getCaseById(caseId)?.documentSummary || "";
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalysis(true);
    }, 2000);
  };

  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader
        name="Agent"
        status={hasAnalysis ? "complete" : "idle"}
        showRunButton
        onRun={handleAnalyze}
        isRunning={isAnalyzing}
      />
      <h3 className="text-lg font-semibold text-foreground mb-4">Document Analysis & Summary</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate(`/case/${caseId}/documents`)}>
          <FileUp className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {hasAnalysis ? (
        <div className="grid gap-4">
          <Card className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">AI Document Summary</h4>
                <p className="text-sm text-foreground/90 leading-relaxed">{documentSummary}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-secondary/30 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">Retrieved Documents ({documents.length})</h4>
            <div className="space-y-2">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 rounded-lg bg-background/50 hover:bg-background cursor-pointer"
                  onClick={() => navigate(`/case/${caseId}/documents`)}
                >
                  <FileSearch className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.date}</p>
                  </div>
                  <Badge variant="outline" className="text-xs text-success border-success/30">
                    {doc.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-6 bg-muted/30 border-border/50 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-3">
            Upload documents and click "Analyze Documents" to generate summary
          </p>
        </Card>
      )}

      {isEditing ? (
        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <Button onClick={onSave} className="flex-1">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      ) : (
        hasAnalysis &&
        onComplete && (
          <div className="flex justify-end mt-6 pt-4 border-t border-border">
            <Button onClick={onComplete}>
              Proceed to Readiness Check
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )
      )}
    </Card>
  );
}

// ─── REDESIGNED: Prior Auth Readiness Check ─────────────────────────────────
interface PriorAuthDecisionSectionProps extends SectionProps {
  agentData: PriorAuthAgentResponse | null;
  agentLoading: boolean;
  agentError: string | null;
  onRetry: () => void;
}

function PriorAuthDecisionSection({ isEditing, onSave, onCancel, onComplete, agentData, agentLoading, agentError, onRetry }: PriorAuthDecisionSectionProps) {
  const data = agentData;
  const hasResults = !!data;

  const metCount = data ? data.decision_tree_validation.logic_path.filter((s) => s.patient_evidence).length : 0;
  const totalSteps = data ? data.decision_tree_validation.logic_path.length : 0;

  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader
        name="Prior Auth Agent"
        status={agentLoading ? "active" : hasResults ? "complete" : "idle"}
        showRunButton
        onRun={onRetry}
        isRunning={agentLoading}
      />
      <h3 className="text-lg font-semibold text-foreground mb-1">Prior Auth Readiness Check</h3>
      {data && (
        <p className="text-sm text-muted-foreground mb-6">
          CPT {data.summary.cpt_code} — {data.summary.description}
        </p>
      )}

      {agentLoading ? (
        <Card className="p-8 bg-primary/5 border-primary/20 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Loader2 className="h-3 w-3 text-primary-foreground animate-spin" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Prior Auth Agent is Running...</p>
              <p className="text-xs text-muted-foreground mt-1">Analyzing payer policies, decision tree, and clinical evidence</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>This may take 30–60 seconds</span>
            </div>
          </div>
        </Card>
      ) : agentError ? (
        <Card className="p-6 bg-destructive/5 border-destructive/30 text-center">
          <XCircle className="h-12 w-12 mx-auto text-destructive mb-3" />
          <p className="text-sm font-medium text-destructive mb-2">Agent Error</p>
          <p className="text-xs text-muted-foreground mb-4">{agentError}</p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </Card>
      ) : hasResults && data ? (
        <div className="grid gap-5">
          {/* ── Summary Banner ── */}
          <Card className={`p-4 ${data.summary.overall_recommendation === "SUBMIT" ? "bg-success/10 border-success/30" : "bg-warning/10 border-warning/30"}`}>
            <div className="flex items-center gap-3">
              <Target className={`h-5 w-5 ${data.summary.overall_recommendation === "SUBMIT" ? "text-success" : "text-warning"}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-base font-semibold ${data.summary.overall_recommendation === "SUBMIT" ? "text-success" : "text-warning"}`}>
                    Recommendation: {data.summary.overall_recommendation}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Risk: {data.final_recommendation.risk_of_denial}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Payer: {data.summary.payer} · {data.pre_certification_analysis.authorization_type} · TAT: {data.pre_certification_analysis.estimated_tat_days} days
                </p>
              </div>
            </div>
          </Card>

          {/* ── Pre-certification Analysis ── */}
          <Card className="p-4 bg-secondary/30 border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <ClipboardList className="h-3 w-3 text-primary" />
              </div>
              <h4 className="text-sm font-medium text-foreground">Pre-certification Analysis</h4>
              <Badge variant="outline" className="ml-auto text-xs">
                CPT: {data.summary.cpt_code}
              </Badge>
            </div>
            <div className="space-y-2 text-sm ml-8">
              <DataRow label="PA Required" value={data.pre_certification_analysis.pa_required ? "Yes" : "No"} highlight={data.pre_certification_analysis.pa_required} />
              <DataRow label="Authorization Type" value={data.pre_certification_analysis.authorization_type} />
              <DataRow label="Estimated TAT" value={`${data.pre_certification_analysis.estimated_tat_days} business days`} />
            </div>
          </Card>

          {/* ── State Policy Analysis ── */}
          <Card className="p-4 bg-secondary/30 border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Scale className="h-3 w-3 text-primary" />
              </div>
              <h4 className="text-sm font-medium text-foreground">State Policy Analysis</h4>
              <Badge variant="outline" className="ml-auto text-xs">
                {data.state_policy_analysis.state}
              </Badge>
            </div>
            <div className="space-y-3 ml-8">
              {data.state_policy_analysis.applicable_laws.map((law, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-start gap-2">
                    <Gavel className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{law.law_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{law.description}</p>
                      {/* <p className="text-xs text-primary mt-1.5">
                        <Sparkles className="h-3 w-3 inline mr-1" />
                        Impact: {law.impact}
                      </p> */}
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Reviewer Requirement:</span> {data.state_policy_analysis.reviewer_requirement}
              </div>
            </div>
          </Card>

          {/* ── Decision Tree Validation ── */}
          <Card className="p-4 bg-secondary/30 border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <GitBranch className="h-3 w-3 text-primary" />
              </div>
              <h4 className="text-sm font-medium text-foreground">Decision Tree Validation</h4>
              <Badge variant="outline" className="ml-auto text-xs">
                {metCount}/{totalSteps} criteria met
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3 ml-8">
              Policy: {data.decision_tree_validation.policy_id}
            </p>
            <p className="text-xs text-muted-foreground mb-4 ml-8 p-2 rounded bg-background/50 border border-border/50 italic">
              "{data.decision_tree_validation.policy_wording}"
            </p>
            <div className="space-y-2 ml-8">
              {data.decision_tree_validation.logic_path.map((step:any,index) => (
                <div key={step.step} className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {step.patient_evidence ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">Step {step.step}</span>
                        {/* <Badge
                          variant="outline"
                          className={`text-xs ${data?.gap_comparison_table[index]?.status === "met" ? "border-success/30 text-success" : "border-destructive/30 text-destructive"}`}
                        >
                          {data?.gap_comparison_table[index]?.status.charAt(0).toUpperCase() + data?.gap_comparison_table[index]?.status.slice(1)}
                        </Badge> */}
                      </div>
                      <p className="text-sm text-foreground mt-1">{step.criteria}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <CircleDot className="h-3 w-3 inline mr-1" />
                        {step.evidence} {step?.patient_evidence || step?.patient_data}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Gap Comparison Table ── */}
          <Card className="p-4 bg-secondary/30 border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <ClipboardList className="h-3 w-3 text-primary" />
              </div>
              <h4 className="text-sm font-medium text-foreground">Gap Comparison Table</h4>
              <Badge variant="outline" className="ml-auto text-xs">
                {data.gap_comparison_table.length} items
              </Badge>
            </div>
            <div className="space-y-2 ml-8">
              {data.gap_comparison_table.map((item, idx) => (
                <div key={`${item.requirement}-${idx}`} className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {item.status === "met" ? (
                        <ThumbsUp className="h-4 w-4 text-success" />
                      ) : (
                        <ThumbsDown className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">Requirement</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${item.status === "met" ? "border-success/30 text-success" : "border-destructive/30 text-destructive"}`}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground mt-1">{item.requirement}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <CircleDot className="h-3 w-3 inline mr-1" />
                        {item.current_evidence}
                      </p>
                      {item.action_required && (
                        <p className="text-xs text-warning mt-2">
                          <AlertTriangle className="h-3 w-3 inline mr-1" />
                          {item.action_required}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Final Recommendation ── */}
          <Card className={`p-5 ${data.final_recommendation.decision === "SUBMIT" ? "bg-primary/10 border-primary/30" : "bg-warning/10 border-warning/30"}`}>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h4 className="font-medium text-foreground">Final Recommendation & Reason</h4>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed mb-4">
              {data.final_recommendation.primary_reason}
            </p>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                Decision: {data.final_recommendation.decision}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${
                  data.final_recommendation.risk_of_denial === "Low"
                    ? "border-success/30 text-success"
                    : data.final_recommendation.risk_of_denial === "Medium"
                      ? "border-warning/30 text-warning"
                      : "border-destructive/30 text-destructive"
                }`}
              >
                Denial Risk: {data.final_recommendation.risk_of_denial}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Recommended Next Steps:</p>
              {data.final_recommendation.next_steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary font-medium flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-6 bg-muted/30 border-border/50 text-center">
          <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-3">
            Click "Run Check" to analyze prior authorization requirements
          </p>
        </Card>
      )}

      {isEditing ? (
        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <Button onClick={onSave} className="flex-1">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      ) : (
        hasResults &&
        onComplete && (
          <div className="flex justify-end mt-6 pt-4 border-t border-border">
            <Button onClick={onComplete}>
              Proceed to Submit to payer
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )
      )}
    </Card>
  );
}

// ─── REDESIGNED: Gap Analysis & Review ──────────────────────────────────────
interface GapAnalysisSectionProps {
  onProceed: () => void;
  onEditStep: (stepId: string) => void;
  corrections: Record<string, boolean>;
  hasGaps: boolean;
  agentData: PriorAuthAgentResponse | null;
}

function GapAnalysisSection({ onProceed, onEditStep, corrections, hasGaps, agentData }: GapAnalysisSectionProps) {
  const [isRunning, setIsRunning] = useState(false);
  const hasResults = !!agentData;
  const [notes, setNotes] = useState<string>("");
  const data = agentData;

  const gapItems = data?.gap_comparison_table || [];
  const metItems = gapItems.filter((g) => g.status === "MET");
  const issueItems = gapItems.filter((g) => g.status !== "MET");

  const handleRunCheck = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "MET":
        return (
          <Badge variant="outline" className="text-xs border-success/30 text-success bg-success/10">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Met
          </Badge>
        );
      case "PARTIALLY_MET":
        return (
          <Badge variant="outline" className="text-xs border-warning/30 text-warning bg-warning/10">
            <AlertTriangle className="h-3 w-3 mr-1" /> Partially Met
          </Badge>
        );
      case "UNCLEAR":
        return (
          <Badge variant="outline" className="text-xs border-warning/30 text-warning bg-warning/10">
            <HelpCircle className="h-3 w-3 mr-1" /> Unclear
          </Badge>
        );
      case "NOT_MET":
        return (
          <Badge variant="outline" className="text-xs border-destructive/30 text-destructive bg-destructive/10">
            <XCircle className="h-3 w-3 mr-1" /> Not Met
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  // No gaps scenario
  if (!hasGaps) {
    return (
      <Card className="p-6 bg-card border-border">
        <AgentHeader name="Agent" status="complete" showRunButton onRun={handleRunCheck} isRunning={isRunning} />
        <h3 className="text-lg font-semibold text-foreground mb-4">Gap Analysis & Review</h3>

        <Card className="p-4 bg-success/10 border-success/30 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-success" />
            <div className="flex-1">
              <span className="text-base font-semibold text-success">No Gaps Identified</span>
              <p className="text-xs text-muted-foreground mt-1">
                All required clinical documentation is complete. This case meets all payer requirements.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-primary/10 border-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Ready for Submission</p>
              <p className="text-xs text-muted-foreground">All criteria met, no gaps to address</p>
            </div>
            <Button onClick={onProceed}>
              Submit to Payer
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      </Card>
    );
  }

  // Has gaps scenario — show gap comparison table from agent response
  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader
        name="Gap Analysis Agent"
        status={hasResults ? "complete" : "idle"}
        showRunButton
        onRun={handleRunCheck}
        isRunning={isRunning}
      />
      <h3 className="text-lg font-semibold text-foreground mb-1">Gap Analysis & Review</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Comparing clinical evidence against {data?.summary.payer || "payer"} medical necessity requirements for CPT {data?.summary.cpt_code || ""}.
      </p>

      {hasResults ? (
        <>
          {/* Summary Counts */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="p-3 bg-success/10 border-success/30 text-center">
              <p className="text-2xl font-bold text-success">{metItems.length}</p>
              <p className="text-xs text-muted-foreground">Met</p>
            </Card>
            <Card className="p-3 bg-warning/10 border-warning/30 text-center">
              <p className="text-2xl font-bold text-warning">{issueItems.filter((i) => i.status === "PARTIALLY_MET" || i.status === "UNCLEAR").length}</p>
              <p className="text-xs text-muted-foreground">Partially Met / Unclear</p>
            </Card>
            <Card className="p-3 bg-destructive/10 border-destructive/30 text-center">
              <p className="text-2xl font-bold text-destructive">{issueItems.filter((i) => i.status === "NOT_MET").length}</p>
              <p className="text-xs text-muted-foreground">Not Met</p>
            </Card>
          </div>

          {/* Gap Comparison — Issues First */}
          {issueItems.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Action Required ({issueItems.length})
              </h4>
              <div className="space-y-3">
                {issueItems.map((item, idx) => (
                  <Card
                    key={idx}
                    className={`p-4 ${item.status === "NOT_MET" ? "border-destructive/30 bg-destructive/5" : "border-warning/30 bg-warning/5"}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm font-medium text-foreground">{item.requirement}</p>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="p-2.5 rounded-lg bg-background/50 border border-border/50 mb-3">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Current Evidence: </span>
                        {item.current_evidence}
                      </p>
                    </div>
                    {item.action_required && (
                      <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-start gap-2">
                          <Sparkles className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-primary">
                            <span className="font-medium">Action: </span>
                            {item.action_required}
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Met Criteria */}
          {metItems.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Criteria Met ({metItems.length})
              </h4>
              <Card className="p-4 bg-secondary/30 border-border/50">
                <div className="space-y-3">
                  {metItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 rounded-lg bg-background/50">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{item.requirement}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.current_evidence}</p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Notes Section */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              Gap Resolution Notes
            </h4>
            <Card className="p-4 bg-secondary/30 border-border/50">
              <textarea
                placeholder="Add notes about gaps, actions taken, or items pending physician response..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[80px] p-3 text-sm bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </Card>
          </div>

          {/* Draft Email */}
          <Card className="p-4 bg-primary/10 border-primary/30 mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Draft Email to Physician
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Send an email to the ordering physician requesting the missing documentation and gap corrections.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const subject = encodeURIComponent("Prior Authorization - Additional Documentation Required");
                const body = encodeURIComponent(
                  `Dear Dr.,\n\nWe are processing a prior authorization request for CPT ${data?.summary.cpt_code || ""} (${data?.summary.description || ""}).\n\nThe following items require attention:\n\n${issueItems.map((item, i) => `${i + 1}. [${item.status}] ${item.requirement}\n   Action: ${item.action_required || "N/A"}`).join("\n\n")}\n\nPlease provide the required documentation at your earliest convenience.\n\nThank you.`,
                );
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Draft Email with Missing Details
            </Button>
          </Card>

          {/* Proceed */}
          <Card className="p-4 bg-primary/10 border-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Ready for Submission</p>
                <p className="text-xs text-muted-foreground">
                  {issueItems.length} gap(s) identified — review and proceed
                </p>
              </div>
              <Button onClick={onProceed}>
                Submit to Payer
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-6 bg-muted/30 border-border/50 text-center">
          <FileSearch className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-3">
            Click "Run Check" to perform clinical audit and gap analysis
          </p>
        </Card>
      )}
    </Card>
  );
}

function SubmitToPayerSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="p-6 bg-card border-border">
      <AgentHeader name="Agent" status={submitted ? "complete" : "active"} />
      <h3 className="text-lg font-semibold text-foreground mb-4">Submit to Payer</h3>

      {!submitted ? (
        <>
          <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Submission Summary</h4>
            <div className="space-y-2 text-sm">
              <DataRow label="Payer" value="Blue Cross Blue Shield" />
              <DataRow label="Submission Method" value="API - Real-time" />
              <DataRow label="Request Type" value="Prior Authorization - Elective Surgery" />
              <DataRow label="Expected Response" value="5 business days" />
            </div>
          </Card>

          <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Included Documents</h4>
            <div className="space-y-2">
              <DocumentItem name="Clinical Summary (AI-Generated)" date="Today" status="attached" />
              <DocumentItem name="X-Ray & MRI Reports" date="2024-01" status="attached" />
              <DocumentItem name="Conservative Treatment History" date="2024" status="attached" />
              <DocumentItem name="Functional Assessment" date="Today" status="attached" />
            </div>
          </Card>

          <div className="flex gap-3">
            <Button onClick={() => setSubmitted(true)} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Submit Prior Authorization Request
            </Button>
          </div>
        </>
      ) : (
        <>
          <Card className="p-4 bg-success/10 border-success/30 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-base font-medium text-success">Successfully Submitted</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Prior authorization request has been submitted to Blue Cross Blue Shield via API.
            </p>
          </Card>

          <Card className="p-4 bg-secondary/30 border-border/50 mb-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Submission Details</h4>
            <div className="space-y-2 text-sm">
              <DataRow label="Reference Number" value="PA-2024-0115-78456" highlight />
              <DataRow label="Submitted At" value={new Date().toLocaleString()} />
              <DataRow label="Status" value="Pending Review" />
              <DataRow label="Expected Decision" value="Jan 22, 2024" />
            </div>
          </Card>

          <Card className="p-4 bg-secondary/30 border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">Notifications Sent</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span className="text-muted-foreground">Provider notified via EHR workflow</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span className="text-muted-foreground">Patient notified via patient portal</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span className="text-muted-foreground">Case logged in audit trail</span>
              </div>
            </div>
          </Card>

          <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/30">
            <p className="text-sm text-foreground">
              <Sparkles className="h-4 w-4 inline mr-1 text-primary" />
              This case will now move to the <strong>Payer workflow</strong> for medical necessity review.
            </p>
          </div>
        </>
      )}
    </Card>
  );
}

// Helper Components
function InfoCard({
  icon,
  label,
  value,
  editable,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editable?: boolean;
}) {
  return (
    <Card className={`p-3 bg-secondary/30 border-border/50 ${editable ? "ring-1 ring-primary/30" : ""}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </Card>
  );
}

function DataRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "text-primary font-medium" : "text-foreground"}>{value}</span>
    </div>
  );
}

function DocumentItem({ name, date, status }: { name: string; date: string; status: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
      <FileSearch className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
      <Badge variant="outline" className="text-xs text-success border-success/30">
        {status}
      </Badge>
    </div>
  );
}
