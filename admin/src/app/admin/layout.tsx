"use client";

import AdminNavbar from "@/components/Admnin/AdminNavbar";
import AdminSidebar from "@/components/Admnin/AdminSidebar";
import React, { useState, ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
  Navbar: React.FC;
  Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }>;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, Navbar, Sidebar }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="p-6 bg-white flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
