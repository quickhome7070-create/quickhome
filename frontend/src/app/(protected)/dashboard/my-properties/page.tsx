"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  
 

    const deleteProperty = async (id: string) => {
  if (!confirm("Delete this property?")) return;

   

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property/${id}`, {
    method: "DELETE",
   credentials: "include",
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
 <div className="p-4 sm:p-6 min-h-screen bg-gray-50">

  {/* Header */}
  <div className="
    flex 
    flex-col 
    sm:flex-row 
    justify-between 
    sm:items-center 
    gap-4 
    mb-8
  ">

    <div>
      <h1 className="
        text-3xl 
        font-extrabold 
        text-gray-900
      ">
        My Properties
      </h1>

      <p className="text-gray-500 mt-1">
        Manage your listed properties
      </p>
    </div>


    <Link
      href="/addproperty"
      className="
        inline-flex
        items-center
        justify-center
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        text-white
        px-6
        py-3
        rounded-2xl
        font-semibold
        shadow-lg
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
      "
    >
      Post Property
    </Link>

  </div>

  <p className="text-bold py-2">Total Prorties Posted: <b>{properties.length}</b></p>


  {/* Empty State */}
  {properties.length === 0 ? (

    <div className="
      bg-white
      rounded-3xl
      shadow-sm
      border
      p-10
      text-center
    ">

      <div className="text-5xl mb-4">
        🏠
      </div>

      <h2 className="text-xl font-bold">
        No Properties Yet
      </h2>

      <p className="text-gray-500 mt-2">
        Start listing your property today.
      </p>


      <Link
        href="/addproperty"
        className="
          inline-block
          mt-6
          bg-black
          text-white
          px-6
          py-3
          rounded-xl
        "
      >
        Add First Property
      </Link>

    </div>

  ) : (


    <div className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-3
      gap-6
    ">


      {properties.map((p)=> (

        <div
          key={p._id}
          className="
            bg-white
            rounded-3xl
            overflow-hidden
            border
            border-gray-100
            shadow-sm
            hover:shadow-xl
            transition-all
            duration-300
          "
        >


          {/* Image */}
          <div className="
            h-48
            bg-gray-200
            relative
          ">

            <img
              src={
                p.images?.[0] ||
                "/no-image.png"
              }
              alt={p.title}
              className="
                w-full
                h-full
                object-cover
              "
            />


            {/* Status */}
            {/* Status */}
<div
  className={`
    absolute
    top-3
    left-3
    px-3
    py-1
    rounded-full
    text-xs
    font-semibold
    backdrop-blur
    ${
      p.status === "sold"
        ? "bg-red-100 text-red-700"
        : "bg-green-100 text-green-700"
    }
  `}
>
  {p.status === "sold" ? "Sold" : "Active"}
</div>

          </div>



          {/* Content */}
          <div className="p-5">


            <h2 className="
              text-xl
              font-bold
              line-clamp-1
            ">
              {p.title}
            </h2>


            <p className="
              text-2xl
              font-extrabold
              text-green-600
              mt-2
            ">
              ₹ {p.price}
            </p>


            <p className="
              text-gray-500
              mt-2
              text-sm
            ">
              📍 {p.location}
            </p>



            {/* Actions */}
            <div className="
              grid
              grid-cols-3
              gap-2
              mt-5
            ">


              <Link
                href={`/dashboard/my-properties/edit/${p._id}`}
                className="
                  text-center
                  bg-blue-600
                  text-white
                  py-2
                  rounded-xl
                  text-sm
                  font-semibold
                  hover:bg-blue-700
                  transition
                "
              >
                Edit
              </Link>



              <button
                onClick={() => deleteProperty(p._id)}
                className="
                  bg-red-600
                  text-white
                  py-2
                  rounded-xl
                  text-sm
                  font-semibold
                  hover:bg-red-700
                  transition
                "
              >
                Delete
              </button>



              <button
                onClick={() => markSold(p._id)}
                className="
                  bg-green-600
                  text-white
                  py-2
                  rounded-xl
                  text-sm
                  font-semibold
                  hover:bg-green-700
                  transition
                "
              >
                Sold
              </button>


            </div>

          </div>

        </div>

      ))}


    </div>

  )}

</div>
);

}
