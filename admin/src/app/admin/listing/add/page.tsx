"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Download, UploadCloud, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const AddListingPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // ===== File Selection =====
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // ===== Upload Excel =====
    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select an Excel file to upload");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/upload`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Upload failed");
                return;
            }

            toast.success("Excel uploaded successfully!");
            setFile(null);
            router.push("/admin/listing"); // Redirect to listing page

        } catch (err) {
            console.error(err);
            toast.error("Network error while uploading Excel");
        } finally {
            setLoading(false);
        }
    };

    // ===== Download Template =====
    const handleDownloadTemplate = () => {
        const headers = [
            "Title", "Description", "Fabric", "Color", "Pattern", "Print Type",
            "Price", "SKU", "Brand", "Status"
        ];

        const csvContent = [headers.join(","), ""].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "listing_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Card className="mb-6">
                <div className="p-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">Listings</h1>

                    <button
                        onClick={handleDownloadTemplate}
                        className="flex items-center gap-2 px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        Template
                    </button>
                </div>
            </Card>

            <Card className=" mx-auto p-6 shadow-md">
                <h1 className="text-xl font-semibold text-gray-800 mb-6">
                    Select Excel File
                </h1>

                {/* File Upload */}
                <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                >
                    <UploadCloud className="w-12 h-12 text-blue-600 mb-4" />
                    <p className="text-gray-700 font-medium">Click to upload or drag & drop</p>
                    <p className="text-sm text-gray-500 mt-1">XLSX, XLS (max 10MB)</p>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".xlsx,.xls"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>

                {/* Selected File */}
                {file && (
                    <div className="mt-4 flex items-center justify-between bg-white border rounded-lg p-3 shadow-sm">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-600 transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Buttons */}
                <div className="mt-6 flex gap-4">


                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition cursor-pointer"
                    >
                        {loading ? "Uploading..." : "Upload & Submit"}
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default AddListingPage;
