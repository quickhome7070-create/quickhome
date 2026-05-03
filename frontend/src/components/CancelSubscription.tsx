"use client";

interface Props {
  subscriptionId: string;
}

export default function CancelSubscription({ subscriptionId }: Props) {
  const cancel = async () => {
    const res = await fetch("/api/razorpay/subscription/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ subscriptionId }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Subscription Cancelled");
      window.location.reload();
    }
  };

  return (
    <button
      onClick={cancel}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
    >
      Cancel Subscription
    </button>
  );
}
