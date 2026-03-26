"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card title="My Properties" value={stats.myProperties} />
        <Card title="Favorites" value={stats.favorites} />
        <Card title="Contact Views" value={stats.contactViews} />
        <Card title="Remaining Views" value={stats.remainingViews} />
      </div>

      {/* Navigation */}
      <div className="grid md:grid-cols-3 gap-4">
        <NavCard title="My Properties" link="/dashboard/my-properties" />
        <NavCard title="My Favorites" link="/dashboard/favorites" />
        <NavCard title="Recently Viewed" link="/dashboard/recent" />
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white shadow rounded p-4 text-center">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function NavCard({ title, link }: any) {
  return (
    <Link href={link}>
      <div className="border rounded p-6 text-center hover:shadow cursor-pointer">
        <p className="font-semibold">{title}</p>
      </div>
    </Link>
  );
}
