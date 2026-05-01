"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/src/context/AuthContext";
const API = process.env.NEXT_PUBLIC_API_URL;
import { useRouter } from "next/navigation";


export default function AdminDashboard() {
    const router = useRouter();
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/admin/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setProperties(data || []);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (!loading) {
      // not logged in
      if (!user) {
        router.push("/login");
      }

      // not admin
      else if (user.role !== "admin") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

   if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-red-600">
            403
          </h1>

          <p className="mt-4 text-gray-600">
            Access Denied
          </p>
        </div>
      </div>
    );
  }
  const handleApprove = async (id: string) => {
    try {
      await fetch(`${API}/admin/approve/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`${API}/admin/reject/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  
  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>

            <p className="text-sm text-gray-500">
              Manage platform properties
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-700">
                QuickHome Admin
              </span>

              <span className="text-xs text-gray-500">
                {user?.role === "admin" ? "Super Admin" : "User"}
              </span>
            </div>

            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              A
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <p className="text-gray-500 text-sm">
              Pending Properties
            </p>

            <h2 className="text-3xl font-bold text-orange-500 mt-2">
              {properties.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <p className="text-gray-500 text-sm">
              Approved Today
            </p>

            <h2 className="text-3xl font-bold text-green-500 mt-2">
              12
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <p className="text-gray-500 text-sm">
              Rejected
            </p>

            <h2 className="text-3xl font-bold text-red-500 mt-2">
              4
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <p className="text-gray-500 text-sm">
              Total Platform Listings
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              124
            </h2>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-3 mb-6 overflow-x-auto">

          <button
            onClick={() => setActiveTab("pending")}
            className={`px-5 py-2 rounded-xl font-medium transition ${
              activeTab === "pending"
                ? "bg-black text-white"
                : "bg-white border text-gray-700"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`px-5 py-2 rounded-xl font-medium transition ${
              activeTab === "approved"
                ? "bg-black text-white"
                : "bg-white border text-gray-700"
            }`}
          >
            Approved
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-5 py-2 rounded-xl font-medium transition ${
              activeTab === "rejected"
                ? "bg-black text-white"
                : "bg-white border text-gray-700"
            }`}
          >
            Rejected
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow animate-pulse overflow-hidden"
              >
                <div className="h-52 bg-gray-200"></div>

                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && properties.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-700">
              No Pending Properties
            </h2>

            <p className="text-gray-500 mt-2">
              Everything is reviewed.
            </p>
          </div>
        )}

        {/* PROPERTY GRID */}
        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-300 border"
              >

                {/* IMAGE */}
                <div className="relative">
                  <Image
                    src={property.images?.[0] || "/no-image.png"}
                    alt={property.title}
                    width={500}
                    height={300}
                    className="w-full h-56 object-cover"
                  />

                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Pending Review
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">

                  <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
                    {property.title}
                  </h2>

                  <p className="text-2xl font-bold text-black mt-2">
                    ₹ {property.price}
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    📍 {property.location}
                  </p>

                  <div className="mt-4 bg-gray-50 rounded-xl p-3 border">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Owner:</span>{" "}
                      {property.owner?.name}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold">Email:</span>{" "}
                      {property.owner?.email}
                    </p>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                    {property.description || "No description available"}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() => handleApprove(property._id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(property._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}