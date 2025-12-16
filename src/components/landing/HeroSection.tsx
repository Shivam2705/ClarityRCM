import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero py-20 lg:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-4 py-2 text-sm text-primary animate-fade-in">
            <Brain className="h-4 w-4" />
            <span>Powered by Agentic AI</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-in stagger-1">
            Agentic AI for{" "}
            <span className="text-primary">Pre-Authorization</span> &{" "}
            <span className="text-primary">Medical Coding</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground animate-fade-in stagger-2">
            Automating clinical, policy, and coding decisions with explainable AI agents.
            Transform your revenue cycle with intelligent workflow orchestration.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in stagger-3">
            <Button variant="hero" size="xl" asChild>
              <Link to="/dashboard">
                Explore Platform
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 animate-fade-in stagger-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">90% Faster Processing</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-light">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <span className="text-sm font-medium text-foreground">HIPAA Compliant</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info-light">
                <Brain className="h-6 w-6 text-info" />
              </div>
              <span className="text-sm font-medium text-foreground">Explainable AI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
