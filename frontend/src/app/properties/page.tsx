// app/properties/page.tsx

import PropertiesClient from "./PropertiesClient";



export default function PropertiesPage({
  searchParams,
}: {
  searchParams: {
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    listingType?: string;
    sort?: string;
  };
}) {
  return (
    <PropertiesClient
      searchParams={searchParams}
    />
  );
}