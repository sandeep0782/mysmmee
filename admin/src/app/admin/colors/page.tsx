"use client";

import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";

interface Color {
    _id: string;
    name: string;
    hexCode?: string;
    isActive?: boolean;
}

const ITEMS_PER_PAGE = 5;

const ColorPage: React.FC = () => {
    const [colors, setColors] = useState<Color[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const [form, setForm] = useState({
        name: "",
        hexCode: "",
        isActive: true,
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    /* ================= FETCH COLORS ================= */
    const fetchColors = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8000/api/colors", {
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setColors(data.data || []);
        } catch (err: any) {
            toast.error(err.message || "Failed to load colors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColors();
    }, []);

    /* ================= ADD / UPDATE COLOR ================= */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error("Color name is required");
            return;
        }

        try {
            const url = editingId
                ? `http://localhost:8000/api/colors/${editingId}`
                : "http://localhost:8000/api/colors";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success(editingId ? "Color updated successfully" : "Color added successfully");
            setForm({ name: "", hexCode: "", isActive: true });
            setEditingId(null);
            fetchColors();
        } catch (err: any) {
            toast.error(err.message || "Failed to save color");
        }
    };

    const handleEditClick = (color: Color) => {
        setEditingId(color._id);
        setForm({
            name: color.name,
            hexCode: color.hexCode || "",
            isActive: color.isActive ?? true,
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ name: "", hexCode: "", isActive: true });
    };

    /* ================= DELETE COLOR ================= */
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this color?")) return;

        try {
            const res = await fetch(`http://localhost:8000/api/colors/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success("Color deleted successfully");
            fetchColors();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete color");
        }
    };

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(colors.length / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedData = colors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {/* ===== Header ===== */}
            <Card className="mb-6">
                <div className="p-4">
                    <h1 className="text-2xl font-semibold text-gray-800">Colors</h1>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ===== Add / Edit Color Form ===== */}
                <Card className="self-start">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingId ? "Edit Color" : "Add New Color"}
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
                                <label className="text-sm font-medium">Hex Code</label>
                                <input
                                    value={form.hexCode}
                                    onChange={(e) => setForm({ ...form, hexCode: e.target.value })}
                                    placeholder="#FFFFFF"
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
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition font-medium"
                                >
                                    {editingId ? "Update" : "Save Color"}
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

                {/* ===== Color Table ===== */}
                <Card className="lg:col-span-2">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Color List</h2>

                        {loading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 text-sm text-gray-600">
                                                <th className="p-3 text-left">Name</th>
                                                <th className="p-3 text-left">Hex Code</th>
                                                <th className="p-3 text-left">Active</th>
                                                <th className="p-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedData.map((color) => (
                                                <tr key={color._id} className="border-t hover:bg-gray-50">
                                                    <td className="p-3 font-medium">{color.name}</td>
                                                    <td className="p-3 text-gray-600 flex items-center gap-2">
                                                        <span
                                                            className="inline-block w-6 h-6 rounded border"
                                                            style={{ backgroundColor: color.hexCode || "#ffffff" }}
                                                        ></span>
                                                        {color.hexCode || "-"}
                                                    </td>

                                                    <td className="p-3">{color.isActive ? "Yes" : "No"}</td>
                                                    <td className="p-3 text-right flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(color)}
                                                            className="p-2 hover:bg-blue-50 rounded text-blue-600"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(color._id)}
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

export default ColorPage;
