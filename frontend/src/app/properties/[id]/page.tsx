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
  const router = useRouter();

  const { user } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);

  const [loading, setLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);

  const [contact, setContact] = useState<any>(null);
  const [loadingContact, setLoadingContact] = useState(false);

  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");

  // LOAD PROPERTY DATA
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // PROPERTY
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/${id}`
        );

        const data = await res.json();

        setProperty(data);

        // FAVORITE STATUS
        const favRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/favorite-status/${id}`,
          {
            credentials: "include",
          }
        );

        const favData = await favRes.json();

        setIsFavorite(favData.isFavorite);

        // RECENTLY VIEWED
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/recent/${id}`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        // SIMILAR PROPERTIES
        const simRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/similar/${id}`
        );

        const simData = await simRes.json();

        setSimilar(simData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // VIEW CONTACT
  const handleViewContact = async () => {
    if (!user) {
      router.push("/");
      return;
    }

    setLoadingContact(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/property/contact/${id}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      // SUBSCRIPTION REQUIRED
      if (res.status === 403) {
        setLocked(true);
        setError(data.message);
        return;
      }

      setContact(data);
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoadingContact(false);
    }
  };

  // FAVORITE
  const toggleFavorite = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/property/favorite/${id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error(error);
    }
  };

  // LOADING
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // NOT FOUND
  if (!property) {
    return <div className="p-6">Property not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">

      {/* IMAGES */}
      <div className="flex gap-3 overflow-x-auto">
        {property.images?.length > 0 ? (
          property.images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={property.title}
              width={300}
              height={200}
              className="w-64 h-44 object-cover rounded-xl flex-shrink-0"
            />
          ))
        ) : (
          <Image
            src="/no-image.png"
            alt="No Image"
            width={300}
            height={200}
            className="w-64 h-44 object-cover rounded-xl"
          />
        )}
      </div>

      {/* DETAILS */}
      <div className="mt-5">
        <h1 className="text-3xl font-bold text-gray-800">
          {property.title}
        </h1>

        <p className="text-2xl font-semibold text-green-600 mt-2">
          ₹ {property.price}
        </p>

        <p className="text-gray-500 mt-1">
          📍 {property.location}
        </p>

        <p className="mt-4 text-gray-700 leading-7">
          {property.description}
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 mt-6 flex-wrap">

        <button
          onClick={handleViewContact}
          disabled={loadingContact}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
        >
          {loadingContact ? "Checking..." : "View Contact"}
        </button>

        <button
          onClick={toggleFavorite}
          className={`px-5 py-2 rounded-xl transition ${
            isFavorite
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          {isFavorite
            ? "❤️ Shortlisted"
            : "🤍 Add Shortlist"}
        </button>
      </div>

      {/* CONTACT */}
      <div className="mt-6 relative">

        {/* LOCKED */}
        {locked && !contact && (
          <div className="border rounded-2xl p-6 bg-white shadow-sm flex flex-col items-center text-center">

            <p className="text-xl font-semibold mb-2">
              🔒 Premium Feature
            </p>

            {error && (
              <p className="text-red-500 text-sm mb-3">
                {error}
              </p>
            )}

            <p className="text-gray-500 mb-5">
              Subscribe to view owner contact
            </p>

            <button
              onClick={() => router.push("/plans")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition"
            >
              Subscribe Now
            </button>
          </div>
        )}

        {/* CONTACT CARD */}
        {contact && (
          <div className="border rounded-2xl p-5 bg-gray-50">

            <p>
              <b>Name:</b> {contact.name}
            </p>

            <p className="mt-2">
              <b>Phone:</b> {contact.phone}
            </p>

            <p className="mt-2">
              <b>Email:</b> {contact.email}
            </p>

            <p className="text-sm text-gray-500 mt-4">
              Remaining: {contact.contactsRemaining}
            </p>
          </div>
        )}
      </div>

      {/* SIMILAR PROPERTIES */}
      {similar.length > 0 && (
        <div className="mt-12">

          <h2 className="text-2xl font-bold mb-5">
            Similar Properties
          </h2>

          <div className="grid md:grid-cols-3 gap-5">

            {similar.map((p) => (
              <Link
                key={p._id}
                href={`/properties/${p._id}`}
              >
                <div className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">

                  <Image
                    src={p.images?.[0] || "/no-image.png"}
                    alt={p.title}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">

                    <h3 className="font-semibold text-lg">
                      {p.title}
                    </h3>

                    <p className="text-green-600 font-bold mt-1">
                      ₹ {p.price}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      📍 {p.location}
                    </p>
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


