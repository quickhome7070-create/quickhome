"use client";

import { useRouter } from "next/navigation";

export default function PropertyFiltersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Property Filters
        </h1>

        <button
          onClick={() => router.push("/properties")}
          className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </div>
    </div>
  );
}