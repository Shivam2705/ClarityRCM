import { Database, Brain, FileCheck, Send } from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "Data Ingestion",
    description: "Agents automatically collect and parse clinical data, EHR records, and policy documents.",
  },
  {
    icon: Brain,
    title: "Reasoning",
    description: "AI agents analyze evidence against payer policies and clinical guidelines.",
  },
  {
    icon: FileCheck,
    title: "Decision",
    description: "Transparent decision-making with clear rationale and confidence scores.",
  },
  {
    icon: Send,
    title: "Action",
    description: "Automated submission, notifications, and audit trail generation.",
  },
];

export function WorkflowSection() {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            What is Agentic Workflow?
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI agents work together through structured orchestration, not just chat.
            Each step is transparent, auditable, and explainable.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 lg:block" />

          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light border border-primary/20">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
