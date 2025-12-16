import { StatusBadge } from "@/components/ui/status-badge";
import { AgentStatus } from "@/components/ui/agent-status";
import { 
  FileText, Stethoscope, TestTube, Image, Pill, 
  Calendar, User, Building2, ClipboardList 
} from "lucide-react";

export function OrderIntakePanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Order & Clinical Intake</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Patient data from EHR system - Clinical documentation, tests, imaging, and prescriptions
        </p>
      </div>

      <AgentStatus name="Clinical Intake Agent" state="completed" />

      {/* Order Summary */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary-light/30 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">EHR Order Created</h4>
          </div>
          <StatusBadge variant="success">Order Active</StatusBadge>
        </div>
        <div className="grid gap-3 md:grid-cols-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Order ID</p>
            <p className="font-medium">ORD-2024-78542</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Order Type</p>
            <p className="font-medium">Surgical Procedure</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Order Date</p>
            <p className="font-medium">Jan 15, 2024</p>
          </div>
        </div>
      </div>

      {/* Clinical Documentation Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Clinical Notes */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">Clinical Notes</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-medium">Progress Note - Orthopedics</p>
                <span className="text-xs text-muted-foreground">Jan 10, 2024</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-3">
                Patient presents with severe right knee osteoarthritis, Grade IV on Kellgren-Lawrence scale. 
                Conservative treatment including NSAIDs, PT for 6 months, and corticosteroid injections have failed...
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-medium">Pre-operative Assessment</p>
                <span className="text-xs text-muted-foreground">Jan 12, 2024</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-3">
                Patient cleared for surgery. BMI 28.4, no cardiac contraindications. 
                Discussed surgical risks and benefits, patient consents to TKA procedure...
              </p>
            </div>
          </div>
        </div>

        {/* Lab Results */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TestTube className="h-5 w-5 text-info" />
            <h4 className="font-medium text-foreground">Lab Results</h4>
          </div>
          <div className="space-y-2">
            {[
              { test: "CBC Panel", result: "Within normal limits", date: "Jan 8, 2024", status: "normal" },
              { test: "BMP (Basic Metabolic)", result: "Normal", date: "Jan 8, 2024", status: "normal" },
              { test: "PT/INR", result: "1.0 (Normal)", date: "Jan 8, 2024", status: "normal" },
              { test: "HbA1c", result: "5.8%", date: "Jan 8, 2024", status: "normal" },
            ].map((lab, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">{lab.test}</p>
                  <p className="text-xs text-muted-foreground">{lab.date}</p>
                </div>
                <StatusBadge variant="success" size="sm">{lab.result}</StatusBadge>
              </div>
            ))}
          </div>
        </div>

        {/* Imaging */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Image className="h-5 w-5 text-warning" />
            <h4 className="font-medium text-foreground">Imaging Studies</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">MRI Right Knee</p>
                <StatusBadge variant="success" size="sm">Attached</StatusBadge>
              </div>
              <p className="text-xs text-muted-foreground">
                Findings: Complete loss of articular cartilage medial compartment, 
                subchondral cyst formation, bone-on-bone contact. Grade IV OA confirmed.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">X-Ray Right Knee (AP/Lateral)</p>
                <StatusBadge variant="success" size="sm">Attached</StatusBadge>
              </div>
              <p className="text-xs text-muted-foreground">
                Joint space narrowing greater than 75%, osteophyte formation, varus deformity 8 degrees.
              </p>
            </div>
          </div>
        </div>

        {/* Prescriptions */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="h-5 w-5 text-destructive" />
            <h4 className="font-medium text-foreground">Current Medications</h4>
          </div>
          <div className="space-y-2">
            {[
              { name: "Meloxicam 15mg", dosage: "Once daily", duration: "6 months" },
              { name: "Acetaminophen 500mg", dosage: "PRN", duration: "Ongoing" },
              { name: "Lisinopril 10mg", dosage: "Once daily", duration: "2 years" },
              { name: "Metformin 500mg", dosage: "Twice daily", duration: "1 year" },
            ].map((med, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">{med.name}</p>
                  <p className="text-xs text-muted-foreground">{med.dosage}</p>
                </div>
                <span className="text-xs text-muted-foreground">{med.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EHR Source */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-muted">
        <Building2 className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm font-medium">Source: Epic EHR System</p>
          <p className="text-xs text-muted-foreground">Last synced: Jan 15, 2024 at 10:35 AM</p>
        </div>
        <StatusBadge variant="success">Synced</StatusBadge>
      </div>
    </div>
  );
}
