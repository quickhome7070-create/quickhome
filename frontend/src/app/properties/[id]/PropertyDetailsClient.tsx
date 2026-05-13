// app/properties/[id]/PropertyDetailsClient.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useState,
} from "react";

import {
  useRouter,
  useParams,
} from "next/navigation";

import { useAuth } from "@/src/context/AuthContext";

type Property = {
  _id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  images: string[];
};

type Contact = {
  name: string;
  phone: string;
  email: string;
  contactsRemaining: number;
};

type Props = {
  property: Property;
  similar: Property[];
};

export default function PropertyDetailsClient({
  property,
  similar,
}: Props) {

  const { id } =
    useParams();

  const router =
    useRouter();

  const { user } =
    useAuth();

  const [activeImage, setActiveImage] =
    useState(0);

  const [isFavorite, setIsFavorite] =
    useState(false);

  const [contact, setContact] =
    useState<Contact | null>(null);

  const [loadingContact, setLoadingContact] =
    useState(false);

  const [locked, setLocked] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleViewContact =
    async () => {

      if (!user) {
        router.push("/login");
        return;
      }

      setLoadingContact(true);

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

  const toggleFavorite =
    async () => {

      try {

        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/favorite/${id}`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        setIsFavorite(
          (prev) => !prev
        );

      } catch (error) {

        console.log(error);
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#eef2ff] pb-20">

      {/* HERO */}
      <div className="relative h-[320px] md:h-[520px] overflow-hidden">

        <Image
          src={
            property.images?.[
              activeImage
            ]?.replace(
              "/upload/",
              "/upload/f_auto,q_auto,w_1400/"
            ) || "/no-image.png"
          }
          alt={property.title}
          fill
          priority
          className="object-cover transition-all duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* TOP ACTIONS */}
        <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between">

          <button
            onClick={() =>
              router.back()
            }
            className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-sm font-medium"
          >
            ← Back
          </button>

          <button
            onClick={
              toggleFavorite
            }
            className={`w-11 h-11 rounded-full backdrop-blur flex items-center justify-center shadow-lg ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/90 text-black"
            }`}
          >
            ❤️
          </button>
        </div>

        {/* IMAGE COUNT */}
        <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur text-white px-4 py-2 rounded-full text-sm z-20">
          {activeImage + 1} / {property.images.length}
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
                  className={`relative min-w-[110px] h-24 rounded-2xl overflow-hidden border-4 shadow-lg ${
                    activeImage ===
                    index
                      ? "border-orange-500"
                      : "border-white"
                  }`}
                >
                  <Image
                    src={img}
                    alt="thumb"
                    fill
                    className="object-cover hover:scale-110 transition duration-300"
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

          {/* INFO */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {property.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-4">

              <p className="text-3xl font-bold text-green-600">
                ₹ {property.price}
              </p>

              <p className="text-gray-500">
                📍 {property.location}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">

              <div className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                Verified Property
              </div>

              <div className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                Premium Listing
              </div>

              <div className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                Ready to Move
              </div>
            </div>
          </div>

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
                    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

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
                      </div>

                      <div className="p-5">

                        <h3 className="font-semibold text-lg line-clamp-1">
                          {p.title}
                        </h3>

                        <p className="text-green-600 font-bold mt-2">
                          ₹ {p.price}
                        </p>

                        <p className="text-sm text-gray-500 mt-2">
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

        {/* SIDEBAR */}
        <div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                Owner Details
              </h2>

              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold">
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
                  className="w-full mt-6 bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-900 transition"
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

                <p className="text-sm text-center text-gray-500 pt-2">
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