// app/properties/page.tsx

import PropertiesClient from "./PropertiesClient";

type Props = {
  searchParams: Promise<{
    keyword?: string;
    city?: string;
    locality?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    listingType?: string;
    sort?: string;
    propertyType?: string;
    seller?: string;
    bhkType?: string;
    plotType?: string;
    furnishing?: string;
    shopType?: string;
  }>;
};

export default async function PropertiesPage({
  searchParams,
}: Props) {

  const params =
    await searchParams;

  const query =
    new URLSearchParams();

  if (params.keyword) {
    query.append(
      "keyword",
      params.keyword
    );
  }

  if (params.location) {
    query.append(
      "location",
      params.location
    );
  }

  if (params.city) {
  query.append(
    "city",
    params.city
  );
}


if (params.locality) {
  query.append(
    "locality",
    params.locality
  );
}
if (params.plotType) {
  query.append(
    "plotType",
    params.plotType
  );
}
if (params.bhkType) {
  query.append(
    "bhkType",
    params.bhkType
  );
}

if (params.furnishing) {
  query.append(
    "furnishing",
    params.furnishing
  );
}

if (params.shopType) {
  query.append(
    "shopType",
    params.shopType
  );
}
  if (params.propertyType) {
    query.append(
      "propertyType",
      params.propertyType
    );
  }

  if (params.minPrice) {
    query.append(
      "minPrice",
      params.minPrice
    );
  }

  if (params.maxPrice) {
    query.append(
      "maxPrice",
      params.maxPrice
    );
  }

  if (params.listingType) {
    query.append(
      "listingType",
      params.listingType
    );
  }

  // ✅ SELLER
  if (params.seller) {
    query.append(
      "seller",
      params.seller
    );
  }

  if (params.sort) {
    query.append(
      "sort",
      params.sort
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/property?${query.toString()}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  const data =
    await res.json();

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

        <PropertiesClient
          initialProperties={
            data.properties || []
          }
            totalProperties={
    data.total || 0
  }
          searchParams={params}
        />

      </div>

    </main>
  );
}