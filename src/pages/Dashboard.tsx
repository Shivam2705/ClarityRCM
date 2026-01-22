import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PersonaToggle, Persona } from "@/components/dashboard/PersonaToggle";
import { mockCases, Case } from "@/data/mockCases";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Plus } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const [persona, setPersona] = useState<Persona>("provider");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredCases = mockCases.filter(
    (c) =>
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.payerName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const statusCounts = {
    all: mockCases.length,
    new: mockCases.filter((c) => c.status === "New").length,
    eligible: mockCases.filter((c) => c.status === "Eligible").length,
    eligiblePaReq: mockCases.filter((c) => c.status === "Eligible PA Req").length,
    notEligible: mockCases.filter((c) => c.status === "Not Eligible").length,
    paReview: mockCases.filter((c) => c.status === "PA Review").length,
    paSubmitted: mockCases.filter((c) => c.status === "PA Submitted").length,
    paDenied: mockCases.filter((c) => c.status === "PA Denied").length,
  };

  const handleCaseClick = (caseData: Case) => {
    navigate(`/case/${caseData.id}`, { state: { persona } });
  };

  const getPriorityColor = (priority: Case["priority"]) => {
    switch (priority) {
      case "High":
        return "text-destructive";
      case "Medium":
        return "text-warning";
      case "Low":
        return "text-muted-foreground";
    }
  };

  const getStatusVariant = (status: Case["status"]) => {
    switch (status) {
      case "New":
        return "new";
      case "Eligible":
        return "eligible";
      case "Eligible PA Req":
        return "eligible-pa-req";
      case "Not Eligible":
        return "not-eligible";
      case "PA Review":
        return "pa-review";
      case "PA Submitted":
        return "pa-submitted";
      case "PA Denied":
        return "pa-denied";
    }
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
              {persona === "provider"
                ? "Manage pre-authorization requests and coding workflows"
                : "Review and process authorization requests"}
            </p>
          </div>
          <PersonaToggle value={persona} onChange={setPersona} />
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-card p-4 shadow-card">
            <p className="text-sm text-muted-foreground">All Cases</p>
            <p className="text-2xl font-bold text-foreground">{statusCounts.all}</p>
          </div>
          <div className="rounded-xl border bg-muted p-4">
            <p className="text-sm text-muted-foreground">New</p>
            <p className="text-2xl font-bold text-muted-foreground">{statusCounts.new}</p>
          </div>
          <div className="rounded-xl border bg-success/10 p-4">
            <p className="text-sm text-success">Eligible</p>
            <p className="text-2xl font-bold text-success">{statusCounts.eligible}</p>
          </div>
          <div className="rounded-xl border bg-warning/10 p-4">
            <p className="text-sm text-warning">Eligible PA Req</p>
            <p className="text-2xl font-bold text-warning">{statusCounts.eligiblePaReq}</p>
          </div>
          <div className="rounded-xl border bg-destructive/10 p-4">
            <p className="text-sm text-destructive">Not Eligible</p>
            <p className="text-2xl font-bold text-destructive">{statusCounts.notEligible}</p>
          </div>
          <div className="rounded-xl border bg-warning/10 p-4">
            <p className="text-sm text-warning">PA Review</p>
            <p className="text-2xl font-bold text-warning">{statusCounts.paReview}</p>
          </div>
          <div className="rounded-xl border bg-success/10 p-4">
            <p className="text-sm text-success">PA Submitted</p>
            <p className="text-2xl font-bold text-success">{statusCounts.paSubmitted}</p>
          </div>
          <div className="rounded-xl border bg-destructive/10 p-4">
            <p className="text-sm text-destructive">PA Denied</p>
            <p className="text-2xl font-bold text-destructive">{statusCounts.paDenied}</p>
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
            <Button variant="default" onClick={() => navigate("/case/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </div>
        </div>

        {/* Cases Table */}
        <div className="rounded-xl border bg-card shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Case ID</TableHead>
                <TableHead className="font-semibold">MRN</TableHead>
                <TableHead className="font-semibold">Member Name</TableHead>
                <TableHead className="font-semibold">DOB</TableHead>
                <TableHead className="font-semibold">Payor Name</TableHead>
                <TableHead className="font-semibold">CPT Code</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((caseData) => (
                <TableRow
                  key={caseData.id}
                  className="cursor-pointer hover:bg-primary/5 transition-colors"
                  onClick={() => handleCaseClick(caseData)}
                >
                  <TableCell className="font-medium text-primary">{caseData.id}</TableCell>
                  <TableCell className="font-mono text-sm">{caseData.patientId}</TableCell>
                  <TableCell className="font-medium">{caseData.patientName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(caseData.dateOfBirth), "MM/dd/yyyy")}
                  </TableCell>
                  <TableCell>{caseData.payerName}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-0.5 rounded">{caseData.procedureCode || "—"}</code>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{caseData.procedureName || "—"}</TableCell>
                  <TableCell>
                    <StatusBadge variant={getStatusVariant(caseData.status)}>{caseData.status}</StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
