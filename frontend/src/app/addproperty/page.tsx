"use client";

import Loader from "@/src/components/Loader";
import { useState } from "react";

const PROPERTY_TYPES = [
  "Flat",
  "House",
  "Plot",
  "Office Space",
  "Shop",
];

const BHK_TYPES = [
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK",
];

const SHOP_TYPES = [
  "Hotel",
  "Saloon",
  "Grocery",
  "Medical",
  "Clothing",
  "Mobile Shop",
];

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
    seller: "",

    // NEW
    bhkType: "",
    plotType: "",
    furnishing: "",
    shopType: "",
  });

  const [images, setImages] = useState<
    File[]
  >([]);

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

  const handlePropertyType = (
    type: string
  ) => {
    setForm({
      ...form,
      propertyType: type,

      // reset dynamic fields
      bhkType: "",
      plotType: "",
      furnishing: "",
      shopType: "",
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

      const formData = new FormData();

      Object.entries(form).forEach(
        ([key, value]) => {
          formData.append(key, value);
        }
      );

      images.forEach((image) => {
        formData.append(
          "images",
          image
        );
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
        seller: "",

        bhkType: "",
        plotType: "",
        furnishing: "",
        shopType: "",
      });

      setImages([]);

    } catch (error: any) {
      alert(error.message);

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-6 space-y-5"
      >
        <h1 className="text-2xl font-bold">
          Add Property
        </h1>

        {/* TITLE */}
        <input
          type="text"
          name="title"
          placeholder="Property Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full h-12 border rounded-xl px-4 outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* PRICE */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full h-12 border rounded-xl px-4 outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* LOCATION */}
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full h-12 border rounded-xl px-4 outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* SELLER */}
        <div>
          <p className="font-medium mb-3">
            Seller
          </p>

          <div className="grid grid-cols-2 gap-3">

            {["owner", "agent"].map(
              (type) => (

                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      seller: type,
                    })
                  }
                  className={`h-12 rounded-xl border text-sm font-medium transition ${
                    form.seller === type
                      ? "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white border-orange-400"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {type === "owner"
                    ? "Owner"
                    : "Agent"}
                </button>

              )
            )}

          </div>
        </div>

        {/* PROPERTY TYPE */}
        <div>
          <p className="font-medium mb-3">
            Property Type
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

            {PROPERTY_TYPES.map((type) => (

              <button
                key={type}
                type="button"
                onClick={() =>
                  handlePropertyType(type)
                }
                className={`rounded-xl border p-3 text-sm font-medium transition ${
                  form.propertyType ===
                  type
                    ? "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white border-orange-400"
                    : "bg-white text-gray-700"
                }`}
              >
                {type}
              </button>

            ))}

          </div>
        </div>

        {/* DYNAMIC DROPDOWN */}
        {[
          "Flat",
          "House",
        ].includes(form.propertyType) && (

          <select
            name="bhkType"
            value={form.bhkType}
            onChange={handleChange}
            className="w-full h-12 border rounded-xl px-4 outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">
              Select BHK
            </option>

            {BHK_TYPES.map((type) => (

              <option
                key={type}
                value={type}
              >
                {type}
              </option>

            ))}

          </select>

        )}

        {form.propertyType ===
          "Plot" && (

          <select
            name="plotType"
            value={form.plotType}
            onChange={handleChange}
            className="w-full h-12 border rounded-xl px-4 outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">
              Plot Type
            </option>

            <option value="Residential">
              Residential
            </option>

            <option value="Commercial">
              Commercial
            </option>

          </select>

        )}

        {form.propertyType ===
          "Office Space" && (

          <select
            name="furnishing"
            value={form.furnishing}
            onChange={handleChange}
            className="w-full h-12 border rounded-xl px-4 outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">
              Furnishing
            </option>

            <option value="Furnished">
              Furnished
            </option>

            <option value="Unfurnished">
              Unfurnished
            </option>

          </select>

        )}

        {form.propertyType ===
          "Shop" && (

          <select
            name="shopType"
            value={form.shopType}
            onChange={handleChange}
            className="w-full h-12 border rounded-xl px-4 outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">
              Shop Type
            </option>

            {SHOP_TYPES.map((type) => (

              <option
                key={type}
                value={type}
              >
                {type}
              </option>

            ))}

          </select>

        )}

        {/* BUY / RENT */}
        <select
          name="listingType"
          value={form.listingType}
          onChange={handleChange}
          className="w-full h-12 border rounded-xl px-4 outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="buy">
            Buy
          </option>

          <option value="rent">
            Rent
          </option>
        </select>

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* IMAGES */}
        <input
          type="file"
          multiple
          onChange={(e) =>
            handleImages(e.target.files)
          }
          className="w-full"
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl text-white font-medium bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 shadow-md"
        >
          {loading
            ? "Uploading..."
            : "Create Property"}
        </button>

      </form>

    </div>
  );
}