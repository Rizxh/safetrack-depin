import { AlertTriangle, Info } from "lucide-react";

const thresholds = [
  {
    label: "Low Impact",
    range: "0 – 3g",
    color: "bg-primary/15 text-primary",
    description: "Normal transport vibrations. No action needed.",
  },
  {
    label: "Medium Impact",
    range: "3 – 5g",
    color: "bg-warning/15 text-warning",
    description: "Elevated force detected. Visual inspection recommended.",
  },
  {
    label: "High Impact",
    range: "5 – 8g",
    color: "bg-destructive/15 text-destructive",
    description: "Significant force. Automated incident report triggered.",
  },
  {
    label: "Critical Impact",
    range: "> 8g",
    color: "bg-destructive/20 text-destructive",
    description:
      "Severe shock event. Immediate review required. Shipment flagged.",
  },
];

export function ThresholdsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          G-Force Thresholds
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure alert levels for impact detection
        </p>
      </div>

      <div className="space-y-4">
        {thresholds.map((t) => (
          <div
            key={t.label}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors">
            <div className="flex items-start gap-4">
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${t.color.split(" ")[0]}`}>
                <AlertTriangle className={`h-5 w-5 ${t.color.split(" ")[1]}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{t.label}</h3>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${t.color}`}>
                    {t.range}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-3">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Thresholds are calibrated based on cargo sensitivity profiles.
          Adjustments can be made per shipment in{" "}
          <span className="text-foreground font-medium">
            Settings & API Keys
          </span>
          .
        </p>
      </div>
    </div>
  );
}
