// app/properties/[id]/page.tsx

import PropertyDetailsClient from "./PropertyDetailsClient";

type Property = {
  _id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  images: string[];
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const revalidate = 120;

export default async function PropertyPage({
  params,
}: Props) {

  const { id } = await params;

  const [propertyRes, similarRes] =
    await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/property/${id}`,
        {
          next: {
            revalidate: 120,
          },
        }
      ),

      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/property/similar/${id}`,
        {
          next: {
            revalidate: 120,
          },
        }
      ),
    ]);

  if (!propertyRes.ok) {
    return (
      <div className="p-10 text-center text-gray-500">
        Property not found
      </div>
    );
  }

  const property: Property =
    await propertyRes.json();

  const similar: Property[] =
    await similarRes.json();

  return (
    <PropertyDetailsClient
      property={property}
      similar={similar || []}
    />
  );
}