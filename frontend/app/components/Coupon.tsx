"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Coupon() {
  const [status, setStatus] = useState("");
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Restore Countdown on Refresh
  useEffect(() => {
    const savedCooldownEndTime = localStorage.getItem("cooldownEndTime");

    if (savedCooldownEndTime) {
      const remainingTime = Math.ceil(
        (parseInt(savedCooldownEndTime, 10) - Date.now()) / 1000
      );

      if (remainingTime > 0) {
        setTimeRemaining(remainingTime); // Start countdown instantly
      }
    }
  }, []);

  // Countdown Timer for Real-time Update
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => (prev && prev > 1 ? prev - 1 : 0));

        if (timeRemaining <= 1) {
          setStatus("🎯 Now you can avail another coupon!");
          localStorage.removeItem("cooldownEndTime");
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const API = process.env.NEXT_API_PUBLIC_URL || "http://localhost:8000";

  // Claim Coupon Handler
  const claimCoupon = async () => {
    const res = await fetch(`${API}/api/coupons/claim`, {
      method: "POST",
      credentials: "include", // Ensures session-based identification
    });

    const data = await res.json();

    if (res.status === 200) {
      toast.success(data.message);
      setStatus(`Coupon claimed successfully! Valid for ${data.validFor}`);

      const cooldownEndTime = Date.now() + 2 * 60 * 1000; // 2-minute cooldown
      setTimeRemaining(120); // Start countdown instantly
      localStorage.setItem("cooldownEndTime", cooldownEndTime.toString());
    } else if (res.status === 403 && data.message.includes("Can't claim")) {
      const timeLeft = parseInt(data.message.match(/(\d+)/)?.[0] || "0", 10);
      const remainingSeconds = timeLeft * 60;
      setTimeRemaining(remainingSeconds);
      localStorage.setItem(
        "cooldownEndTime",
        (Date.now() + remainingSeconds * 1000).toString()
      );
      toast.error(data.message);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600 p-4">
      <div
        className="bg-white p-6 rounded-2xl shadow-2xl text-center w-full"
        style={{
          maxWidth: "600px", // Default for larger screens
          width: "90%", // Ensures responsiveness
        }}
      >
        <h1 className="text-3xl font-bold text-black mb-6">
          🎁 Coupon Distribution
        </h1>

        <div className="flex justify-center mb-6">
          <button
            className="px-5 py-2 cursor-pointer rounded-lg transition shadow-md bg-blue-500 text-white font-bold hover:bg-blue-600 disabled:bg-gray-400"
            onClick={claimCoupon}
            disabled={timeRemaining !== null && timeRemaining > 0} // Disable button during cooldown
          >
            Claim Coupon
          </button>
        </div>

        <div className="overflow-hidden whitespace-nowrap bg-yellow-100 p-2 rounded-md mb-4">
          <div className="animate-marquee text-yellow-700 font-medium flex gap-8">
            {timeRemaining !== null && timeRemaining > 0 ? (
              <span>
                ⏳ Next Coupon Will Be Available In:{" "}
                {Math.floor(timeRemaining / 60)}:
                {String(timeRemaining % 60).padStart(2, "0")} minutes
              </span>
            ) : (
              <span>🎯 Now you can avail another coupon!</span>
            )}
          </div>
        </div>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { background: "#333", color: "#fff" },
          }}
        />
      </div>

      <style>
        {`
          .animate-marquee {
            display: inline-flex;
            animation: marquee 12s linear infinite;
          }

          @keyframes marquee {
            from { transform: translateX(100%); }
            to { transform: translateX(-100%); }
          }
        `}
      </style>
    </div>
  );
}
