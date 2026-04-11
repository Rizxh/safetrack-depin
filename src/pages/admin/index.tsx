import dynamic from "next/dynamic";
import Head from "next/head";

const AdminClient = dynamic(() => import("@/components/admin/AdminClient"), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <p className="text-sm text-muted-foreground">Memuat…</p>
    </main>
  ),
});

export default function AdminDashboardPage() {
  return (
    <>
      <Head>
        <title>Admin Dashboard | Safetrack DePIN</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <AdminClient />
    </>
  );
}
