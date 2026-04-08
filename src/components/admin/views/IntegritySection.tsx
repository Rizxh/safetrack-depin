import { useState, useEffect } from "react";
import { Shield, Copy, Check } from "lucide-react";
import { shipmentData } from "@/data/mockData";

export function IntegritySection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const copyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          0G Data Integrity
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Blockchain-verified data log with immutable hashes
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Verified Records
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium ml-auto">
            {shipmentData.length} entries
          </span>
        </div>

        <div className="divide-y divide-border/50">
          {shipmentData.map((s) => (
            <div
              key={s.id}
              className="px-5 py-4 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground text-sm">
                  {s.boxId}
                </span>
                <span className="text-xs text-muted-foreground">
                  {isClient
                    ? new Date(s.timestamp).toLocaleString("en-GB", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--/--"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded flex-1 truncate">
                  {s.storageHash}
                </code>

                {/* Efek Copy Hijau */}
                <button
                  onClick={() => copyHash(s.id, s.storageHash)}
                  className={`p-1.5 rounded-md transition-all shrink-0 border ${
                    copiedId === s.id
                      ? "border-green-500 bg-green-500/10 text-green-500"
                      : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}>
                  {copiedId === s.id ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
