"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import Pagination from "@/components/Admnin/Pagination";
import CampaignStatus from "@/components/Admnin/CampaignStatus";

interface Product {
  _id: string;
  title: string;
  description?: string;
  price?: string;
  finalPrice?: string;
  images?: string[];
  videos?: string[];
}

interface Campaign {
  _id: string;
  product: string; // productId
  sentCount: number;
  totalUsers: number;
  status: "pending" | "sending" | "completed";
}

const ITEMS_PER_PAGE = 10;

const AdvertisePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Record<string, Campaign>>({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [sendingProducts, setSendingProducts] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [previewEmail, setPreviewEmail] = useState(""); // email input
  const [sendingPreview, setSendingPreview] = useState(false);

  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const openZoom = (img: string) => setZoomedImage(img);
  const closeZoom = () => setZoomedImage(null);

  // Helper to fetch and parse JSON safely
  const safeFetchJson = async (url: string, options?: RequestInit) => {
    try {
      const res = await fetch(url, options);
      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON response from ${url}`);
      }

      if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
      return data;
    } catch (err: any) {
      throw new Error(err?.message || "Network error");
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await safeFetchJson("http://localhost:8000/api/products", {
        credentials: "include",
      });
      setProducts(data.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch campaigns
  // const fetchCampaigns = async () => {
  //   try {
  //     const data = await safeFetchJson("http://localhost:8000/api/email-campaigns", {
  //       credentials: "include",
  //     });

  //     const campaignsMap: Record<string, Campaign> = {};
  //     (data.data || []).forEach((c: Campaign) => {
  //       campaignsMap[c.product] = c;
  //     });
  //     setCampaigns(campaignsMap);
  //   } catch (err: any) {
  //     toast.error(err.message || "Failed to load campaigns");
  //   }
  // };

  const fetchCampaigns = async () => {
    try {
      const data = await safeFetchJson("http://localhost:8000/api/email-campaigns", {
        credentials: "include",
      });

      const campaignsMap: Record<string, Campaign> = {};
      (data.data || []).forEach((c: Campaign) => {
        campaignsMap[c.product] = c;
      });

      // Merge with existing campaigns so we don't overwrite optimistic sending flags
      setCampaigns((prev) => ({
        ...prev,
        ...campaignsMap,
      }));
    } catch (err: any) {
      toast.error(err.message || "Failed to load campaigns");
    }
  };


  // Poll campaigns every 3 seconds
  useEffect(() => {
    fetchCampaigns(); // initial fetch
    const interval = setInterval(fetchCampaigns, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Send email for a product
  // const handleSendEmail = async (productId: string) => {
  //   try {
  //     setSendingProducts((prev) => [...prev, productId]);
  //     // Optimistic update
  //     setCampaigns((prev) => ({
  //       ...prev,
  //       [productId]: { ...prev[productId], status: "sending", sentCount: 0, totalUsers: prev[productId]?.totalUsers || 0 },
  //     }));

  //     const data = await safeFetchJson(
  //       `http://localhost:8000/api/email-campaigns/send-advertisement/${productId}`,
  //       { method: "POST", credentials: "include" }
  //     );

  //     toast.success("Advertisement email sent to all users!");
  //     setCampaigns((prev) => ({
  //       ...prev,
  //       [productId]: { ...data.data, product: productId },
  //     }));
  //   } catch (err: any) {
  //     toast.error(err.message || "Failed to send email");
  //   } finally {
  //     setSendingProducts((prev) => prev.filter((id) => id !== productId));
  //   }
  // };

  const handleSendEmail = async (productId: string) => {
    try {
      setSendingProducts((prev) => [...prev, productId]);

      // Optimistic update
      setCampaigns((prev) => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          status: "sending",
          sentCount: 0,
          totalUsers: prev[productId]?.totalUsers || 0,
        },
      }));

      // Trigger backend to start sending
      await safeFetchJson(
        `http://localhost:8000/api/email-campaigns/send-advertisement/${productId}`,
        { method: "POST", credentials: "include" }
      );

      toast.success("Advertisement email sending started!");

      // Poll backend every 2 seconds until completed
      const interval = setInterval(async () => {
        try {
          const data = await safeFetchJson("http://localhost:8000/api/email-campaigns", {
            credentials: "include",
          });
          const updatedCampaign = data.data.find((c: Campaign) => c.product === productId);

          if (updatedCampaign) {
            setCampaigns((prev) => ({
              ...prev,
              [productId]: updatedCampaign,
            }));

            if (updatedCampaign.status === "completed") {
              clearInterval(interval);
              setSendingProducts((prev) => prev.filter((id) => id !== productId));
              toast.success(`Campaign for ${updatedCampaign.product} completed!`);
            }
          }
        } catch {
          // ignore polling errors
        }
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to send email");
      setSendingProducts((prev) => prev.filter((id) => id !== productId));
    }
  };


  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedData = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="mb-6">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Product Advertisement</h1>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          {loadingProducts ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-sm text-gray-600">
                      <th scope="col" className="p-3 text-left">S.No.</th>
                      <th scope="col" className="p-3 text-left">Image</th>
                      <th scope="col" className="p-3 text-left">Name</th>
                      <th scope="col" className="p-3 text-left">Description</th>
                      <th scope="col" className="p-3 text-left">MRP</th>
                      <th scope="col" className="p-3 text-left">Price</th>
                      <th scope="col" className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-gray-500">
                          No products found
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((product, index) => {
                        const campaign = campaigns[product._id];
                        const isSending = sendingProducts.includes(product._id);
                        return (
                          <tr key={product._id} className="border-t hover:bg-gray-50">
                            <td className="p-3 text-gray-600">{startIndex + index + 1}</td>
                            <td className="p-3 text-gray-600">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="h-12 w-12 object-cover rounded cursor-pointer"
                                  onClick={() => openZoom(product.images![0])}
                                />
                              ) : "-"}
                            </td>
                            <td className="p-3 font-medium">{product.title}</td>
                            <td className="p-3 text-gray-600">{product.description || "-"}</td>
                            <td className="p-3 text-gray-600">{product.price || "-"}</td>
                            <td className="p-3 text-gray-600">{product.finalPrice || "-"}</td>
                            <td className="p-3 flex justify-center gap-2">
                              <button
                                disabled={campaign?.status === "completed" || isSending}
                                onClick={() => handleSendEmail(product._id)}
                                className={`px-4 py-1 rounded transition ${campaign?.status === "completed"
                                    ? "bg-red-500 text-white cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                                  }`}
                              >
                                <CampaignStatus campaign={campaign} isSending={isSending} />
                              </button>

                              <button
                                onClick={() => {
                                  setPreviewProduct(product);
                                  setPreviewEmail(""); // reset email input
                                }}
                                className="bg-gray-600 text-white px-4 py-1 rounded hover:bg-gray-500 transition cursor-pointer"
                              >
                                Preview
                              </button>

                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </>
          )}
        </div>
      </Card>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeZoom} // clicking outside closes modal
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={closeZoom}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-80 transition"
            >
              ×
            </button>
            <img
              src={zoomedImage}
              className="max-h-[80vh] max-w-[80vw] rounded shadow-lg"
              alt="Zoomed"
            />
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
          onClick={() => setPreviewProduct(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full p-6 relative overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewProduct(null)}
              className="absolute top-2 right-2 text-black bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition"
            >
              ×
            </button>

            {/* Email input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Send to email:
              </label>
              <input
                type="email"
                placeholder="example@example.com"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={previewEmail}
                onChange={(e) => setPreviewEmail(e.target.value)}
              />
            </div>

            {/* Send button */}
            <button
              onClick={async () => {
                if (!previewEmail) {
                  toast.error("Please enter an email address");
                  return;
                }
                try {
                  setSendingPreview(true);
                  const res = await fetch(
                    `http://localhost:8000/api/email-campaigns/test-template/${previewProduct._id}`,
                    {
                      method: "POST",
                      credentials: "include",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: previewEmail }),
                    }
                  );
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message || "Failed to send preview");
                  toast.success("Preview email sent successfully!");
                  setPreviewProduct(null);
                } catch (err: any) {
                  toast.error(err.message || "Failed to send preview");
                } finally {
                  setSendingPreview(false);
                }
              }}
              className={`px-4 py-2 rounded text-white ${sendingPreview ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
                }`}
              disabled={sendingPreview}
            >
              {sendingPreview ? "Sending..." : "Send Preview"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdvertisePage;


// ssh root@72.61.115.113