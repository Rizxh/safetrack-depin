import Dashboard from "@/components/admin/Dashboard";
import Head from "next/head";

export default function AdminDashboardPage() {
  return (
    <>
      <Head>
        <title>Admin Dashboard | Safetrack Depin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="min-h-screen bg-background text-foreground overflow-hidden">
        <Dashboard/>
      </main>
    </>
  )
}