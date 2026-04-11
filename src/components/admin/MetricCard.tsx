interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  status?: "healthy" | "warning" | "critical" | "verified";
  children?: React.ReactNode;
}

export function MetricCard({ title, value, subtitle, status, children }: MetricCardProps) {
  const statusColor = {
    healthy: "text-primary",
    verified: "text-primary",
    warning: "text-warning",
    critical: "text-destructive",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors duration-200">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">{title}</p>
      <p className={`text-2xl font-semibold ${status ? statusColor[status] : "text-foreground"}`}>{value}</p>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      {children}
    </div>
  );
}
