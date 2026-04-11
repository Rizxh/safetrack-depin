import { useState, useEffect } from "react";
import { Search, Copy, Check } from "lucide-react";
import { shipmentData } from "@/data/mockData";

export function ShipmentTable() {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filtered = shipmentData.filter(
    (r) =>
      r.boxId.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()),
  );

  const copyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const statusBadge = (status: string) => {
    const styles = {
      healthy: "bg-primary/15 text-primary",
      warning: "bg-warning/15 text-warning",
      critical: "bg-destructive/15 text-destructive",
    };
    return styles[status as keyof typeof styles] || "";
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-border">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Shipment Log
          </p>
          <p className="text-lg font-semibold text-foreground mt-1">
            Live Tracking Data
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search box ID or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Box ID
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                Timestamp
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                G-Force
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                AI Damage %
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                0G Hash
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground">
                  {row.boxId}
                </td>
                <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">
                  {isClient
                    ? new Date(row.timestamp).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--"}
                </td>
                <td
                  className={`px-5 py-3 font-medium ${row.gForcePeak > 5 ? "text-destructive" : "text-foreground"}`}>
                  {row.gForcePeak.toFixed(1)}g
                </td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full ${row.aiDamageLikelihood > 50 ? "bg-destructive" : row.aiDamageLikelihood > 20 ? "bg-warning" : "bg-primary"}`}
                        style={{ width: `${row.aiDamageLikelihood}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground">
                      {row.aiDamageLikelihood}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 hidden lg:table-cell">
                  <div className="flex items-center gap-1.5">
                    <code className="text-xs text-muted-foreground font-mono">
                      {row.storageHash.slice(0, 10)}...
                      {row.storageHash.slice(-6)}
                    </code>

                    <button
                      onClick={() => copyHash(row.id, row.storageHash)}
                      className={`p-1.5 rounded-md transition-all shrink-0 border ${
                        copiedId === row.id
                          ? "border-green-400 bg-green-500/10 text-green-400"
                          : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}>
                      {copiedId === row.id ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusBadge(row.status)}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
