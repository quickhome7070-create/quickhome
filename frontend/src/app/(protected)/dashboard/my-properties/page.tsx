"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  
 

    const deleteProperty = async (id: string) => {
  if (!confirm("Delete this property?")) return;

   

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property/${id}`, {
    method: "DELETE",
    headers: {
      credentials: "include",
    },
  });

  // remove from UI
  setProperties((prev: any) => prev.filter((p: any) => p._id !== id));
};

const markSold = async (id: string) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property/${id}/sold`, {
    method: "PUT",
    credentials: "include",
  });

  alert("Marked as Sold");
};


  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/property/my-properties`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setProperties(data || []);
    };
    load();
  }, []);

  return (
  <div className="p-6">

    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">My Properties</h1>

      <Link
        href="/addproperty"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        + Create Property
      </Link>
    </div>

    {/* Empty */}
    {properties.length === 0 ? (
      <p>No properties added</p>
    ) : (
      properties.map((p) => (
        <div key={p._id} className="border p-4 mb-4 rounded-lg">

          {/* Property Info */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{p.title}</h2>
              <p className="text-gray-600">₹ {p.price}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">

              <button
                onClick={() => deleteProperty(p._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => markSold(p._id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Mark Sold
              </button>

            </div>
          </div>

        </div>
      ))
    )}
  </div>
);

}
