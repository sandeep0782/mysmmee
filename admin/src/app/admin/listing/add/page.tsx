"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Download, UploadCloud, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const AddListingPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [availableArticleTypes, setAvailableArticleTypes] = useState<any[]>([])
    const [selectedArticleType, setSelectedArticleType] = useState<string>('')

    const router = useRouter();

    // ===== Fetch available article types once on page load =====
    useEffect(() => {
        const fetchArticleTypes = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articleTypes`, {
                    method: 'GET',
                    credentials: 'include'
                })
                if (!res.ok) throw new Error('Failed to fetch article types')
                const data = await res.json()
                console.log("data", data)
                setAvailableArticleTypes(data.data || [])
            } catch (error) {
                console.error(error)
                toast.error('Error fetching article types')
            }
        }

        fetchArticleTypes()
    }, [])


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

    // ===== Download Excel Template from Backend =====
    const handleDownloadTemplate = async (articleTypeParam?: string) => {
        const type = articleTypeParam || selectedArticleType
        if (!type) {
            toast.error('Please select an article type')
            return
        }

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/listings/template/download?articleType=${type}`

            const res = await fetch(url, { method: 'GET', credentials: 'include' })
            if (!res.ok) {
                toast.error('Failed to download template')
                return
            }

            const blob = await res.blob()
            const downloadUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.setAttribute('download', `product-template-${type}.xlsx`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            toast.success('Template downloaded successfully!')
        } catch (error) {
            console.error(error)
            toast.error('Error downloading template')
        }
    }


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Card className="mb-6">
                <div className="p-4 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Import Products
                    </h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 text-sm cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        Template
                    </button>
                </div>
            </Card>
            {/* ===== Template Modal ===== */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-semibold mb-4">Select Article Type</h2>

                        <select
                            value={selectedArticleType}
                            onChange={(e) => setSelectedArticleType(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        >
                            <option value="">Select Article Type</option>
                            {availableArticleTypes.map((type: any) => (
                                <option key={type._id} value={type.name}>
                                    {type.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={!selectedArticleType}
                                onClick={() => {
                                    handleDownloadTemplate(selectedArticleType)
                                    setIsModalOpen(false)
                                }}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
