// app/properties/[id]/PropertyDetailsClient.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useParams,
  useRouter,
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

  const sliderRef =
    useRef<HTMLDivElement>(null);

    
const [showGallery, setShowGallery] =
  useState(false);

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

  useEffect(() => {

    const slider =
      sliderRef.current;

    if (!slider) return;

    const handleScroll =
      () => {

        const index =
          Math.round(
            slider.scrollLeft /
            slider.clientWidth
          );

        setActiveImage(index);
      };

    slider.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      slider.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  const handleViewContact = async () => {
  if (!user) {
    router.push("/login");
    return;
  }

  setLoadingContact(true);
  setError("");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/property/contact/${id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    // Free contacts exhausted
    if (response.status === 403) {
      router.push("/plans");
      return;
    }

    // Unauthorized
    if (response.status === 401) {
      router.push("/login");
      return;
    }

    // Other errors
    if (!response.ok) {
      setError(data.message || "Something went wrong");
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

   {/* HERO CAROUSEL */}
<div className="relative">

  {/* SLIDER */}
  <div
    ref={sliderRef}
    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
  >

    {property.images.map(
      (img, index) => (

        <div
          key={index}
          onClick={() => {

            setActiveImage(index);

            setShowGallery(true);
          }}
          className="relative min-w-full h-[320px] md:h-[520px] snap-center cursor-pointer"
        >
          <Image
            src={
              img?.replace(
                "/upload/",
                "/upload/f_auto,q_auto,w_1400/"
              ) || "/no-image.png"
            }
            alt={`${property.title}-${index}`}
            fill
            priority={index === 0}
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </div>
      )
    )}
  </div>

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
      className={`w-11 h-11 rounded-full backdrop-blur flex items-center justify-center shadow-lg transition ${
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

  {/* DOTS */}
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">

    {property.images.map(
      (_, index) => (

        <button
          key={index}
          onClick={() => {

            setActiveImage(index);

            sliderRef.current?.scrollTo({
              left:
                index *
                sliderRef.current.clientWidth,
              behavior: "smooth",
            });
          }}
          className={`h-2.5 rounded-full transition-all duration-300 ${
            activeImage === index
              ? "bg-white w-6"
              : "bg-white/50 w-2.5"
          }`}
        />
      )
    )}
  </div>
</div>

{/* FULLSCREEN GALLERY */}
{showGallery && (

  <div className="fixed inset-0 bg-black z-[9999]">

    {/* CLOSE BUTTON */}
    <button
      onClick={() =>
        setShowGallery(false)
      }
      className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-white/20 backdrop-blur text-white text-xl"
    >
      ✕
    </button>

    {/* FULLSCREEN SLIDER */}
    <div className="flex overflow-x-auto snap-x snap-mandatory h-full scrollbar-hide scroll-smooth">

      {property.images.map(
        (img, index) => (

          <div
            key={index}
            className="relative min-w-full h-screen snap-center flex items-center justify-center"
          >
            <Image
              src={
                img?.replace(
                  "/upload/",
                  "/upload/f_auto,q_auto,w_1600/"
                ) || "/no-image.png"
              }
              alt={`gallery-${index}`}
              fill
              className="object-contain"
            />
          </div>
        )
      )}
    </div>

    {/* GALLERY COUNT */}
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm">
      {activeImage + 1} / {property.images.length}
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

                {similar.map((item) => (

                  <Link
                    key={item._id}
                    href={`/properties/${item._id}`}
                  >
                    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

                      <div className="relative h-52">

                        <Image
                          src={
                            item.images?.[0] ||
                            "/no-image.png"
                          }
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="p-5">

                        <h3 className="font-semibold text-lg line-clamp-1">
                          {item.title}
                        </h3>

                        <p className="text-green-600 font-bold mt-2">
                          ₹ {item.price}
                        </p>

                        <p className="text-sm text-gray-500 mt-2">
                          📍 {item.location}
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
                  className="w-full mt-6 bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-900 transition disabled:opacity-70"
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
                    router.push("/plans")
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
                  {contact.contactsRemaining}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}