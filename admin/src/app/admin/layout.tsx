"use client";

import React, { useState, type ReactNode } from "react";
import AdminNavbar from "@/components/Admnin/AdminNavbar";
import AdminSidebar from "@/components/Admnin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="flex-1 bg-white p-6">{children}</main>
      </div>
    </div>
  );
}
