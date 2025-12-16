import { FileCheck, Code2, Users, Globe } from "lucide-react";

const capabilities = [
  {
    icon: FileCheck,
    title: "Pre-Auth Intelligence",
    description: "Automated prior authorization determination with policy matching, gold card detection, and real-time eligibility verification.",
    color: "bg-primary-light text-primary",
  },
  {
    icon: Code2,
    title: "Medical Coding Automation",
    description: "AI-powered ICD-10, CPT, and HCPCS code suggestions with confidence scores, clinical rationale, and compliance validation.",
    color: "bg-success-light text-success",
  },
  {
    icon: Users,
    title: "Human-in-the-Loop Governance",
    description: "Transparent decision points with mandatory review workflows, override capabilities, and complete audit trails.",
    color: "bg-warning-light text-warning",
  },
  {
    icon: Globe,
    title: "Interoperability",
    description: "FHIR-compliant APIs, HL7 integration, and seamless connectivity with EHRs, payer systems, and clearinghouses.",
    color: "bg-info-light text-info",
  },
];

export function CapabilitiesSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Key Capabilities
          </h2>
          <p className="text-lg text-muted-foreground">
            Enterprise-grade features designed for healthcare revenue cycle management.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {capabilities.map((capability, index) => (
            <div
              key={capability.title}
              className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-card transition-all duration-300 hover:shadow-elevated animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${capability.color}`}>
                <capability.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                {capability.title}
              </h3>
              <p className="text-muted-foreground">
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
