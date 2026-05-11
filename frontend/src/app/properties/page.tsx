import { Suspense } from "react";

import PropertiesClient from "./PropertiesClient";

type Props = {
  searchParams: Promise<{
    keyword?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    listingType?: string;
    sort?: string;
  }>;
};

export default async function PropertiesPage({
  searchParams,
}: Props) {

  const params = await searchParams;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">

      <div className="max-w-7xl mx-auto mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Discover Properties
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Find your dream home
        </p>

      </div>

      <div className="max-w-7xl mx-auto">

        <Suspense fallback={<p>Loading...</p>}>
          <PropertiesClient
            searchParams={params}
          />
        </Suspense>

      </div>
    </main>
  );
}