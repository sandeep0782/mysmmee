"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface SelectOption {
    _id: string;
    name: string;
}

interface ProductForm {
    title: string;
    slug: string;
    subject: string;
    description: string;
    author: string;
    edition: string;
    category: string;
    brand: string;
    season: string;
    color: string;
    gender: string;
    condition: string;
    classType: string;
    price: number;
    finalPrice: number;
    shippingCharge: string;
    paymentMode: "UPI" | "Bank Account";
    upiId: string;
    bankAccountNumber: string;
    bankIFSC: string;
    bankName: string;
    images: File[];
}

// interface PageProps {
//     params: {
//         id: string;
//     };
// }
const initialFormState: ProductForm = {
    title: "",
    slug: "",
    subject: "",
    description: "",
    author: "",
    edition: "",
    category: "",
    brand: "",
    season: "",
    color: "",
    gender: "",
    condition: "",
    classType: "",
    price: 0,
    finalPrice: 0,
    shippingCharge: "",
    paymentMode: "UPI",
    upiId: "",
    bankAccountNumber: "",
    bankIFSC: "",
    bankName: "",
    images: []
};

const AddProductPage = ({ params }: { params: any }) => {
    const productId = params.id as string;

    const [form, setForm] = useState<ProductForm>(initialFormState);
    const [categories, setCategories] = useState<SelectOption[]>([]);
    const [brands, setBrands] = useState<SelectOption[]>([]);
    const [seasons, setSeasons] = useState<SelectOption[]>([]);
    const [colors, setColors] = useState<SelectOption[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    /* ================= FETCH SELECT OPTIONS ================= */
    const fetchOptions = async () => {
        try {
            const urls = [
                "http://localhost:8000/api/categories",
                "http://localhost:8000/api/brands",
                "http://localhost:8000/api/season",
                "http://localhost:8000/api/colors",
            ];

            const responses = await Promise.all(urls.map(url =>
                fetch(url, { credentials: "include" })
            ));

            responses.forEach((res, i) => {
                if (!res.ok) throw new Error(`Failed to fetch ${urls[i]}: ${res.status}`);
            });

            const [catData, brandData, seasonData, colorData] = await Promise.all(
                responses.map(res => res.json())
            );

            setCategories(catData.data || []);
            setBrands(brandData.data || []);
            setSeasons(seasonData.data || []);
            setColors(colorData.data || []);
        } catch (err: any) {
            toast.error("Failed to load select options");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    /* ================= FETCH EXISTING PRODUCT ================= */
    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:8000/api/products/${productId}`, {
                    credentials: "include",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to fetch product");

                // Populate form
                setForm({
                    ...initialFormState,
                    title: data.title,
                    slug: data.slug,
                    subject: data.subject,
                    description: data.description,
                    author: data.author,
                    edition: data.edition,
                    category: data.category,
                    brand: data.brand,
                    season: data.season,
                    color: data.color,
                    gender: data.gender,
                    condition: data.condition,
                    classType: data.classType,
                    price: data.price,
                    finalPrice: data.finalPrice,
                    shippingCharge: data.shippingCharge,
                    paymentMode: data.paymentMode,
                    upiId: data.paymentMode === "UPI" ? data.paymentDetails?.upiId : "",
                    bankAccountNumber: data.paymentMode === "Bank Account" ? data.paymentDetails?.bankDetails?.accountNumber : "",
                    bankIFSC: data.paymentMode === "Bank Account" ? data.paymentDetails?.bankDetails?.ifscCode : "",
                    bankName: data.paymentMode === "Bank Account" ? data.paymentDetails?.bankDetails?.bankName : "",
                    images: []
                });

                setExistingImages(data.images || []);
            } catch (err: any) {
                toast.error(err.message || "Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    /* ================= AUTO-GENERATE SLUG ================= */
    useEffect(() => {
        setForm(prev => ({
            ...prev,
            slug: prev.title.toLowerCase().trim().replace(/\s+/g, "-")
        }));
    }, [form.title]);

    /* ================= CLEANUP IMAGE PREVIEWS ================= */
    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    /* ================= HANDLE INPUT CHANGE ================= */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    /* ================= HANDLE FILE UPLOAD ================= */
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files);
        setForm(prev => ({ ...prev, images: filesArray }));

        const previews = filesArray.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    /* ================= HANDLE FORM SUBMIT ================= */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();

            const paymentDetails: any =
                form.paymentMode === "UPI"
                    ? { upiId: form.upiId }
                    : {
                        bankDetails: {
                            accountNumber: form.bankAccountNumber,
                            ifscCode: form.bankIFSC,
                            bankName: form.bankName
                        }
                    };

            Object.entries(form).forEach(([key, value]) => {
                if (key === "images") {
                    value.forEach((file: File) => formData.append("images", file));
                } else if (key === "price" || key === "finalPrice") {
                    formData.append(key, Number(value).toString());
                } else if (key !== "paymentMode") {
                    formData.append(key, value as any);
                }
            });

            formData.append("paymentMode", form.paymentMode);
            formData.append("paymentDetails", JSON.stringify(paymentDetails));

            const url = productId
                ? `http://localhost:8000/api/products/${productId}`
                : "http://localhost:8000/api/products";

            const method = productId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                body: formData,
                credentials: "include",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to save product");

            toast.success(productId ? "Product updated successfully" : "Product added successfully");
            router.push("/admin/product");
        } catch (err: any) {
            toast.error(err.message || "Failed to save product");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 rounded-xl">
            {/* Header */}
            <Card className="mb-6">
                <div className="p-4">
                    <h1 className="text-2xl font-semibold text-gray-800">{productId ? "Edit Product" : "Add Product"}</h1>
                </div>
            </Card>

            <Card className="p-6 w-full mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title, Author, Edition */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Author</label>
                            <input type="text" name="author" value={form.author} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Edition</label>
                            <input type="text" name="edition" value={form.edition} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Description & Subject */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <input type="text" name="subject" value={form.subject} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Category, Brand, Season, Color */}
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Season</label>
                            <select name="season" value={form.season} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Season</option>
                                {seasons.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Brand</label>
                            <select name="brand" value={form.brand} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Brand</option>
                                {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Color</label>
                            <select name="color" value={form.color} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Color</option>
                                {colors.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Gender, Condition, ClassType, Price, Final Price, Shipping */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Gender</label>
                            <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Unisex">Unisex</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Condition</label>
                            <select name="condition" value={form.condition} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Condition</option>
                                <option value="New">New</option>
                                <option value="Used">Used</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Class Type</label>
                            <select name="classType" value={form.classType} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Class Type</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Price</label>
                            <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Final Price</label>
                            <input type="number" name="finalPrice" value={form.finalPrice} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Shipping Charge</label>
                            <input type="text" name="shippingCharge" value={form.shippingCharge} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Payment Mode */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Payment Mode</label>
                            <select name="paymentMode" value={form.paymentMode} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="UPI">UPI</option>
                                <option value="Bank Account">Bank Account</option>
                            </select>
                        </div>

                        {form.paymentMode === "UPI" ? (
                            <div>
                                <label className="block text-sm font-medium mb-1">UPI ID</label>
                                <input type="text" name="upiId" value={form.upiId} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Bank Account Number</label>
                                    <input type="text" name="bankAccountNumber" value={form.bankAccountNumber} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">IFSC Code</label>
                                    <input type="text" name="bankIFSC" value={form.bankIFSC} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Bank Name</label>
                                    <input type="text" name="bankName" value={form.bankName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Images</label>
                        <input type="file" multiple onChange={handleFileChange} className="w-full" />
                        <div className="flex gap-2 mt-2">
                            {existingImages.map((src, i) => (
                                <img key={i} src={src} alt={`Existing ${i}`} className="w-20 h-20 object-cover rounded border" />
                            ))}
                            {imagePreviews.map((src, i) => (
                                <img key={i} src={src} alt={`Preview ${i}`} className="w-20 h-20 object-cover rounded border" />
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition cursor-pointer" disabled={loading}>
                        {loading ? "Saving..." : productId ? "Update Product" : "Add Product"}
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default AddProductPage;
