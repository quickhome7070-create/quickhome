// app/page.tsx

import PropertiesClient from "./properties/PropertiesClient";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 py-8">

        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
          Welcome to the fastest home search destination.
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Find your dream property easily
        </p>

        <PropertiesClient searchParams={{}} />

      </div>
    </div>
  );
}