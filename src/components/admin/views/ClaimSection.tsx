import {
  Scale,
  UploadCloud,
  Lock,
  Unlock,
  AlertCircle,
  FileCheck,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";

const claimsData = [
  {
    id: "CLM-9921",
    boxId: "BOX-1P87",
    status: "Under Review",
    contract: "Locked",
    amount: "500 USDC",
    date: "2026-04-08",
  },
  {
    id: "CLM-9922",
    boxId: "BOX-6W15",
    status: "Approved",
    contract: "Released",
    amount: "1,200 USDC",
    date: "2026-04-07",
  },
  {
    id: "CLM-9923",
    boxId: "BOX-3K49",
    status: "Pending Data",
    contract: "Locked",
    amount: "300 USDC",
    date: "2026-04-08",
  },
];

export function ClaimsSection() {
  const [activeTab, setActiveTab] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false); 

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Claims & Escrow
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Dispute resolution and smart contract settlements
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <UploadCloud className="h-4 w-4" />
          Submit New Claim
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium text-muted-foreground">
              Total Value Locked (TVL)
            </span>
          </div>
          <p className="text-2xl font-semibold text-foreground">
            8,450{" "}
            <span className="text-sm font-normal text-muted-foreground">
              USDC
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-muted-foreground">
              Active Disputes
            </span>
          </div>
          <p className="text-2xl font-semibold text-foreground">
            2{" "}
            <span className="text-sm font-normal text-muted-foreground">
              shipments
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Unlock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Recently Refunded
            </span>
          </div>
          <p className="text-2xl font-semibold text-foreground">
            1,200{" "}
            <span className="text-sm font-normal text-muted-foreground">
              USDC
            </span>
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${activeTab === "active" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            Active Claims
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${activeTab === "history" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            Settlement History
          </button>
        </div>
        <div className="divide-y divide-border/50">
          {claimsData.map((claim) => (
            <div
              key={claim.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/30 transition-colors">
              <div className="flex items-start gap-4">
                <div
                  className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${claim.contract === "Released" ? "bg-primary/15 text-primary" : "bg-warning/15 text-warning"}`}>
                  {claim.contract === "Released" ? (
                    <FileCheck className="h-5 w-5" />
                  ) : (
                    <Scale className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    {claim.id}{" "}
                    <span className="text-muted-foreground font-normal">
                      ({claim.boxId})
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    AI Damage Report Auto-generated
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:text-right">
                <div>
                  <p className="font-semibold text-foreground">
                    {claim.amount}
                  </p>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${claim.contract === "Locked" ? "bg-warning/15 text-warning" : "bg-primary/15 text-primary"}`}>
                    Contract: {claim.contract}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL UPLOAD FOTO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">
                Submit New Claim
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Box ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. BOX-1P87"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-secondary text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Damage Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the physical damage..."
                  className="w-full p-3 rounded-lg border border-border bg-secondary text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Upload Photo Evidence
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-secondary/50 transition-colors cursor-pointer">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium text-foreground">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-primary text-primary-foreground h-10 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors mt-2">
                Submit Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
