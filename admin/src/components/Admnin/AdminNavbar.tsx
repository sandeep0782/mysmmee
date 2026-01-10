"use client";

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";

const AdminNavbar: React.FC = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/auth/logout", {
                method: "GET",
                credentials: "include",
            });

            const result = await res.json();

            if (res.ok) {
                toast.success(result.message || "Logged out successfully");
                router.push("/auth/login");
            } else {
                toast.error(result.message || "Logout failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Internal server error");
        }
    };

    return (
        <div className="flex items-center justify-between bg-white h-16 px-6 border-b shadow-sm">
            {/* Brand / Logo */}
            <div className="flex items-center space-x-2">
                {/* <img
          src="/images/logo.png"
          alt="MYSMME Logo"
          className="h-10 w-10 rounded-full"
        /> */}
                {/* <span className="text-xl font-bold text-gray-800">MYSMME</span> */}
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded-lg transition">
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                        A
                    </div>
                    {/* <span className="font-medium text-gray-700">Admin</span> */}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-44 bg-white border rounded-lg shadow-md py-1"
                >
                    <DropdownMenuItem className="hover:bg-gray-100 rounded-md flex items-center px-3 py-2">
                        <Settings className="w-4 h-4 mr-2 text-gray-600" />
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="hover:bg-red-50 rounded-md flex items-center px-3 py-2 text-red-600 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4 mr-2 " />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default AdminNavbar;
