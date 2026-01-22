"use client";

import React, { useEffect, useState, useRef } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";

interface Brand {
    _id: string;
    name: string;
    description: string;
    logo?: string;
    isActive?: boolean;
}

const ITEMS_PER_PAGE = 5;

const BrandPage: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const [form, setForm] = useState({
        name: "",
        description: "",
        isActive: true,
        logo: null as File | null,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // ================= FETCH BRANDS =================
    const fetchBrands = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/brands`, {
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to load Brands");
            setBrands(data.data || []);
        } catch (err: any) {
            toast.error(err.message || "Failed to load Brands");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    // ================= ADD / UPDATE BRAND =================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error("Brand name is required");
            return;
        }

        try {
            setSubmitting(true);
            const url = editingId
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/brands/${editingId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/brands`;
            const method = editingId ? "PUT" : "POST";

            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("isActive", String(form.isActive));
            if (form.logo) formData.append("logo", form.logo);

            const res = await fetch(url, {
                method,
                credentials: "include",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to save Brand");

            toast.success(editingId ? "Brand updated successfully" : "Brand added successfully");
            handleCancelEdit();
            fetchBrands();
        } catch (err: any) {
            toast.error(err.message || "Failed to save Brand");
        } finally {
            setSubmitting(false);
        }
    };

    // ================= EDIT =================
    const handleEditClick = (brand: Brand) => {
        setEditingId(brand._id);
        setForm({
            name: brand.name,
            description: brand.description,
            isActive: brand.isActive ?? true,
            logo: null,
        });
        setLogoPreview(brand.logo || null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ name: "", description: "", isActive: true, logo: null });
        setLogoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ================= DELETE =================
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this Brand?")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/brands/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete Brand");

            toast.success("Brand deleted successfully");
            fetchBrands();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete Brand");
        }
    };

    // ================= HANDLE LOGO =================
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setForm({ ...form, logo: file });
        setLogoPreview(URL.createObjectURL(file));
    };

    // ================= PAGINATION =================
    const totalPages = Math.ceil(brands.length / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedData = brands.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {/* Header */}
            <Card className="mb-6">
                <div className="p-4">
                    <h1 className="text-2xl font-semibold text-gray-800">Brands</h1>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ===== FORM ===== */}
                <Card className="self-start">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingId ? "Edit Brand" : "Add New Brand"}
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
                                <label className="text-sm font-medium mb-1 block">Logo</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-dashed border-2 border-gray-300 p-4 rounded cursor-pointer text-center hover:border-blue-500 transition"
                                >
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Logo Preview"
                                            className="mx-auto w-24 h-24 object-contain rounded"
                                        />
                                    ) : (
                                        "Click or drag logo here"
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                />
                                <span className="text-sm">Active</span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`flex-1 py-2 rounded-lg transition font-medium ${submitting ? "bg-gray-400 text-gray-200" : "bg-blue-600 text-white hover:bg-blue-500"
                                        }`}
                                >
                                    {submitting ? "Saving..." : editingId ? "Update" : "Save Brand"}
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

                {/* ===== TABLE ===== */}
                <Card className="lg:col-span-2">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Brand List</h2>

                        {loading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 text-sm text-gray-600">
                                                <th className="p-3 text-left">Logo</th>
                                                <th className="p-3 text-left">Name</th>
                                                <th className="p-3 text-left">Description</th>
                                                <th className="p-3 text-left">Active</th>
                                                <th className="p-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedData.map((brand) => (
                                                <tr key={brand._id} className="border-t hover:bg-gray-50">
                                                    <td className="p-3">
                                                        {brand.logo ? (
                                                            <img
                                                                src={brand.logo}
                                                                alt={brand.name}
                                                                className="w-12 h-12 object-contain rounded"
                                                            />
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </td>
                                                    <td className="p-3 font-medium">{brand.name}</td>
                                                    <td className="p-3 text-gray-600">{brand.description}</td>
                                                    <td className="p-3">{brand.isActive ? "Yes" : "No"}</td>
                                                    <td className="p-3 text-right flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(brand)}
                                                            className="p-2 hover:bg-blue-50 rounded text-blue-600"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(brand._id)}
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
                                            className={`px-3 py-1 rounded text-sm font-medium ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
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

export default BrandPage;
