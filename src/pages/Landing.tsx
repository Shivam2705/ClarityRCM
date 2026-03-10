// import { LandingNav } from "@/components/landing/LandingNav";
// import { HeroSection } from "@/components/landing/HeroSection";
// import { WorkflowSection } from "@/components/landing/WorkflowSection";
// import { CapabilitiesSection } from "@/components/landing/CapabilitiesSection";
// import { PersonaSection } from "@/components/landing/PersonaSection";
// import { Footer } from "@/components/landing/Footer";

// export default function Landing() {
//   return (
//     <div className="min-h-screen bg-background">
//       <LandingNav />
//       <main>
//         <HeroSection />
//         <section id="workflow">
//           <WorkflowSection />
//         </section>
//         <section id="capabilities">
//           <CapabilitiesSection />
//         </section>
//         <section id="personas">
//           <PersonaSection />
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import { mockCases } from "@/data/mockCases";
import { CaseCard } from "@/components/dashboard/CaseCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Brain,
  Zap,
  Network,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react";
import { RCMValueChain } from "@/components/landing/RCMValueChain";
import EssentialTools from "@/components/landing/EssentialTools";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-theme min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative border-b border-border/50 bg-gradient-to-br from-card via-background to-card overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-accent/10"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-foreground mb-6 tracking-tight">
              <span className="block text-8xl lg:text-9xl font-extrabold">EXL RevFlow.AI</span>
              <span className="block text-3xl lg:text-4xl font-medium mt-3 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                End-to-End Revenue Cycle Platform
              </span>
            </h1>
            <Badge className="mb-6 bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border-primary/30 backdrop-blur-sm">
              <Activity className="h-3 w-3 mr-1.5" />
              Powered by Google
            </Badge>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto">
              Transform your Revenue Cycle Management with intelligent multi-agent orchestration. Leveraging hybrid
              retrieval, advanced reasoning, and real-time decision-making to streamline prior authorizations from days
              to minutes.
            </p>

            <div className="flex gap-4 justify-center mb-16">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold px-8"
              >
                Access Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white/40 hover:text-black hover:bg-white"
                onClick={() => window.open("https://docs.lovable.dev", "_blank")}
              >
                Learn More
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  10x
                </div>
                <div className="text-sm text-muted-foreground">Faster Processing</div>
                <div className="text-xs text-muted-foreground/70 mt-1">Than manual authorization submissions</div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
                <div className="text-4xl font-bold bg-gradient-to-r from-success to-agent-analyzer bg-clip-text text-transparent mb-2">
                  98%
                </div>
                <div className="text-sm text-muted-foreground">First-Pass Resolution</div>
                <div className="text-xs text-muted-foreground/70 mt-1">Reduce rework and resubmissions</div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
                <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-2">
                  80%
                </div>
                <div className="text-sm text-muted-foreground">Task Reduction</div>
                <div className="text-xs text-muted-foreground/70 mt-1">Automate repetitive manual work</div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent mb-2">
                  $2M+
                </div>
                <div className="text-sm text-muted-foreground">Annual Savings</div>
                <div className="text-xs text-muted-foreground/70 mt-1">Per 100-bed facility</div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Architecture Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Intelligent Multi-Agent Orchestration</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our agentic AI platform delivers enterprise-grade automation across your entire prior authorization workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 border-l-4 border-l-agent-orchestrator bg-gradient-to-br from-card to-card/50">
            <Brain className="h-8 w-8 text-agent-orchestrator mb-4" />
            <h3 className="font-semibold text-lg mb-2">Intelligent Coordination</h3>
            <p className="text-sm text-muted-foreground">
              Seamlessly manages case workflow from intake to decision, ensuring every authorization moves efficiently
            </p>
          </Card>

          <Card className="p-6 border-l-4 border-l-agent-analyzer bg-gradient-to-br from-card to-card/50">
            <Zap className="h-8 w-8 text-agent-analyzer mb-4" />
            <h3 className="font-semibold text-lg mb-2">Document Processing</h3>
            <p className="text-sm text-muted-foreground">
              Instantly extracts key clinical information from any document format, eliminating manual data entry
            </p>
          </Card>

          <Card className="p-6 border-l-4 border-l-primary bg-gradient-to-br from-card to-card/50">
            <Network className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Policy Matching</h3>
            <p className="text-sm text-muted-foreground">
              Automatically validates criteria against insurance requirements, reducing denials and rework
            </p>
          </Card>

          <Card className="p-6 border-l-4 border-l-secondary bg-gradient-to-br from-card to-card/50">
            <CheckCircle2 className="h-8 w-8 text-secondary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Smart Decisions</h3>
            <p className="text-sm text-muted-foreground">
              Delivers consistent, defensible authorization outcomes that stand up to scrutiny
            </p>
          </Card>
        </div>

        <Card className="p-8 bg-gradient-to-br from-primary/5 via-card to-accent/5 border-primary/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Accelerate Your Revenue</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Submit Request</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload clinical notes, imaging, labs, and insurance policies through any channel
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Instant Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Our system immediately reads and understands all medical documents
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/20 text-secondary font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Automated Validation</h4>
                    <p className="text-sm text-muted-foreground">
                      Clinical data is cross-referenced against insurance criteria automatically
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 text-success font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Decision Delivery</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive detailed authorization decisions with complete rationale and next steps
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="p-4 bg-card/50 border-success/30">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Faster Revenue Realization</h4>
                    <p className="text-xs text-muted-foreground">
                      Reduce authorization delays from days to minutes, accelerating reimbursement cycles
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-card/50 border-primary/30">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Reduced Operational Costs</h4>
                    <p className="text-xs text-muted-foreground">
                      Lower administrative overhead by 40% while freeing staff for higher-value work
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-card/50 border-accent/30">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Audit-Ready Documentation</h4>
                    <p className="text-xs text-muted-foreground">
                      Complete transparency with detailed rationale and evidence for every decision
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-card/50 border-secondary/30">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-secondary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Error Prevention</h4>
                    <p className="text-xs text-muted-foreground">
                      Multi-layer validation ensures 98% accuracy with intelligent flagging of edge cases
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Agent Suites */}
      <div className="border-t border-border/50 bg-gradient-to-br from-card/50 via-background to-card/50">
        <EssentialTools />
      </div>

      <div className="border-t border-border/50 bg-gradient-to-br from-card via-background to-card">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Transform Your RCM Process?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join leading healthcare organizations leveraging agentic AI for faster, more accurate prior authorizations
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold px-8"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
