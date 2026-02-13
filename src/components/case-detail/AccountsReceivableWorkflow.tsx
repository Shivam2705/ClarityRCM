import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, Users, Phone, AlertTriangle, Landmark,
  TrendingDown, BookOpen, ShieldAlert, Gavel,
  ArrowRight, Clock, CheckCircle2, AlertCircle
} from "lucide-react";

const sections = [
  {
    id: "early-out",
    title: "Early Out Program, Follow-ups & Reminders",
    description: "Proactive patient outreach before accounts age into collections.",
    icon: Bell,
    status: "ready" as const,
    items: [
      "Automated statement and reminder scheduling",
      "SMS, email, and mail outreach workflows",
      "Follow-up task queues for billing staff",
      "Escalation triggers based on aging thresholds",
    ],
  },
  {
    id: "patient-collections",
    title: "Patient Collections",
    description: "Manage patient balance recovery with flexible payment options.",
    icon: Users,
    status: "pending" as const,
    items: [
      "Payment plan creation and management",
      "Online patient payment portal integration",
      "Financial hardship and charity care screening",
      "Collection agency referral workflows",
    ],
  },
  {
    id: "contact-center",
    title: "Patient Contact Center & Bill Explainability",
    description: "Handle patient billing inquiries with clear, transparent explanations.",
    icon: Phone,
    status: "pending" as const,
    items: [
      "AI-assisted bill explanation for patient calls",
      "Itemized statement generation on demand",
      "Insurance benefit and coverage clarification",
      "Dispute resolution and adjustment processing",
    ],
  },
  {
    id: "bad-debt",
    title: "Bad Debt & Credit Balances",
    description: "Identify and manage uncollectible accounts and patient credit balances.",
    icon: AlertTriangle,
    status: "pending" as const,
    items: [
      "Bad debt write-off workflows with approval chains",
      "Credit balance identification and refund processing",
      "Aging analysis and reserve estimation",
      "Regulatory compliance for patient refunds",
    ],
  },
  {
    id: "cash-reconciliation",
    title: "Cash Reconciliation",
    description: "Reconcile all cash receipts against posted payments and bank deposits.",
    icon: Landmark,
    status: "pending" as const,
    items: [
      "Daily cash deposit matching",
      "Lockbox and EFT reconciliation",
      "Variance identification and resolution",
      "Month-end close support and reporting",
    ],
  },
  {
    id: "underpayments",
    title: "Underpayments Recovery",
    description: "Detect and recover underpaid claims based on contracted rates.",
    icon: TrendingDown,
    status: "pending" as const,
    items: [
      "Automated contract-to-payment variance detection",
      "Underpayment appeal letter generation",
      "Payer-specific recovery tracking",
      "ROI analysis on recovery efforts",
    ],
  },
  {
    id: "ar-payment-posting",
    title: "Payment Posting",
    description: "Accurate and timely posting of all payment types to patient accounts.",
    icon: BookOpen,
    status: "pending" as const,
    items: [
      "Auto-posting of electronic remittance (ERA/835)",
      "Manual posting with denial and adjustment codes",
      "Patient payment posting from all channels",
      "Posting accuracy audits and QA checks",
    ],
  },
  {
    id: "denials-management",
    title: "Denials Management",
    description: "Track, categorize, and resolve claim denials systematically.",
    icon: ShieldAlert,
    status: "pending" as const,
    items: [
      "Denial categorization by root cause (CO, PR, OA)",
      "Automated rework queues by denial type",
      "Denial trend analysis and prevention strategies",
      "KPI dashboards for denial rate and recovery",
    ],
  },
  {
    id: "appeals",
    title: "Appeals & Resolutions",
    description: "Manage the full appeals lifecycle for denied or underpaid claims.",
    icon: Gavel,
    status: "pending" as const,
    items: [
      "Appeal letter generation with supporting documentation",
      "Multi-level appeal tracking (1st, 2nd, external review)",
      "Deadline and timely filing management",
      "Resolution outcome tracking and reporting",
    ],
  },
];

const statusConfig = {
  ready: { label: "Ready", color: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  pending: { label: "Pending", color: "bg-muted text-muted-foreground border-border", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-warning/10 text-warning border-warning/20", icon: AlertCircle },
};

export function AccountsReceivableWorkflow() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Accounts Receivable</h2>
          <p className="text-sm text-muted-foreground">
            Comprehensive A/R management from early outreach through appeals and resolutions
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
