export interface Case {
  id: string;
  patientName: string;
  patientId: string;
  encounterType: "Inpatient" | "Outpatient" | "Procedure";
  orderingProvider: string;
  payerName: string;
  status: "New" | "In Review" | "Submitted" | "Approved" | "Denied";
  priority: "High" | "Medium" | "Low";
  lastUpdated: string;
  procedureCode?: string;
  procedureName?: string;
}

export const mockCases: Case[] = [
  {
    id: "CASE-001",
    patientName: "Sarah Johnson",
    patientId: "PT-78234",
    encounterType: "Inpatient",
    orderingProvider: "Dr. Michael Chen",
    payerName: "Blue Cross Blue Shield",
    status: "In Review",
    priority: "High",
    lastUpdated: "2024-01-15T10:30:00Z",
    procedureCode: "27447",
    procedureName: "Total Knee Replacement",
  },
  {
    id: "CASE-002",
    patientName: "Robert Williams",
    patientId: "PT-45129",
    encounterType: "Outpatient",
    orderingProvider: "Dr. Emily Watson",
    payerName: "Aetna",
    status: "New",
    priority: "Medium",
    lastUpdated: "2024-01-15T09:15:00Z",
    procedureCode: "70553",
    procedureName: "MRI Brain with Contrast",
  },
  {
    id: "CASE-003",
    patientName: "Maria Garcia",
    patientId: "PT-91823",
    encounterType: "Procedure",
    orderingProvider: "Dr. James Park",
    payerName: "UnitedHealthcare",
    status: "Submitted",
    priority: "Low",
    lastUpdated: "2024-01-14T16:45:00Z",
    procedureCode: "43239",
    procedureName: "Upper GI Endoscopy with Biopsy",
  },
  {
    id: "CASE-004",
    patientName: "David Thompson",
    patientId: "PT-33847",
    encounterType: "Inpatient",
    orderingProvider: "Dr. Lisa Martinez",
    payerName: "Cigna",
    status: "Approved",
    priority: "High",
    lastUpdated: "2024-01-14T14:20:00Z",
    procedureCode: "33533",
    procedureName: "CABG Single Arterial Graft",
  },
  {
    id: "CASE-005",
    patientName: "Jennifer Brown",
    patientId: "PT-62951",
    encounterType: "Outpatient",
    orderingProvider: "Dr. Robert Kim",
    payerName: "Humana",
    status: "Denied",
    priority: "Medium",
    lastUpdated: "2024-01-13T11:30:00Z",
    procedureCode: "77067",
    procedureName: "Screening Mammography",
  },
  {
    id: "CASE-006",
    patientName: "Michael Davis",
    patientId: "PT-18293",
    encounterType: "Procedure",
    orderingProvider: "Dr. Sarah Lee",
    payerName: "Medicare",
    status: "In Review",
    priority: "High",
    lastUpdated: "2024-01-15T08:00:00Z",
    procedureCode: "64483",
    procedureName: "Lumbar Epidural Injection",
  },
];
