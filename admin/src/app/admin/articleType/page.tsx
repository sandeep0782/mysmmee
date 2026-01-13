"use client";

import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";

interface ArticleTypeProps {
    _id: string;
    name: string;
    description: string;
}

const ITEMS_PER_PAGE = 5;

const ArticleType: React.FC = () => {
    const [articleTypes, setArticleTypes] = useState<ArticleTypeProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    /* ================= FETCH articleTypes ================= */
    const fetcharticleTypes = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articleTypes`, {
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setArticleTypes(data.data || []);
        } catch (err: any) {
            toast.error(err.message || "Failed to load articleTypes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetcharticleTypes();
    }, []);

    /* ================= ADD / UPDATE Article Type ================= */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error("Article Type name is required");
            return;
        }

        try {
            const url = editingId
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/articleTypes/${editingId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/articleTypes`;
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success(editingId ? "Article Type updated successfully" : "Article Type added successfully");
            setForm({ name: "", description: "" });
            setEditingId(null);
            fetcharticleTypes();
        } catch (err: any) {
            toast.error(err.message || "Failed to save Article Type");
        }
    };

    const handleEditClick = (cat: ArticleTypeProps) => {
        setEditingId(cat._id);
        setForm({ name: cat.name, description: cat.description });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ name: "", description: "" });
    };

    /* ================= DELETE CATEGORY ================= */
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this Article Type?")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articleTypes/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success("Article Type deleted successfully");
            fetcharticleTypes();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete Article Type");
        }
    };

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(articleTypes.length / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedData = articleTypes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {/* ===== Header ===== */}
            <Card className="mb-6">
                <div className="p-4">
                    <h1 className="text-2xl font-semibold text-gray-800">Article Type</h1>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ===== Add / Edit Category Form ===== */}
                <Card className="self-start">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingId ? "Edit Article Type" : "Add New Article Type"}
                        </h2>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="text-sm font-medium">Name</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition font-medium"
                                >
                                    {editingId ? "Update" : "Save Category"}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </Card>

                {/* ===== Category Table ===== */}
                <Card className="lg:col-span-2">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Article Type List</h2>

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
                                                <th className="p-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedData.map((cat) => (
                                                <tr key={cat._id} className="border-t hover:bg-gray-50">
                                                    <td className="p-3 font-medium">{cat.name}</td>
                                                    <td className="p-3 text-gray-600">{cat.description}</td>
                                                    <td className="p-3">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEditClick(cat)}
                                                                className="p-2 hover:bg-blue-50 rounded text-blue-600"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(cat._id)}
                                                                className="p-2 hover:bg-red-50 rounded text-red-600"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-center mt-6 gap-2">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`px-3 py-1 rounded text-sm font-medium ${page === i + 1
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 hover:bg-gray-200"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ArticleType;
