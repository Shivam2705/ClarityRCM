import { FileText, TestTube2, ImageIcon, Pill } from "lucide-react";

export function ClinicalIntakePanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Order & Clinical Intake</h3>
        <p className="text-sm text-muted-foreground mb-6">
          AI agents have collected and parsed the following clinical data from the EHR system.
        </p>
      </div>

      {/* EHR Summary Card */}
      <div className="rounded-xl border bg-card p-5">
        <h4 className="font-medium text-foreground mb-4">EHR Order Summary</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Procedure Requested</p>
            <p className="text-sm font-medium text-foreground">Total Knee Replacement (27447)</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Ordering Physician</p>
            <p className="text-sm font-medium text-foreground">Dr. Michael Chen, MD</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date of Service</p>
            <p className="text-sm font-medium text-foreground">January 22, 2024</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Facility</p>
            <p className="text-sm font-medium text-foreground">Metro General Hospital</p>
          </div>
        </div>
      </div>

      {/* Clinical Data Panels */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">Clinical Notes</h4>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Severe osteoarthritis, right knee (M17.11)</p>
            <p>• Conservative treatment failed x 6 months</p>
            <p>• Physical therapy completed</p>
            <p>• NSAIDs ineffective</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <TestTube2 className="h-5 w-5 text-info" />
            <h4 className="font-medium text-foreground">Lab Results</h4>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• CBC: Within normal limits</p>
            <p>• BMP: Normal</p>
            <p>• PT/INR: 1.0 (Normal)</p>
            <p>• HbA1c: 5.8%</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="h-5 w-5 text-warning" />
            <h4 className="font-medium text-foreground">Imaging</h4>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• X-Ray Right Knee (3 views)</p>
            <p>• MRI Right Knee w/o contrast</p>
            <p>• Kellgren-Lawrence Grade IV</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Pill className="h-5 w-5 text-success" />
            <h4 className="font-medium text-foreground">Prescriptions</h4>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Celecoxib 200mg (discontinued)</p>
            <p>• Acetaminophen 1000mg PRN</p>
            <p>• Gabapentin 300mg TID</p>
          </div>
        </div>
      </div>
    </div>
  );
}
