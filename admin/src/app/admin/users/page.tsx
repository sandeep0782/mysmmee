"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import Pagination from "@/components/Admin/Pagination"; // import your reusable Pagination

const ITEMS_PER_PAGE = 4;

const Page = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        credentials: "include",
      });

      if (!res.ok) {
        let errorMessage = "Failed to load users";
        try {
          const errData = await res.json();
          errorMessage = errData.message || errorMessage;
        } catch {
          // ignore parse errors
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();

      // Ensure users is an array
      const usersArray = Array.isArray(data) ? data : data.data || [];
      setUsers(usersArray);
    } catch (err: any) {
      toast.error(err.message || "Failed to load users");
      setUsers([]); // fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredData = Array.isArray(users)
    ? users.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <Card className="p-6 rounded-2xl shadow-lg bg-white">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              User Management
            </h1>
            <p className="text-sm text-gray-500">Manage your users easily</p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-sm font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 cursor-pointer">
            <Plus size={18} />
            Add User
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table */}
        {/* Table */}
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-[600px] w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created At</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr key="loading">
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr
                    key={item.id || item.email}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-4 font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-4 py-4 text-gray-600">{item.email}</td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
                        {item.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr key="no-results">
                  <td colSpan={4} className="text-center py-6 text-gray-400">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Card>
    </div>
  );
};

export default Page;
