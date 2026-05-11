import { Suspense } from "react";

import PropertiesClient from "./properties/PropertiesClient";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome to the fastest home search destination
        </h1>

        <Suspense fallback={<p>Loading...</p>}>
          <PropertiesClient
            searchParams={{}}
          />
        </Suspense>

      </div>
    </main>
  );
}