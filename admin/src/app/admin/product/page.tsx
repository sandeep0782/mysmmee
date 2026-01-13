"use client";

import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import Link from "next/link";

interface Category {
    _id: string;
    title: string;
    description?: string;
    price?: string;
    finalPrice?: string;
}

const ITEMS_PER_PAGE = 10;

const CategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    /* ================= FETCH ================= */
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
                credentials: "include",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setCategories(data.data || []);
        } catch (err: any) {
            toast.error(err.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    /* ================= DELETE ================= */
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/seller/${id}`, // match backend route
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");

            toast.success("Deleted successfully");
            fetchCategories(); // refresh list
        } catch (err: any) {
            toast.error(err.message || "Delete failed");
            console.log(err);
        }
    };


    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedData = categories.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {/* ===== Header ===== */}
            <Card className="mb-6">
                <div className="p-4 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Product
                    </h1>

                    <Link
                        href="/admin/product/add"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Link>
                </div>
            </Card>

            {/* ===== Table ===== */}
            <Card>
                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">
                        Article Type List
                    </h2>

                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-sm text-gray-600">
                                            <th className="p-3 text-left">Name</th>
                                            <th className="p-3 text-left">Description</th>
                                            <th className="p-3 text-left">MRP</th>
                                            <th className="p-3 text-left">Final Price</th>
                                            <th className="p-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="p-4 text-center text-gray-500"
                                                >
                                                    No records found
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedData.map((cat) => (
                                                <tr
                                                    key={cat._id}
                                                    className="border-t hover:bg-gray-50"
                                                >
                                                    <td className="p-3 font-medium">
                                                        {cat.title}
                                                    </td>
                                                    <td className="p-3 text-gray-600">
                                                        {cat.description || "-"}
                                                    </td>
                                                    <td className="p-3 text-gray-600">
                                                        {cat.price || "-"}
                                                    </td>
                                                    <td className="p-3 text-gray-600">
                                                        {cat.finalPrice || "-"}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex justify-end gap-2">
                                                            <Link
                                                                href={`/admin/product/${cat._id}`}
                                                                className="p-2 hover:bg-blue-50 rounded text-blue-600"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Link>

                                                            <button
                                                                onClick={() => handleDelete(cat._id)}
                                                                className="p-2 hover:bg-red-50 rounded text-red-600"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* ===== Pagination ===== */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-6 gap-2">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`px-3 py-1 rounded text-sm font-medium transition ${page === i + 1
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 hover:bg-gray-200"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default CategoryPage;
