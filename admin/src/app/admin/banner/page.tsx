"use client";

import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";

interface Banner {
    _id: string;
    title?: string;
    subtitle?: string;
    imageUrl: string;
    link?: string;
    position?: number;
    isActive?: boolean;
}

const ITEMS_PER_PAGE = 5;

const BannerPage: React.FC = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [page, setPage] = useState(1);

    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        link: "",
        position: 0,
        isActive: true,
        image: null as File | null,
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    /* ================= FETCH BANNERS ================= */
    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`, {
                credentials: "include",
            });
            const data = await res.json();
            setBanners(Array.isArray(data) ? data : data.data || []);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to load banners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    /* ================= ADD / UPDATE BANNER ================= */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.image && !editingId) {
            toast.error("Banner image is required");
            return;
        }

        try {
            setFormLoading(true);

            const url = editingId
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/banners/${editingId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/banners`;
            const method = editingId ? "PUT" : "POST";

            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("subtitle", form.subtitle);
            formData.append("link", form.link);
            formData.append("position", String(form.position));
            formData.append("isActive", String(form.isActive));
            if (form.image) formData.append("image", form.image);

            const res = await fetch(url, {
                method,
                credentials: "include",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Failed to save banner");

            toast.success(editingId ? "Banner updated" : "Banner added");
            setForm({ title: "", subtitle: "", link: "", position: 0, isActive: true, image: null });
            setEditingId(null);
            fetchBanners();
        } catch (err: any) {
            toast.error(err.message || "Failed to save banner");
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditClick = (banner: Banner) => {
        setEditingId(banner._id);
        setForm({
            title: banner.title || "",
            subtitle: banner.subtitle || "",
            link: banner.link || "",
            position: banner.position || 0,
            isActive: banner.isActive ?? true,
            image: null,
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ title: "", subtitle: "", link: "", position: 0, isActive: true, image: null });
    };

    /* ================= DELETE BANNER ================= */
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success("Banner deleted successfully");
            fetchBanners();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete banner");
        }
    };

    /* ================= TOGGLE ACTIVE ================= */
    const handleToggleActive = async (banner: Banner) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/banners/${banner._id}/toggle-active`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update banner");

            // Update state locally
            setBanners((prev) =>
                prev.map((b) => (b._id === banner._id ? { ...b, isActive: !b.isActive } : b))
            );

            toast.success(`Banner ${banner.isActive ? "deactivated" : "activated"}`);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to update banner");
        }
    };

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(banners.length / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedData = banners.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {/* ===== Header ===== */}
            <Card className="mb-6">
                <div className="p-4">
                    <h1 className="text-2xl font-semibold text-gray-800">Banners</h1>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ===== Add / Edit Banner Form ===== */}
                <Card className="self-start">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingId ? "Edit Banner" : "Add New Banner"}
                        </h2>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="text-sm font-medium">Title</label>
                                <input
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Subtitle</label>
                                <input
                                    value={form.subtitle}
                                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Link</label>
                                <input
                                    value={form.link}
                                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                                    placeholder="/sale"
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Position</label>
                                <input
                                    type="number"
                                    value={form.position}
                                    onChange={(e) => setForm({ ...form, position: Number(e.target.value) })}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Banner Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                    id="isActive"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium">
                                    Active
                                </label>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className={`flex-1 py-2 rounded-lg font-medium transition ${formLoading
                                        ? "bg-blue-300 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-500"
                                        }`}
                                    disabled={formLoading}
                                >
                                    {formLoading ? "Processing..." : editingId ? "Update" : "Save Banner"}
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

                {/* ===== Banner Table ===== */}
                <Card className="lg:col-span-2">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Banner List</h2>

                        {loading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 text-sm text-gray-600">
                                                <th className="p-3 text-left">Title</th>
                                                <th className="p-3 text-left">Subtitle</th>
                                                <th className="p-3 text-left">Position</th>
                                                <th className="p-3 text-left">Active</th>
                                                <th className="p-3 text-left">Image</th>
                                                <th className="p-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedData.map((banner) => (
                                                <tr key={banner._id} className="border-t hover:bg-gray-50">
                                                    <td className="p-3 font-medium">{banner.title || "-"}</td>
                                                    <td className="p-3 text-gray-600">{banner.subtitle || "-"}</td>
                                                    <td className="p-3">{banner.position || 0}</td>

                                                    {/* Active Toggle */}
                                                    <td className="p-3">
                                                        <button
                                                            onClick={() => handleToggleActive(banner)}
                                                            className={`px-3 py-1 rounded-full text-sm font-medium transition
                                ${banner.isActive ? "bg-green-500 text-white" : "bg-gray-300 text-gray-800"}
                                hover:brightness-90
                              `}
                                                        >
                                                            {banner.isActive ? "Active" : "Inactive"}
                                                        </button>
                                                    </td>

                                                    <td className="p-3">
                                                        <img
                                                            src={banner.imageUrl}
                                                            alt="banner"
                                                            className="w-32 h-16 object-cover rounded"
                                                        />
                                                    </td>
                                                    <td className="p-3 text-right flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(banner)}
                                                            className="p-2 hover:bg-blue-50 rounded text-blue-600"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(banner._id)}
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

export default BannerPage;
