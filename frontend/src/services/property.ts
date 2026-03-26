export const getAllProperties = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/property`,
    {
      method: "GET",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch properties");

  return res.json();
};
