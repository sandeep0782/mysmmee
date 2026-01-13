"use client";

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page: React.FC = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                method: "GET",
                credentials: "include", // important to clear cookies
            });

            const result = await res.json();

            if (res.ok) {
                toast.success(result.message || "Logged out successfully");
                router.push("/auth/login"); // redirect to login page
            } else {
                toast.error(result.message || "Logout failed");
            }
        } catch (err) {
            console.log(err)
            toast.error("Internal server error");
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
            >
                Logout
            </button>
        </div>
    );
};

export default Page;
