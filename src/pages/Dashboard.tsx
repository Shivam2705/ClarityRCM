import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PersonaToggle, Persona } from "@/components/dashboard/PersonaToggle";
import { CaseCard } from "@/components/dashboard/CaseCard";
import { mockCases, Case } from "@/data/mockCases";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, LayoutGrid, List, Plus } from "lucide-react";

export default function Dashboard() {
  const [persona, setPersona] = useState<Persona>("provider");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  const filteredCases = mockCases.filter((c) =>
    c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.payerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusCounts = {
    all: mockCases.length,
    new: mockCases.filter((c) => c.status === "New").length,
    inReview: mockCases.filter((c) => c.status === "In Review").length,
    submitted: mockCases.filter((c) => c.status === "Submitted").length,
    approved: mockCases.filter((c) => c.status === "Approved").length,
    denied: mockCases.filter((c) => c.status === "Denied").length,
  };

  const handleCaseClick = (caseData: Case) => {
    navigate(`/case/${caseData.id}`, { state: { persona } });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container py-8">
        {/* Page header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Case Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {persona === "provider" ? "Manage pre-authorization requests and coding workflows" : "Review and process authorization requests"}
            </p>
          </div>
          <PersonaToggle value={persona} onChange={setPersona} />
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-6">
          <div className="rounded-xl border bg-card p-4 shadow-card">
            <p className="text-sm text-muted-foreground">All Cases</p>
            <p className="text-2xl font-bold text-foreground">{statusCounts.all}</p>
          </div>
          <div className="rounded-xl border bg-info-light p-4">
            <p className="text-sm text-info">New</p>
            <p className="text-2xl font-bold text-info">{statusCounts.new}</p>
          </div>
          <div className="rounded-xl border bg-warning-light p-4">
            <p className="text-sm text-warning">In Review</p>
            <p className="text-2xl font-bold text-warning">{statusCounts.inReview}</p>
          </div>
          <div className="rounded-xl border bg-primary-light p-4">
            <p className="text-sm text-primary">Submitted</p>
            <p className="text-2xl font-bold text-primary">{statusCounts.submitted}</p>
          </div>
          <div className="rounded-xl border bg-success-light p-4">
            <p className="text-sm text-success">Approved</p>
            <p className="text-2xl font-bold text-success">{statusCounts.approved}</p>
          </div>
          <div className="rounded-xl border bg-destructive-light p-4">
            <p className="text-sm text-destructive">Denied</p>
            <p className="text-2xl font-bold text-destructive">{statusCounts.denied}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search patients, IDs, or payers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <div className="flex items-center rounded-lg border bg-card p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </div>
        </div>

        {/* Cases grid */}
        <div className={viewMode === "grid" 
          ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" 
          : "flex flex-col gap-3"
        }>
          {filteredCases.map((caseData) => (
            <CaseCard
              key={caseData.id}
              caseData={caseData}
              onClick={() => handleCaseClick(caseData)}
            />
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No cases found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}
