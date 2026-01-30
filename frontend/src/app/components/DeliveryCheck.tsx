import React, { useState } from "react";
import { deliverablePinsSet } from "@/constant/DeliveryPincode";
import toast from "react-hot-toast";

const DeliveryCheck = () => {
    const [pinCode, setPinCode] = useState("");
    const [deliveryMessage, setDeliveryMessage] = useState("");
    const [isDeliverable, setIsDeliverable] = useState<boolean | null>(null);

    const handleCheckDelivery = () => {
        // ✅ Check for 6 digits before proceeding
        if (!pinCode || pinCode.length !== 6) {
            toast.error("Please enter a valid 6-digit PIN code");
            setDeliveryMessage(""); // clear any previous message
            setIsDeliverable(null);
            return;
        }

        if (deliverablePinsSet.has(pinCode)) {
            setDeliveryMessage("Delivery available");
            setIsDeliverable(true);
        } else {
            setDeliveryMessage("Delivery not available");
            setIsDeliverable(false);
        }
    };

    return (
        <div className="w-full relative">
            <div className="relative w-1/2">
                {/* Icon on left */}
                {deliveryMessage && (
                    <span
                        className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg ${isDeliverable ? "text-green-600" : "text-red-500"
                            }`}
                    >
                        {isDeliverable ? "✅" : "❌"}
                    </span>
                )}

                {/* Input */}
                <input
                    type="text"
                    placeholder="Enter Pin Code"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    readOnly={!!deliveryMessage} // make read-only if result shown
                    className={`w-full pl-10 pr-24 py-2 border rounded-md focus:outline-none focus:ring-0 ${deliveryMessage ? "bg-gray-300" : "bg-white"
                        }`}
                />

                {/* Check / Change button */}
                <button
                    onClick={() => {
                        if (deliveryMessage) {
                            // Reset input and message
                            setPinCode("");
                            setDeliveryMessage("");
                            setIsDeliverable(null);
                        } else {
                            handleCheckDelivery(); // ✅ will show toast if less than 6 digits
                        }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 font-medium px-3 py-1 rounded cursor-pointer bg-red-100 text-primary hover:bg-red-200 transition"
                >
                    {deliveryMessage ? "Change" : "Check"}
                </button>
            </div>
        </div>
    );
};

export default DeliveryCheck;
