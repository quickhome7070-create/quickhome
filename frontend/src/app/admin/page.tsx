"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard() {
  const router = useRouter();

  // ✅ get loading also
  const { user, loading: authLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [stats, setStats] = useState({
  pending: 0,
  approved: 0,
  rejected: 0,
  total: 0,
});

 

  // ✅ AUTH PROTECTION
  useEffect(() => {
    // wait until auth finishes
    if (authLoading) return;

    // not logged in
    if (!user) {
      router.replace("/login");
      return;
    }

    // not admin
    if (user.role !== "admin") {
      router.replace("/403");
    }
  }, [user, authLoading, router]);

  // ✅ FETCH ONLY AFTER ADMIN VERIFIED
  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "admin") return;

    fetchProperties();
  }, [user, authLoading]);

  const fetchProperties = async () => {
  try {
    setLoading(true);

    // pending properties
    const pendingRes = await fetch(`${API}/admin/pending`, {
      credentials: "include",
    });

    const pendingData = await pendingRes.json();

    setProperties(pendingData || []);

    // dashboard stats
    const statsRes = await fetch(`${API}/admin/stats`, {
     credentials: "include",
    });

    const statsData = await statsRes.json();

    setStats({
      pending: statsData.pending || 0,
      approved: statsData.approved || 0,
      rejected: statsData.rejected || 0,
      total: statsData.total || 0,
    });

  } catch (error) {
    console.log(error);
  }

  setLoading(false);
};

  // ✅ prevent flicker
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  // ✅ access denied
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center border">
          
          <h1 className="text-6xl font-bold text-red-600">
            403
          </h1>

          <p className="text-xl font-semibold text-gray-700 mt-4">
            Access Denied
          </p>

          <p className="text-gray-500 mt-2">
            You are not authorized to access this page.
          </p>
        </div>
      </div>
    );
  }

  const handleApprove = async (id: string) => {
    try {
      await fetch(`${API}/admin/approve/${id}`, {
        method: "PUT",
        credentials: "include",
      });

      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

const handleReject = async () => {
  try {

    await fetch(`${API}/admin/reject/${selectedPropertyId}`, {
      method: "PUT",
     credentials: "include",
    });

    setProperties((prev) =>
      prev.filter((p) => p._id !== selectedPropertyId)
    );

    setShowModal(false);

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
                gharDestiny Admin
              </span>

              <span className="text-xs text-gray-500">
                Super Admin
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
              {stats.pending}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <p className="text-gray-500 text-sm">
              Approved Today
            </p>

            <h2 className="text-3xl font-bold text-green-500 mt-2">
              {stats.approved}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <p className="text-gray-500 text-sm">
              Rejected
            </p>

            <h2 className="text-3xl font-bold text-red-500 mt-2">
              {stats.rejected}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <p className="text-gray-500 text-sm">
              Total Platform Listings
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {stats.total}
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
  onClick={async () => {
    setActiveTab("approved");
    setLoading(true);

    try {
      const res = await fetch(`${API}/admin/approved`, {
       credentials: "include",
      });

      const data = await res.json();

      // ✅ show approved properties
      setProperties(data);

    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }}
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

                <div className="relative">
                  <Image
                    src={property.images?.[0] || "/no-image.png"}
                    alt={property.title}
                    width={500}
                    height={300}
                    className="w-full h-56 object-cover"
                  />

                   {activeTab === "pending"?<div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Pending Review
                  </div>:null}

                  
                </div>

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

                  <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                    {property.description || "No description available"}
                  </p>

                 
  <div className="flex gap-3 mt-6">
{activeTab === "pending" && (
    <button
      onClick={() => handleApprove(property._id)}
      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
    >
      Approve
    </button>
)}
    <button
  onClick={() => {
    setSelectedPropertyId(property._id);
    setShowModal(true);
  }}
  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
>
  {activeTab === "pending" ? "Reject" : "Delete"}
</button>

  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

    <div className="bg-white w-[90%] max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">

      <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-100">
        <span className="text-3xl">⚠️</span>
      </div>

      <h2 className="text-2xl font-bold text-center mt-5 text-gray-800">
        {activeTab === "pending"
          ? "Reject Property?"
          : "Delete Property?"}
      </h2>

      <p className="text-gray-500 text-center mt-3">
        {activeTab === "pending"
          ? "This property will be rejected by admin."
          : "This property will be permanently removed."}
      </p>

      <div className="flex gap-3 mt-8">

        <button
          onClick={() => setShowModal(false)}
          className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleReject}
          className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
        >
          Confirm
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
}