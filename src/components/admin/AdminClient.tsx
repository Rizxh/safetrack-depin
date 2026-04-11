"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Dashboard from "@/components/admin/Dashboard";

export default function AdminClient() {
  const { isConnected, status } = useAccount();

  if (status === "connecting" || status === "reconnecting") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Menghubungkan wallet…</p>
      </main>
    );
  }

  if (!isConnected) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground">
        <div className="max-w-md space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Hubungkan wallet Anda untuk mengakses dashboard. Pastikan jaringan{" "}
            <span className="font-medium text-foreground">0G Testnet</span> dipilih di dompet.
          </p>
        </div>
        <ConnectButton />
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Dashboard />
    </main>
  );
}
