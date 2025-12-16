import { Building2, Stethoscope, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const personas = [
  {
    icon: Stethoscope,
    title: "For Providers",
    description: "Streamline pre-authorization submissions, reduce denials, and accelerate reimbursement with AI-powered clinical documentation.",
    features: [
      "Automated prior auth determination",
      "Clinical evidence summarization",
      "Gap analysis & next best actions",
      "Real-time submission tracking",
    ],
    color: "primary",
  },
  {
    icon: Building2,
    title: "For Payers",
    description: "Optimize utilization management, ensure policy compliance, and improve member experience with intelligent claim processing.",
    features: [
      "Policy-driven decision support",
      "Medical necessity validation",
      "Automated member eligibility",
      "Comprehensive audit trails",
    ],
    color: "info",
  },
];

export function PersonaSection() {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Built for Healthcare Stakeholders
          </h2>
          <p className="text-lg text-muted-foreground">
            Unified platform with tailored experiences for both sides of the revenue cycle.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {personas.map((persona, index) => (
            <div
              key={persona.title}
              className="relative overflow-hidden rounded-2xl border bg-background p-8 shadow-card animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${persona.color === 'primary' ? 'bg-primary-light' : 'bg-info-light'}`}>
                <persona.icon className={`h-7 w-7 ${persona.color === 'primary' ? 'text-primary' : 'text-info'}`} />
              </div>
              
              <h3 className="mb-3 text-2xl font-semibold text-foreground">
                {persona.title}
              </h3>
              
              <p className="mb-6 text-muted-foreground">
                {persona.description}
              </p>
              
              <ul className="mb-8 space-y-3">
                {persona.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                    <div className={`h-1.5 w-1.5 rounded-full ${persona.color === 'primary' ? 'bg-primary' : 'bg-info'}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" asChild>
                <Link to="/dashboard">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
