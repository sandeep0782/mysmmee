"use client";

import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import Link from "next/link";
import { Listing } from "@/types/types";

const ITEMS_PER_PAGE = 10;

const ListingPage: React.FC = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    /* ================= FETCH ================= */
    const fetchListings = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings`, {
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setListings(data.data || []);
        } catch (err: any) {
            toast.error(err.message || "Failed to load listings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    /* ================= POLLING ================= */
    useEffect(() => {
        const interval = setInterval(async () => {
            // check if there are pending listings
            const pendingListings = listings.filter((l) => l.status === "pending");
            if (pendingListings.length === 0) return;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings`, {
                    credentials: "include",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                // Update only the listings that changed
                setListings((prev) =>
                    prev.map((listing) => {
                        const updated = data.data.find((l: Listing) => l._id === listing._id);
                        return updated ? { ...listing, ...updated } : listing;
                    })
                );
            } catch (err: any) {
                console.error("Polling failed:", err.message);
            }
        }, 5000); // poll every 5 seconds

        return () => clearInterval(interval);
    }, [listings]);

    /* ================= DELETE ================= */
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this listing?")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");

            toast.success("Deleted successfully");
            fetchListings();
            setPage(1);
        } catch (err: any) {
            toast.error(err.message || "Delete failed");
            console.log(err);
        }
    };

    /* ================= DOWNLOAD ================= */
    const downloadFile = async (listingId: string, filename: string) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/listings/errors/${listingId}`,
                { credentials: "include" }
            );

            if (!res.ok) throw new Error("Failed to download file");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename; // use the filename for download
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Download failed");
        }
    };


    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(listings.length / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedData = listings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    /* ================= STATUS BADGE ================= */
    const getStatusBadge = (status?: Listing["status"]) => {
        switch (status) {
            case "pending":
                return <span className="px-2 py-1 rounded text-white text-xs bg-yellow-500">{status}</span>;
            case "processing":
                return <span className="px-2 py-1 rounded text-white text-xs bg-orange-500">{status}</span>;
            case "success":
                return <span className="px-2 py-1 rounded text-white text-xs bg-green-500">{status}</span>;
            case "partial":
                return <span className="px-2 py-1 rounded text-white text-xs bg-blue-500">{status}</span>;
            case "failed":
                return <span className="px-2 py-1 rounded text-white text-xs bg-red-500">{status}</span>;
            case "skipped":
                return <span className="px-2 py-1 rounded text-white text-xs bg-gray-500">{status}</span>;
            default:
                return <span className="px-2 py-1 rounded text-white text-xs bg-gray-400">{status || "-"}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <Card className="mb-6">
                <div className="p-4 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Listings</h1>
                    <Link
                        href="/admin/listing/add"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
                    >
                        <Plus className="w-4 h-4" />
                        Add Listing
                    </Link>
                </div>
            </Card>

            <Card>
                <div className="p-4">
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-600">
                                            {/* Existing columns */}
                                            <th className="p-3 text-left">Created At</th>
                                            {/* <th className="p-3 text-left">Filename</th> */}
                                            <th className="p-3 text-left">Original Name</th>
                                            {/* <th className="p-3 text-left">Path</th> */}
                                            <th className="p-3 text-left">Size (KB)</th>
                                            <th className="p-3 text-left">Uploaded By</th>
                                            <th className="p-3 text-left">Status</th>
                                            <th className="p-3 text-left">Total Rows</th>
                                            <th className="p-3 text-left">Valid</th>
                                            <th className="p-3 text-left">Skipped</th>
                                            <th className="p-3 text-left">Errors</th>
                                            <th className="p-3 text-left">Error File</th>
                                            <th className="p-3 text-left">Skipped File</th>

                                            {/* NEW: Bull job info */}
                                            <th className="p-3 text-left">Bull Job ID</th>
                                            <th className="p-3 text-left">Job Failed</th>
                                            <th className="p-3 text-left">Job Error</th>

                                            <th className="p-3 text-left">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {paginatedData.length === 0 ? (
                                            <tr>
                                                <td colSpan={17} className="p-4 text-center text-gray-500">
                                                    No listings found
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedData.map((listing) => (
                                                <tr key={listing._id} className="border-t hover:bg-gray-50">
                                                    {/* Existing columns */}
                                                    <td className="p-3">{new Date(listing.createdAt).toLocaleString()}</td>
                                                    {/* <td className="p-3">{listing.filename}</td> */}
                                                    <td className="p-3">{listing.originalName}</td>
                                                    {/* <td className="p-3 truncate max-w-[200px]">{listing.path}</td> */}
                                                    <td className="p-3">{(listing.size / 1024).toFixed(2)}</td>
                                                    <td className="p-3">{typeof listing.uploadedBy === "string" ? listing.uploadedBy : listing.uploadedBy?.name || "-"}</td>
                                                    <td className="p-3">{getStatusBadge(listing.status)}</td>
                                                    <td className="p-3">{listing.totalRows ?? "-"}</td>
                                                    <td className="p-3">{listing.validCount ?? "-"}</td>
                                                    <td className="p-3">{listing.skippedCount ?? "-"}</td>
                                                    <td className="p-3">{listing.errorCount ?? "-"}</td>
                                                    <td className="p-3">
                                                        {listing.errorFilePath ? (
                                                            <button
                                                                onClick={() => {
                                                                    const filename = listing.errorFilePath?.split("/").pop() || "errors.xlsx";
                                                                    downloadFile(listing._id, filename);
                                                                }}
                                                                className="text-blue-600 hover:underline cursor-pointer"
                                                            >
                                                                Download
                                                            </button>
                                                        ) : "-"}
                                                    </td>
                                                    <td className="p-3">
                                                        {listing.skippedFilePath ? (
                                                            <button
                                                                onClick={() => {
                                                                    // safely get the filename from path
                                                                    const filename = listing.skippedFilePath?.split("/").pop() || "skipped.xlsx";
                                                                    downloadFile(listing._id, filename);
                                                                }}
                                                                className="text-blue-600 hover:underline cursor-pointer"
                                                            >
                                                                Download
                                                            </button>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </td>


                                                    {/* NEW: Bull job info */}
                                                    <td className="p-3">{listing.bullJobId ?? "-"}</td>
                                                    <td className="p-3">{listing.bullJobFailed ? "Yes" : "No"}</td>
                                                    <td className="p-3">{listing.bullJobError ?? "-"}</td>

                                                    <td className="p-3 flex gap-2">
                                                        <button onClick={() => handleDelete(listing._id)} className="p-2 hover:bg-red-50 rounded text-red-600">
                                                            <Trash2 className="w-4 h-4 cursor-pointer" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center mt-6 gap-2">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`px-3 py-1 rounded text-sm font-medium transition ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
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

export default ListingPage;
