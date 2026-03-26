import Image from "next/image";

export function PropertyCard({ property }: any) {  
  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <Image
  src={property.images?.[0] || "/no-image.png"}
  alt={property.title}
  width={500}
  height={300}
  className="w-full h-48 object-cover"
/>

      <div className="p-3">
        <h2 className="font-semibold">{property.title}</h2>
        <p className="text-gray-600">₹ {property.price}</p>

        {property.isSold && (
          <span className="text-sm text-green-600 font-semibold">
            Sold
          </span>
        )}
      </div>
    </div>
  );
}
