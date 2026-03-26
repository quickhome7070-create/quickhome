"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/src/context/AuthContext";


type Property = {
  _id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  images: string[];
};

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState<any>(null);
  const [loadingContact, setLoadingContact] = useState(false);
const [error, setError] = useState("");
const [locked, setLocked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [similar, setSimilar] = useState<Property[]>([]);
const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
const { user, logout } = useAuth();
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // 1. Get Property
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/${id}`,
          
        );
        const data = await res.json();
        setProperty(data);

        // 2. Favorite Status
        const favRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/favorite-status/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const favData = await favRes.json();
        setIsFavorite(favData.isFavorite);

        // 3. Add Recently Viewed
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/recent/${id}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // 4. Similar Properties
        const simRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/similar/${id}`
        );
        const simData = await simRes.json();
        setSimilar(simData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);



const handleViewContact = async () => {
  if (!token) {
    router.push("/login");
    return;
  }
 setLoadingContact(true);
 setError("");
  try {  

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/property/contact/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // 🔒 Subscription required
    if (res.status === 403) {
      setLocked(true);
      setLoadingContact(false);
      return;
    }

    const data = await res.json();
    setContact(data);
  } catch (err) {
    console.error(err);
    setError("Something went wrong");
  } finally {
    setLoadingContact(false);
  }
};





  const toggleFavorite = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/property/favorite/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!property) return <div className="p-6">Property not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Image */}
     
      <div className="flex overflow-x-auto gap-2">
  {property.images && property.images.length > 0 ? (
    property.images.map((img: string, index: number) => (
      <Image
        key={index}
        src={img}
        alt={property.title}
        width={300}
        height={200}
        className="h-40 w-60 object-cover rounded flex-shrink-0"
      />
    ))
  ) : (
    <Image
      src="/no-image.png"
      alt="No Image"
      width={300}
      height={200}
      className="h-40 w-60 object-cover"
    />
  )}
</div>
      {/* Details */}
      <h1 className="text-3xl font-bold mt-4">{property.title}</h1>
      <p className="text-xl text-green-600 font-semibold">₹ {property.price}</p>
      <p className="text-gray-600">{property.location}</p>

      <p className="mt-4">{property.description}</p>

      {/* Buttons */}
      <div className="flex gap-3 mt-5">
        <button
  onClick={handleViewContact}
  disabled={loadingContact}
  className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
>
  {loadingContact ? "Checking..." : "View Contact"}
</button>


        <button
          onClick={toggleFavorite}
          className={`px-5 py-2 rounded ${
            isFavorite ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          {isFavorite ? "❤️ Shortlisted" : "🤍 Add Shortlist"}
        </button>
      </div>

      {/* Contact */}
 {/* Contact Section */}
<div className="mt-4 relative">

  {/* 🔒 LOCK OVERLAY */}
  {locked && !contact && (
    <div className="absolute inset-0 bg-white/90 backdrop-blur rounded-xl flex flex-col items-center justify-center z-10 border">
      <p className="font-semibold text-lg mb-2">🔒 Premium Feature</p>
      <p className="text-sm text-gray-600 mb-4">
        Subscribe to view owner contact
      </p>

      <button
        onClick={() => router.push("/plans")}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition"
      >
        Subscribe Now
      </button>
    </div>
  )}

  {/* Contact Card */}
 {contact && (
  <div className="mt-4 border p-4 rounded bg-gray-50">
    <p><b>Name:</b> {contact.name}</p>
    <p><b>Phone:</b> {contact.phone}</p>
    <p><b>Email:</b> {contact.email}</p>

    <p className="text-sm text-gray-500 mt-2">
      Remaining: {contact.contactsRemaining}
    </p>
  </div>
)}
</div>


      {/* Similar Properties */}
      {similar.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3">Similar Properties</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {similar.map((p) => (
              <Link key={p._id} href={`/properties/${p._id}`}>
                <div className="border rounded shadow hover:shadow-lg">
                   <Image
                    src={property.images?.[0] || "/no-image.png"}
                    alt={property.title}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-2">
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-green-600">₹ {p.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
