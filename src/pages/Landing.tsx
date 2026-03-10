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

import { useNavigate } from 'react-router-dom';
import { mockCases } from '@/data/mockCases';
import { CaseCard } from '@/components/dashboard/CaseCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Brain, Zap, Network, TrendingUp, Clock, ArrowRight, CheckCircle2, XCircle, Users } from 'lucide-react';
import { RCMValueChain } from '@/components/landing/RCMValueChain';

const Landing = () => {
  const navigate = useNavigate();


  return (
    <div className="landing-theme min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative border-b border-border/50 bg-gradient-to-br from-card via-background to-card overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-accent/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-gradient-to-r from-primary/20 to-accent/20 text-foreground border-primary/30 backdrop-blur-sm">
              <Activity className="h-3 w-3 mr-1.5" />
              Enterprise-Grade AI for Healthcare Operations
            </Badge>
            
            <h1 className="text-7xl font-bold text-foreground mb-6 tracking-tight">
              Prior Authorization
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Powered by Agentic AI
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto">
              Transform your Revenue Cycle Management with intelligent multi-agent orchestration. 
              Leveraging hybrid retrieval, advanced reasoning, and real-time decision-making to streamline 
              prior authorizations from days to minutes.
            </p>

            <div className="flex gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold px-8"
              >
                Access Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-white border-white/40 hover:text-black hover:bg-white"
                onClick={() => window.open('https://docs.lovable.dev', '_blank')}
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

      {/* RCM Value Chain */}
      <div className="border-t border-border/50 bg-gradient-to-br from-card/50 via-background to-card/50 py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <RCMValueChain />
        </div>
      </div>

      {/* Challenges Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Transforming Prior Authorization Challenges
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Traditional manual processes create significant operational and financial barriers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 bg-gradient-to-br from-destructive/5 to-card border-destructive/20">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20 text-destructive font-bold flex-shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Extended Processing Times</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Manual authorization requests take 3-7 days on average, with RCM teams spending 
                  hours navigating complex payer portals and waiting on hold.
                </p>
                <div className="text-xs text-destructive font-medium">Impact: Delayed patient care and lost revenue opportunities</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-destructive/5 to-card border-destructive/20">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20 text-destructive font-bold flex-shrink-0">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">High Denial & Rejection Rates</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  30-40% of initial authorization requests are denied due to incomplete documentation, 
                  missing clinical justification, or policy mismatches.
                </p>
                <div className="text-xs text-destructive font-medium">Impact: $2.5M+ in annual write-offs per 100-bed facility</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-destructive/5 to-card border-destructive/20">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20 text-destructive font-bold flex-shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Complex Payer Policy Variations</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Each payer maintains different authorization requirements, frequently updated guidelines, 
                  and varied clinical criteria across 500+ policy documents.
                </p>
                <div className="text-xs text-destructive font-medium">Impact: 60% staff time spent on policy research vs. patient care</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-destructive/5 to-card border-destructive/20">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20 text-destructive font-bold flex-shrink-0">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Resource-Intensive Manual Review</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Clinical staff spend 15-20 hours per week on authorization tasks, including document 
                  gathering, form completion, and peer-to-peer reviews.
                </p>
                <div className="text-xs text-destructive font-medium">Impact: $250K+ annual cost in staff time per authorization specialist</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-destructive/5 to-card border-destructive/20">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20 text-destructive font-bold flex-shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Patient Satisfaction Impact</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Authorization delays lead to postponed procedures, medication interruptions, 
                  and frustrated patients who often blame the provider organization.
                </p>
                <div className="text-xs text-destructive font-medium">Impact: 25% decrease in patient satisfaction scores</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-destructive/5 to-card border-destructive/20">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/20 text-destructive font-bold flex-shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Compliance & Audit Risk</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Manual processes lack comprehensive audit trails, documentation standards, 
                  and consistent decision-making frameworks required for regulatory compliance.
                </p>
                <div className="text-xs text-destructive font-medium">Impact: Increased audit liability and potential penalties</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Solution Architecture Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Intelligent Multi-Agent Orchestration
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our agentic AI platform delivers enterprise-grade automation across your entire 
            prior authorization workflow
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

      {/* Footer CTA */}
      <div className="border-t border-border/50 bg-gradient-to-br from-card via-background to-card">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your RCM Process?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join leading healthcare organizations leveraging agentic AI for faster, 
            more accurate prior authorizations
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/login')}
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
