"use client";

import React, { useState, type ReactNode } from "react";
import UserNavbar from "@/components/User/UserNavbar";
import UserSidebar from "@/components/User/UserSidebar";

export default function UserLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <UserSidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Navbar */}
        <UserNavbar />

        {/* Page Content */}
        <main className="flex-1 bg-white p-6">{children}</main>
      </div>
    </div>
  );
}
