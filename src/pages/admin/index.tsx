'use client';

import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import Dashboard from "@/components/admin/Dashboard";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { address, isDisconnected, isConnected } = useAccount();

  useEffect(() => {
    // Redirect to home if wallet is not connected
    if (isDisconnected) {
      router.push("/");
    }
  }, [isDisconnected, router]);

  // Show loading state while checking connection
  if (isDisconnected) {
    return null;
  }

  // Show connection prompt if not connected
  if (!isConnected) {
    return (
      <>
        <Head>
          <title>Connect Wallet | SafeTrack DePIN</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <h1 className="text-3xl font-bold text-ink-primary">
              Connect Your Wallet
            </h1>
            <p className="text-ink-secondary max-w-md mx-auto">
              Please connect your wallet to access the SafeTrack admin dashboard. Make sure you're connected to the 0G Network testnet.
            </p>
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold mb-2">0G Network Testnet Details:</p>
              <p>Chain ID: 51917</p>
              <p>RPC URL: https://rpc.0g-testnet.itgen.io</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | SafeTrack DePIN</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-background text-foreground overflow-hidden">
        <Dashboard />
      </main>
    </>
  );
}
