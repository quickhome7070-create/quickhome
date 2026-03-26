"use client";

import { useEffect, useState } from "react";

export default function RecentPage() {
  const [recent, setRecent] = useState<any[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/property/recently-viewed`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setRecent(data || []);
    };
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recently Viewed</h1>

      {recent.length === 0 ? (
        <p>No recent views</p>
      ) : (
        recent.map((p) => (
          <div key={p._id} className="border p-3 mb-3 rounded">
            {p.title} — ₹ {p.price}
          </div>
        ))
      )}
    </div>
  );
}
