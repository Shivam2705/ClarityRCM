import { Card } from '@/components/ui/card';
import { Calendar, FileText, DollarSign, BarChart3, AlertCircle, Shield } from 'lucide-react';

const valueChainStages = [
  {
    title: "PATIENT ACCESS & REGISTRATION",
    icon: Calendar,
    agents: [
      {
        name: "Patient Smart Scheduler",
        description: "Optimizes appointment scheduling with intelligent slot allocation and patient preference matching"
      },
      {
        name: "Eligibility Verification Agent",
        description: "Real-time insurance eligibility verification with 95%+ accuracy in benefits confirmation"
      },
      {
        name: "Prior Authorization Agent",
        description: "Automates prior authorization requests with 75% faster approval times"
      },
      {
        name: "Registration Assistant",
        description: "Streamlines patient registration with intelligent form completion and error prevention"
      }
    ]
  },
  {
    title: "CLINICAL DOCUMENTATION & CODING",
    icon: FileText,
    agents: [
      {
        name: "Clinical Documentation Agent",
        description: "AI-powered clinical documentation with 98% coding accuracy and automated validation"
      },
      {
        name: "CDI Optimization Agent",
        description: "Increases case mix index by 40% through intelligent documentation improvement"
      },
      {
        name: "Compliance Validator",
        description: "Ensures 100% regulatory adherence with automated coding validation and audit trails"
      },
      {
        name: "Query Assistant",
        description: "Reduces physician query time by 50% with intelligent clarification requests"
      }
    ]
  },
  {
    title: "CLAIMS PROCESSING & SUBMISSION",
    icon: FileText,
    agents: [
      {
        name: "Claims Automation Agent",
        description: "Achieves 95% clean claim rate through predictive analytics and intelligent validation"
      },
      {
        name: "Claims Management Agent",
        description: "Accelerates claim processing by 82% with intelligent payer routing and tracking"
      },
      {
        name: "RCM Performance Analytics Agent",
        description: "Provides 24/7 claim lifecycle tracking with automated exception handling"
      },
      {
        name: "Payer Intelligence Agent",
        description: "Optimizes payer-specific requirements with machine learning pattern recognition"
      }
    ]
  },
  {
    title: "PAYMENT PROCESSING & COLLECTIONS",
    icon: DollarSign,
    agents: [
      {
        name: "Payment Reconciliation Agent",
        description: "Delivers 99.9% payment posting accuracy through advanced matching algorithms"
      },
      {
        name: "A/R Intelligence Agent",
        description: "Improves collection rates by 65% with AI-driven patient engagement strategies"
      },
      {
        name: "Revenue Cycle Audit Agent",
        description: "Reduces manual reconciliation effort by 90% with intelligent variance resolution"
      },
      {
        name: "Patient Payment Agent",
        description: "Increases patient satisfaction by 45% through personalized payment experiences"
      }
    ]
  },
  {
    title: "DENIAL MANAGEMENT & APPEALS",
    icon: AlertCircle,
    agents: [
      {
        name: "Denial Analytics & Recovery Agent",
        description: "Reduces denial rates by 60% through proactive pattern analysis and prevention"
      },
      {
        name: "Appeal Automation Agent",
        description: "Achieves 85% appeal success rate with automated documentation and submission"
      },
      {
        name: "Root Cause Analyzer",
        description: "Identifies systemic issues with AI-driven insights for continuous improvement"
      },
      {
        name: "Priority Intelligence Agent",
        description: "Maximizes ROI through intelligent case prioritization and resource allocation"
      }
    ]
  },
  {
    title: "ANALYTICS & REPORTING",
    icon: BarChart3,
    agents: [
      {
        name: "Compliance Assistant Agent",
        description: "Provides real-time intelligence with executive dashboards tracking 50+ KPIs"
      },
      {
        name: "Healthcare AI Governance Agent",
        description: "Delivers autonomous insights with proactive revenue optimization identification"
      },
      {
        name: "Predictive Forecasting Agent",
        description: "Enables strategic planning with 95%+ accuracy in predictive forecasting"
      },
      {
        name: "Continuous Learning Agent",
        description: "Self-improving performance through reinforcement learning and feedback loops"
      }
    ]
  }
];

export function RCMValueChain() {
  return (
    <div className="w-full pb-4">
      <div className="bg-background rounded-lg p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-3">
            Healthcare Revenue Cycle Management Value Chain
          </h3>
          <p className="text-muted-foreground">
            End-to-End Intelligent Automation & Impact
          </p>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valueChainStages.map((stage, stageIdx) => (
            <div key={stageIdx} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stage.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-sm text-foreground tracking-wide">
                  {stage.title}
                </h4>
              </div>

              {/* Agent Cards */}
              {stage.agents.map((agent, agentIdx) => (
                <Card 
                  key={agentIdx}
                  className="bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-sm text-foreground mb-2 leading-tight">
                          {agent.name}
                        </h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground italic">
            Intelligent multi-agent orchestration delivering measurable business outcomes across the entire revenue cycle
          </p>
        </div>
      </div>
    </div>
  );
}
