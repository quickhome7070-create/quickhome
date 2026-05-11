"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { useAuth } from "@/src/context/AuthContext";

import Loader from "@/src/components/Loader";

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

  const [property, setProperty] =
    useState<Property | null>(null);

  const [similar, setSimilar] =
    useState<Property[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [isFavorite, setIsFavorite] =
    useState(false);

  const [contact, setContact] =
    useState<any>(null);

  const [loadingContact, setLoadingContact] =
    useState(false);

  const [locked, setLocked] =
    useState(false);

  const [error, setError] =
    useState("");

  const [activeImage, setActiveImage] =
    useState(0);

  useEffect(() => {

    if (!id) return;

    const fetchData = async () => {

      try {

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/${id}`
        );

        const data = await res.json();

        setProperty(data);

        const favRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/favorite-status/${id}`,
          {
            credentials: "include",
          }
        );

        const favData =
          await favRes.json();

        setIsFavorite(
          favData.isFavorite
        );

        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/recent/${id}`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        const simRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/similar/${id}`
        );

        const simData =
          await simRes.json();

        setSimilar(simData || []);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

    fetchData();

  }, [id]);

  const handleViewContact = async () => {

    if (!user) {

      router.push("/login");

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

      const data =
        await res.json();

      if (res.status === 403) {

        setLocked(true);

        setError(data.message);

        return;
      }

      setContact(data);

    } catch (error) {

      console.log(error);

      setError(
        "Something went wrong"
      );

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
          credentials: "include",
        }
      );

      setIsFavorite(
        !isFavorite
      );

    } catch (error) {

      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!property) {
    return (
      <div className="p-10 text-center text-gray-500">
        Property not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] pb-20">

      {/* HERO IMAGE */}
      <div className="relative h-[320px] md:h-[520px] overflow-hidden">

        <Image
          src={
            property.images?.[
              activeImage
            ] || "/no-image.png"
          }
          alt={property.title}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* TOP BUTTONS */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">

          <button
            onClick={() =>
              router.back()
            }
            className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-medium shadow-lg"
          >
            ← Back
          </button>

          <button
            onClick={
              toggleFavorite
            }
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/90 text-black"
            }`}
          >
            {isFavorite
              ? "❤️ Saved"
              : "🤍 Save"}
          </button>
        </div>

        {/* PROPERTY INFO */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white z-10">

          <div className="max-w-6xl mx-auto">

            <p className="inline-block bg-white/20 backdrop-blur px-4 py-1 rounded-full text-sm mb-4">
              Premium Property
            </p>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              {property.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 mt-5">

              <p className="text-3xl font-bold text-green-300">
                ₹ {property.price}
              </p>

              <p className="text-white/90">
                📍 {property.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* THUMBNAILS */}
      {property.images?.length > 1 && (
        <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">

          <div className="flex gap-3 overflow-x-auto pb-2">

            {property.images.map(
              (img, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setActiveImage(
                      index
                    )
                  }
                  className={`relative min-w-[110px] h-24 rounded-2xl overflow-hidden border-4 ${
                    activeImage ===
                    index
                      ? "border-orange-500"
                      : "border-white"
                  } shadow-lg`}
                >
                  <Image
                    src={img}
                    alt="thumb"
                    fill
                    className="object-cover"
                  />
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 mt-10 grid lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* DESCRIPTION */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <h2 className="text-2xl font-bold mb-5">
              About Property
            </h2>

            <p className="text-gray-600 leading-8">
              {property.description}
            </p>
          </div>

          {/* SIMILAR */}
          {similar.length > 0 && (
            <div>

              <h2 className="text-2xl font-bold mb-5">
                Similar Properties
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                {similar.map((p) => (

                  <Link
                    key={p._id}
                    href={`/properties/${p._id}`}
                  >
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">

                      <div className="relative h-52">

                        <Image
                          src={
                            p.images?.[0] ||
                            "/no-image.png"
                          }
                          alt={p.title}
                          fill
                          className="object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        <div className="absolute bottom-4 left-4 text-white">

                          <p className="font-bold text-xl">
                            ₹ {p.price}
                          </p>
                        </div>
                      </div>

                      <div className="p-5">

                        <h3 className="font-semibold text-lg line-clamp-1">
                          {p.title}
                        </h3>

                        <p className="text-gray-500 text-sm mt-2">
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

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* CONTACT CARD */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-6">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                Owner Details
              </h2>

              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold">
                O
              </div>
            </div>

            {!contact && !locked && (

              <div className="mt-6">

                <p className="text-gray-500 leading-7">
                  View owner phone number and email instantly.
                </p>

                <button
                  onClick={
                    handleViewContact
                  }
                  disabled={
                    loadingContact
                  }
                  className="w-full mt-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition"
                >
                  {loadingContact
                    ? "Checking..."
                    : "View Contact"}
                </button>
              </div>
            )}

            {/* LOCKED */}
            {locked && !contact && (

              <div className="mt-6 text-center">

                <div className="text-5xl">
                  🔒
                </div>

                <p className="font-semibold text-xl mt-4">
                  Premium Access
                </p>

                {error && (
                  <p className="text-red-500 text-sm mt-2">
                    {error}
                  </p>
                )}

                <button
                  onClick={() =>
                    router.push(
                      "/plans"
                    )
                  }
                  className="w-full mt-6 bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition"
                >
                  Upgrade Plan
                </button>
              </div>
            )}

            {/* CONTACT */}
            {contact && (

              <div className="mt-6 space-y-4">

                <div className="bg-gray-50 rounded-2xl p-4">

                  <p className="text-sm text-gray-500">
                    Name
                  </p>

                  <p className="font-semibold mt-1">
                    {contact.name}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">

                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="font-semibold mt-1">
                    {contact.phone}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">

                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="font-semibold mt-1 break-all">
                    {contact.email}
                  </p>
                </div>

                <p className="text-sm text-gray-500 text-center pt-2">
                  Remaining contacts:
                  {" "}
                  {
                    contact.contactsRemaining
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}