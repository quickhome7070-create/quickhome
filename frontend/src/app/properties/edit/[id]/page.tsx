"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const loadProperty = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/property/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setProperty(data);
      setLoading(false);
    };

    loadProperty();
  }, []);

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/property/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(property),
      }
    );

    if (res.ok) {
      alert("Property updated");
      router.push("/dashboard/my-properties");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Property</h1>

      <form onSubmit={handleUpdate} className="space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={property.title}
          onChange={(e) =>
            setProperty({ ...property, title: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Price"
          value={property.price}
          onChange={(e) =>
            setProperty({ ...property, price: e.target.value })
          }
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Property
        </button>
      </form>
    </div>
  );
}
