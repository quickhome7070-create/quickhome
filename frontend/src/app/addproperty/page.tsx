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
  "1BHK",
  "2BHK",
  "3BHK",
  "4BHK",
];

const SHOP_TYPES = [
  "Hotel",
  "Saloon",
  "Grocery",
  "Medical",
  "Clothing",
  "Mobile Shop",
];

const initialForm = {
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
};

const initialErrors = {
  title: "",
  price: "",
  location: "",
  description: "",
  seller: "",
  propertyType: "",
  bhkType: "",
  plotType: "",
  furnishing: "",
  shopType: "",
  images: "",
};

export default function AddProperty() {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState(initialForm);

  const [errors, setErrors] =
    useState(initialErrors);

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
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handlePropertyType = (
    type: string
  ) => {
    setForm((prev) => ({
      ...prev,
      propertyType: type,
      bhkType: "",
      plotType: "",
      furnishing: "",
      shopType: "",
    }));

    setErrors((prev) => ({
      ...prev,
      propertyType: "",
      bhkType: "",
      plotType: "",
      furnishing: "",
      shopType: "",
    }));
  };

  const handleImages = (
    files: FileList | null
  ) => {
    if (!files) return;

    setImages(Array.from(files));

    setErrors((prev) => ({
      ...prev,
      images: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {
      ...initialErrors,
    };

    let isValid = true;

    if (!form.title.trim()) {
      newErrors.title =
        "Title is required";
      isValid = false;
    }

    if (!form.price) {
      newErrors.price =
        "Price is required";
      isValid = false;
    }

    if (!form.location.trim()) {
      newErrors.location =
        "Location is required";
      isValid = false;
    }

    if (!form.description.trim()) {
      newErrors.description =
        "Description is required";
      isValid = false;
    }

    if (!form.seller) {
      newErrors.seller =
        "Select seller";
      isValid = false;
    }

    if (!form.propertyType) {
      newErrors.propertyType =
        "Select property type";
      isValid = false;
    }

    if (
      ["Flat", "House"].includes(
        form.propertyType
      ) &&
      !form.bhkType
    ) {
      newErrors.bhkType =
        "Select BHK type";
      isValid = false;
    }

    if (
      form.propertyType === "Plot" &&
      !form.plotType
    ) {
      newErrors.plotType =
        "Select plot type";
      isValid = false;
    }

    if (
      form.propertyType ===
        "Office Space" &&
      !form.furnishing
    ) {
      newErrors.furnishing =
        "Select furnishing";
      isValid = false;
    }

    if (
      form.propertyType === "Shop" &&
      !form.shopType
    ) {
      newErrors.shopType =
        "Select shop type";
      isValid = false;
    }

    if (images.length === 0) {
      newErrors.images =
        "Upload at least one image";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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

      setForm(initialForm);

      setErrors(initialErrors);

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
        <div>
          <input
            type="text"
            name="title"
            placeholder="Property Title"
            value={form.title}
            onChange={handleChange}
            className="w-full h-12 border rounded-xl px-4 outline-none focus:ring-2 focus:ring-orange-400"
          />

          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title}
            </p>
          )}
        </div>

        {/* PRICE */}
        <div>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full h-12 border rounded-xl px-4 outline-none focus:ring-2 focus:ring-orange-400"
          />

          {errors.price && (
            <p className="text-red-500 text-sm mt-1">
              {errors.price}
            </p>
          )}
        </div>

        {/* LOCATION */}
        <div>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full h-12 border rounded-xl px-4 outline-none focus:ring-2 focus:ring-orange-400"
          />

          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location}
            </p>
          )}
        </div>

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
                    setForm((prev) => ({
                      ...prev,
                      seller: type,
                    }))
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

          {errors.seller && (
            <p className="text-red-500 text-sm mt-1">
              {errors.seller}
            </p>
          )}
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

          {errors.propertyType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.propertyType}
            </p>
          )}
        </div>

        {/* BHK */}
        {[
          "Flat",
          "House",
        ].includes(form.propertyType) && (

          <div>
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

            {errors.bhkType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bhkType}
              </p>
            )}
          </div>

        )}

        {/* PLOT */}
        {form.propertyType ===
          "Plot" && (

          <div>
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

            {errors.plotType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.plotType}
              </p>
            )}
          </div>

        )}

        {/* FURNISHING */}
        {form.propertyType ===
          "Office Space" && (

          <div>
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

            {errors.furnishing && (
              <p className="text-red-500 text-sm mt-1">
                {errors.furnishing}
              </p>
            )}
          </div>

        )}

        {/* SHOP */}
        {form.propertyType ===
          "Shop" && (

          <div>
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

            {errors.shopType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shopType}
              </p>
            )}
          </div>

        )}

        {/* BUY RENT */}
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
        <div>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-400"
          />

          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description}
            </p>
          )}
        </div>

        {/* IMAGES */}
        <div>
          <input
            type="file"
            multiple
            onChange={(e) =>
              handleImages(
                e.target.files
              )
            }
            className="w-full"
          />

          {errors.images && (
            <p className="text-red-500 text-sm mt-1">
              {errors.images}
            </p>
          )}
        </div>

        {/* SUBMIT */}
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