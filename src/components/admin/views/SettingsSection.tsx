import { Settings, Key, Copy, Check, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const apiKeys = [
  {
    label: "0G Network API",
    key: process.env.NEXT_PUBLIC_0G_API_KEY || "0g_sk_test_dummy_123",
    status: "active",
  },
  {
    label: "Mirofish AI Engine",
    key: process.env.NEXT_PUBLIC_MIROFISH_API_KEY || "mf_pk_test_dummy_456",
    status: "active",
  },
  {
    label: "Sensor Gateway",
    key: process.env.NEXT_PUBLIC_SENSOR_GATEWAY_KEY || "sg_key_test_dummy_789",
    status: "active",
  },
];

export function SettingsSection() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [visibleIdx, setVisibleIdx] = useState<number | null>(null);

  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const copyKey = (idx: number, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Settings & API Keys
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage integrations and access credentials
        </p>
      </div>

      <div className="space-y-4">
        {apiKeys.map((api, idx) => (
          <div
            key={api.label}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-primary shrink-0" />
                <span className="font-medium text-foreground text-sm">
                  {api.label}
                </span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                {api.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono text-muted-foreground bg-secondary px-3 py-2 rounded-lg flex-1 truncate">
                {visibleIdx === idx ? api.key : "•".repeat(24)}
              </code>
              <button
                onClick={() => setVisibleIdx(visibleIdx === idx ? null : idx)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground shrink-0">
                {visibleIdx === idx ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>

              <button
                onClick={() => copyKey(idx, api.key)}
                className={`p-2 rounded-lg transition-all shrink-0 border ${
                  copiedIdx === idx
                    ? "border-green-400 bg-green-500/10 text-green-400"
                    : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}>
                {copiedIdx === idx ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium text-foreground">
            General Settings
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <span className="text-sm text-muted-foreground">
              Alert Notifications
            </span>
            <button
              onClick={() => setAlertsEnabled(!alertsEnabled)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${alertsEnabled ? "bg-green-500" : "bg-secondary"}`}>
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${alertsEnabled ? "translate-x-4" : "translate-x-1"}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <span className="text-sm text-muted-foreground">
              Data Retention
            </span>
            <span className="text-sm font-medium text-foreground">90 days</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border/50">
            <span className="text-sm text-muted-foreground">
              Auto-sync Interval
            </span>
            <span className="text-sm font-medium text-foreground">
              30 seconds
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-muted-foreground">Timezone</span>
            <span className="text-sm font-medium text-foreground">UTC+0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
