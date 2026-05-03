"use client";

import { useState } from "react";

export default function AddProperty() {
  const [form, setForm] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image select
  const handleImages = (files: FileList) => {
    const fileArray = Array.from(files);
    setImages((prev) => [...prev, ...fileArray]);

    const previewUrls = fileArray.map((file) =>
      URL.createObjectURL(file)
    );
    setPreview((prev) => [...prev, ...previewUrls]);
  };

  // Drag & Drop
  const handleDrop = (e: any) => {
    e.preventDefault();
    handleImages(e.dataTransfer.files);
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreview = [...preview];
    newImages.splice(index, 1);
    newPreview.splice(index, 1);
    setImages(newImages);
    setPreview(newPreview);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setProgress(15);

     

    const formData = new FormData();
    Object.keys(form).forEach((key) =>
      formData.append(key, (form as any)[key])
    );
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/property`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      setProgress(70);
      const data = await res.json();

      if (res.ok) {
        setProgress(100);
        alert("✅ Property created successfully");

        setForm({
          title: "",
          price: "",
          location: "",
          description: "",
        });
        setImages([]);
        setPreview([]);
      } else {
        alert(data.message || "Error");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-gray-200">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Post Property
        </h2>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="w-full bg-gray-200 h-2 rounded-full mb-5 overflow-hidden">
            <div
              className="bg-blue-600 h-2 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Property Title"
            required
            className="input"
          />

          {/* Price */}
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="input"
          />

          {/* Location */}
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            required
            className="input"
          />

          {/* Description */}
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="input"
          />

          {/* Drag & Drop Upload */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer"
          >
            <p className="text-gray-500">Drag & Drop property images</p>
            <p className="text-sm text-gray-400 mb-2">or click below</p>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImages(e.target.files!)}
              className="text-sm"
            />
          </div>

          {/* Image Preview */}
          {preview.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {preview.map((src, i) => (
                <div key={i} className="relative group">
                  <img
                    src={src}
                    className="h-24 w-full object-cover rounded-lg shadow"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-gray-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg transition"
          >
            {loading ? "Uploading..." : "Create Property"}
          </button>
        </form>
      </div>

      {/* Reusable Tailwind Input Style */}
      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 0.65rem 0.9rem;
          outline: none;
          transition: 0.2s;
          background: transparent;
        }
        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }
      `}</style>
    </div>
  );
}
