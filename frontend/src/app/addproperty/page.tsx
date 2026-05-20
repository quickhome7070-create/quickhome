"use client";

import Loader from "@/src/components/Loader";
import { useState } from "react";

export default function AddProperty() {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
    listingType: "buy",
    propertyType: "",
    seller:""
  });

  const [images, setImages] = useState<
    File[]
  >([]);

  const propertyTypes = [
    "Flat",
    "House",
    "Plot",
    "Office Space",
    "Shop",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImages = (
    files: FileList | null
  ) => {
    if (!files) return;

    setImages(Array.from(files));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (loading){
        return <Loader/>
      }

      const formData = new FormData();

      Object.entries(form).forEach(
        ([key, value]) => {
          formData.append(key, value);
        }
      );

      images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/property`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("Property Added");

      setForm({
        title: "",
        price: "",
        location: "",
        description: "",
        listingType: "buy",
        propertyType: "",
        seller:""
      });

      setImages([]);

    } catch (error: any) {
      alert(error.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-lg space-y-4"
      >
        <h1 className="text-2xl font-bold">
          Add Property
        </h1>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-xl"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-xl"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-xl"
        />

        {/* Seeler */}
         <div>
          <p className="font-medium mb-3">
            Seller
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

        {["owner", "agent"].map((type) => (

    <button
      key={type}
      type="button"
     
       onClick={() =>
                  setForm({
                    ...form,
                    seller: type,
                  })
                }
                 className={`rounded-2xl border p-3 text-sm font-medium transition ${
                  form.seller === type
                    ? "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white border-orange-400"
                    : "bg-white text-gray-700"
                }`}
    >
      {type === "owner"
        ? "Owner"
        : "Agent"}
    </button>

  ))}

  </div></div>

        {/* PROPERTY TYPE */}
        <div>
          <p className="font-medium mb-3">
            Property Type
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

            {propertyTypes.map((type) => (

              <button
                type="button"
                key={type}
                onClick={() =>
                  setForm({
                    ...form,
                    propertyType: type,
                  })
                }
                className={`rounded-2xl border p-3 text-sm font-medium transition ${
                  form.propertyType === type
                    ? "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white border-orange-400"
                    : "bg-white text-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <select
          name="listingType"
          value={form.listingType}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl"
        >
          <option value="buy">
            Buy
          </option>

          <option value="rent">
            Rent
          </option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full border p-3 rounded-xl"
        />

        <input
          type="file"
          multiple
          onChange={(e) =>
            handleImages(e.target.files)
          }
        />

        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white py-3 rounded-xl shadow-md"
        >
          {loading
            ? "Uploading..."
            : "Create Property"}
        </button>
      </form>
    </div>
  );
}