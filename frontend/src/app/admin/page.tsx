"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/properties`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setProperties(data.properties || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id: string, action: string) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/property/${id}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // refresh list
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading admin panel...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Admin Dashboard 🛠️
        </h1>

        {properties.length === 0 ? (
          <p className="text-gray-500">No pending properties</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow p-4 border"
              >
                <img
                  src={p.images?.[0] || "/no-image.png"}
                  className="w-full h-40 object-cover rounded"
                />

                <h2 className="font-bold mt-3">{p.title}</h2>
                <p className="text-gray-500 text-sm">{p.location}</p>
                <p className="font-semibold mt-1">₹ {p.price}</p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAction(p._id, "approve")}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleAction(p._id, "reject")}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}