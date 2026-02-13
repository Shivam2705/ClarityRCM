export type CaseStatus = "New" | "Eligible" | "Eligible PA Req" | "Not Eligible" | "PA Review" | "PA Submitted" | "PA Denied";

export interface Case {
  id: string;
  patientName: string;
  patientId: string;
  dateOfBirth: string;
  encounterType: "Inpatient" | "Outpatient" | "Procedure";
  orderingProvider: string;
  payerName: string;
  groupId?: string;
  status: CaseStatus;
  priority: "High" | "Medium" | "Low";
  lastUpdated: string;
  procedureCode?: string;
  procedureName?: string;
  hasGaps?: boolean;
}

export const mockCases: Case[] = [
  {
    id: "CASE-001",
    patientName: "Sarah Johnson",
    patientId: "PT-78234",
    dateOfBirth: "1958-03-12",
    encounterType: "Inpatient",
    orderingProvider: "Dr. Michael Chen",
    payerName: "Aetna",
    groupId: "GRP-12345",
    status: "Eligible PA Req",
    priority: "High",
    lastUpdated: "2024-01-15T10:30:00Z",
    procedureCode: "27447",
    procedureName: "Total Knee Replacement",
    hasGaps: true,
  },
  {
    id: "CASE-002",
    patientName: "Robert Williams",
    patientId: "PT-45129",
    dateOfBirth: "1979-07-22",
    encounterType: "Outpatient",
    orderingProvider: "Dr. Emily Watson",
    payerName: "UnitedHealthcare",
    groupId: "GRP-67890",
    status: "Eligible",
    priority: "Medium",
    lastUpdated: "2024-01-15T09:15:00Z",
    procedureCode: "50360",
    procedureName: "Renal Transplant Allotransplantation",
    hasGaps: false,
  },
  {
    id: "CASE-003",
    patientName: "Maria Garcia",
    patientId: "PT-91823",
    dateOfBirth: "1982-11-05",
    encounterType: "Procedure",
    orderingProvider: "Dr. James Park",
    payerName: "UnitedHealthcare",
    groupId: "GRP-11223",
    status: "PA Submitted",
    priority: "Low",
    lastUpdated: "2024-01-14T16:45:00Z",
    procedureCode: "43239",
    procedureName: "Upper GI Endoscopy with Biopsy",
  },
  {
    id: "CASE-004",
    patientName: "David Thompson",
    patientId: "PT-33847",
    dateOfBirth: "1955-09-18",
    encounterType: "Inpatient",
    orderingProvider: "Dr. Lisa Martinez",
    payerName: "Cigna",
    groupId: "GRP-44556",
    status: "Eligible",
    priority: "High",
    lastUpdated: "2024-01-14T14:20:00Z",
    procedureCode: "33533",
    procedureName: "CABG Single Arterial Graft",
  },
  {
    id: "CASE-005",
    patientName: "Jennifer Brown",
    patientId: "PT-62951",
    dateOfBirth: "1990-01-30",
    encounterType: "Outpatient",
    orderingProvider: "Dr. Robert Kim",
    payerName: "Humana",
    groupId: "GRP-78901",
    status: "PA Denied",
    priority: "Medium",
    lastUpdated: "2024-01-13T11:30:00Z",
    procedureCode: "77067",
    procedureName: "Screening Mammography",
  },
  {
    id: "CASE-006",
    patientName: "Michael Davis",
    patientId: "PT-18293",
    dateOfBirth: "1970-06-14",
    encounterType: "Procedure",
    orderingProvider: "Dr. Sarah Lee",
    payerName: "Medicare",
    groupId: "GRP-33445",
    status: "PA Review",
    priority: "High",
    lastUpdated: "2024-01-15T08:00:00Z",
    procedureCode: "64483",
    procedureName: "Lumbar Epidural Injection",
  },
];
