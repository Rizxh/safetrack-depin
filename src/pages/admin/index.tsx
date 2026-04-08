import Head from "next/head";
import Dashboard from "@/components/admin/Dashboard";

export default function AdminDashboardPage() {
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
