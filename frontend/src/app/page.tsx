// app/page.tsx

import PropertiesClient from "./properties/PropertiesClient";

async function getProperties() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/property`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  const data = await res.json();

  return {
    properties: data.properties || [],
    total: data.total || 0,
  };
}

export default async function HomePage() {

const { properties, total } = await getProperties();

  return (
    <main className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome to the fastest home search destination
        </h1>

        <PropertiesClient
  initialProperties={properties}
  totalProperties={total}

  searchParams={{}}
/>

      </div>
    </main>
  );
}