"use client";

import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";

interface ArticleTypeProps {
    _id: string;
    name: string;
    description: string;
    image?: string;
}

const ITEMS_PER_PAGE = 5;

const ArticleType: React.FC = () => {
    const [articleTypes, setArticleTypes] = useState<ArticleTypeProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const [form, setForm] = useState<{
        name: string;
        description: string;
        image?: File;
    }>({
        name: "",
        description: "",
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    /* ================= FETCH ArticleTypes ================= */
    const fetchArticleTypes = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articleTypes`, {
                credentials: "include", // send cookies automatically
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to load Article Types");
            setArticleTypes(data.data || []);
        } catch (err: any) {
            toast.error(err.message || "Failed to load Article Types");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticleTypes();
    }, []);

    /* ================= ADD / UPDATE ArticleType ================= */
    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (!form.name.trim()) {
    //         toast.error("Article Type name is required");
    //         return;
    //     }

    //     try {
    //         const url = editingId
    //             ? `${process.env.NEXT_PUBLIC_API_URL}/api/articleTypes/${editingId}`
    //             : `${process.env.NEXT_PUBLIC_API_URL}/api/articleTypes`;
    //         const method = editingId ? "PUT" : "POST";

    //         const formData = new FormData();
    //         formData.append("name", form.name);
    //         formData.append("description", form.description || "");
    //         if (form.image) formData.append("image", form.image);

    //         const res = await fetch(url, {
    //             method,
    //             credentials: "include", // cookie-based auth
    //             body: formData,
    //         });

    //         // const data = await res.json();
    //         const contentType = res.headers.get("content-type");

    //         let data: any;
    //         if (contentType && contentType.includes("application/json")) {
    //             data = await res.json();
    //         } else {
    //             const text = await res.text();
    //             console.error("Server returned HTML:", text);
    //             throw new Error("Server did not return JSON");
    //         }
    //         if (!res.ok) throw new Error(data.message || "Failed to save Article Type");

    //         toast.success(editingId ? "Article Type updated successfully" : "Article Type added successfully");

    //         setForm({ name: "", description: "" });
    //         setImagePreview(null);
    //         setEditingId(null);
    //         fetchArticleTypes();
    //     } catch (err: any) {
    //         toast.error(err.message || "Failed to save Article Type");
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error("Article Type name is required");
            return;
        }

        try {
            setSubmitting(true); // ✅ disable button
            const url = editingId
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/articleTypes/${editingId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/articleTypes`;
            const method = editingId ? "PUT" : "POST";

            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description || "");
            if (form.image) formData.append("image", form.image);

            const res = await fetch(url, {
                method,
                credentials: "include",
                body: formData,
            });

            const contentType = res.headers.get("content-type");
            let data: any;

            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.error("Server returned HTML:", text);
                throw new Error("Server did not return JSON");
            }

            if (!res.ok) throw new Error(data.message || "Failed to save Article Type");

            toast.success(editingId ? "Article Type updated successfully" : "Article Type added successfully");

            // Reset form
            handleCancelEdit();
            fetchArticleTypes();
        } catch (err: any) {
            toast.error(err.message || "Failed to save Article Type");
        } finally {
            setSubmitting(false); // ✅ enable button again
        }
    };

    /* ================= EDIT ================= */
    const handleEditClick = (article: ArticleTypeProps) => {
        setEditingId(article._id);
        setForm({
            name: article.name,
            description: article.description,
        });
        setImagePreview(article.image || null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ name: "", description: "" });
        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    /* ================= DELETE ================= */
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this Article Type?")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articleTypes/${id}`, {
                method: "DELETE",
                credentials: "include", // cookie auth
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete Article Type");

            toast.success("Article Type deleted successfully");
            fetchArticleTypes();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete Article Type");
        }
    };

    /* ================= HANDLE IMAGE UPLOAD ================= */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setForm({ ...form, image: file });
        setImagePreview(URL.createObjectURL(file));
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
                    <h1 className="text-2xl font-semibold text-gray-800">Article Types</h1>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ===== Add / Edit Form ===== */}
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

                            <div>
                                <label className="text-sm font-medium">Image</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-24 h-24 object-cover rounded mt-2"
                                    />
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`flex-1 py-2 rounded-lg transition font-medium ${submitting ? "bg-gray-400 text-gray-200" : "bg-blue-600 text-white hover:bg-blue-500"}`}
                                >
                                    {submitting ? "Saving..." : editingId ? "Update" : "Save"}
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

                {/* ===== Table ===== */}
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
                                                <th className="p-3 text-left">Image</th>
                                                <th className="p-3 text-left">Name</th>
                                                <th className="p-3 text-left">Description</th>
                                                <th className="p-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedData.map((cat) => (
                                                <tr key={cat._id} className="border-t hover:bg-gray-50">
                                                    <td className="p-3">
                                                        {cat.image ? (
                                                            <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded" />
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </td>
                                                    <td className="p-3 font-medium">{cat.name}</td>
                                                    <td className="p-3 text-gray-600">{cat.description}</td>
                                                    <td className="p-3 text-right flex justify-end gap-2">
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
