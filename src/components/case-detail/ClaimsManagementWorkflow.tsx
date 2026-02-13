import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, Search, Scale, CreditCard, BookOpen,
  ArrowRight, Clock, CheckCircle2, AlertCircle
} from "lucide-react";

const sections = [
  {
    id: "claim-submission",
    title: "Claim Submission",
    description: "Prepare, validate, and submit claims to payers electronically or on paper.",
    icon: FileText,
    status: "ready" as const,
    items: [
      "Auto-populate claim forms (CMS-1500 / UB-04) from case data",
      "Validate coding accuracy & scrub claims before submission",
      "Submit via clearinghouse or direct payer portal",
      "Track submission confirmation & acknowledgment",
    ],
  },
  {
    id: "claims-status",
    title: "Claims Status Checks",
    description: "Monitor and track the real-time status of submitted claims with payers.",
    icon: Search,
    status: "pending" as const,
    items: [
      "Automated 276/277 status inquiry transactions",
      "Real-time claim adjudication tracking",
      "Flagging of stalled or rejected claims",
      "Batch status check scheduling",
    ],
  },
  {
    id: "contract-reconciliation",
    title: "Contract Reconciliation",
    description: "Compare expected reimbursement against contracted rates and payer agreements.",
    icon: Scale,
    status: "pending" as const,
    items: [
      "Match ERA/EOB payments against contract fee schedules",
      "Identify underpayments and overpayments",
      "Flag variance exceptions for review",
      "Generate reconciliation reports by payer",
    ],
  },
  {
    id: "payment-collection",
    title: "Patient & Payor Payment Collection",
    description: "Manage patient responsibility and payer payment workflows.",
    icon: CreditCard,
    status: "pending" as const,
    items: [
      "Generate patient statements with clear balance details",
      "Automate payment plan setup and monitoring",
      "Process payer remittance and ERA files",
      "Track outstanding balances by aging bucket",
    ],
  },
  {
    id: "payment-posting",
    title: "Payment Posting & Reconciliation",
    description: "Post payments accurately and reconcile against expected amounts.",
    icon: BookOpen,
    status: "pending" as const,
    items: [
      "Auto-post ERA/EOB payments to patient accounts",
      "Manual payment posting with adjustment codes",
      "Daily cash reconciliation against bank deposits",
      "Contractual & non-contractual adjustment tracking",
    ],
  },
];

const statusConfig = {
  ready: { label: "Ready", color: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  pending: { label: "Pending", color: "bg-muted text-muted-foreground border-border", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-warning/10 text-warning border-warning/20", icon: AlertCircle },
};

export function ClaimsManagementWorkflow() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Claims Management</h2>
          <p className="text-sm text-muted-foreground">
            End-to-end claim lifecycle from submission through payment reconciliation
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          0 / {sections.length} Complete
        </Badge>
      </div>

      <div className="grid gap-4">
        {sections.map((section) => {
          const config = statusConfig[section.status];
          const StatusIcon = config.icon;
          const SectionIcon = section.icon;

          return (
            <Card key={section.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
                      <SectionIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{section.title}</CardTitle>
                      <CardDescription className="mt-1">{section.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${config.color} text-xs`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary/60" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" disabled={section.status === "pending"}>
                    {section.status === "ready" ? "Start" : "Locked"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
