import { useEffect, useState } from "react";

type Stats = {
  total_users: number;
  total_leads: number;
  total_posts: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL ?? "http://api.farutech.local";

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    fetch(`${apiBase}/admin/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("No autorizado");
        return r.json();
      })
      .then((json) => setStats(json.data ?? json))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [apiBase]);

  if (loading) return <p className="p-8">Cargando estadísticas…</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!stats) return null;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Panel de Administración</h1>
      <ul className="mt-6 flex gap-4 text-sm">
        <li className="rounded border p-4">Usuarios: {stats.total_users}</li>
        <li className="rounded border p-4">Leads: {stats.total_leads}</li>
        <li className="rounded border p-4">Publicaciones: {stats.total_posts}</li>
      </ul>
    </main>
  );
}
