'use client'

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function VendorRegister() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        gst: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Convert GST to uppercase automatically
        if (name === "gst") {
            setFormData({ ...formData, [name]: value.toUpperCase() });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Password match check
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }

        // GST validation (if entered)
        if (formData.gst) {
            const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
            if (!gstPattern.test(formData.gst)) {
                toast.error("Invalid GST number!");
                setLoading(false);
                return;
            }
        }

        try {
            const formPayload = new FormData();
            formPayload.append("name", formData.name);
            formPayload.append("email", formData.email);
            formPayload.append("phoneNumber", formData.phone);
            formPayload.append("address", formData.address);
            formPayload.append("gst", formData.gst);
            formPayload.append("password", formData.password);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/vendor/register`, {
                method: "POST",
                body: formPayload,
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Vendor registered successfully! Check your email for verification.");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    gst: "",
                    password: "",
                    confirmPassword: "",
                });
            } else {
                toast.error(data.error || "Something went wrong.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-6">
            <Toaster position="top-right" />

            {/* Hero Section */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-red-700 mb-2">Join MYSMME as a Vendor</h1>
                <p className="text-gray-600">Register your business and start reaching more customers</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl p-8">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>

                    {/* Vendor Name */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-700 font-medium">Vendor Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-700 font-medium">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 123 456 7890"
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            required
                        />
                    </div>

                    {/* GST / Tax ID */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-700 font-medium">GST / Tax ID</label>
                        <input
                            type="text"
                            name="gst"
                            value={formData.gst}
                            onChange={handleChange}
                            placeholder="15 Digit GST (Optional)"
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        />
                    </div>

                    {/* Address (full width) */}
                    <div className="flex flex-col md:col-span-2">
                        <label className="mb-1 text-gray-700 font-medium">Business Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Street, City, State, Zip"
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            rows={3}
                            required
                        ></textarea>
                    </div>


                    {/* Password */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-gray-700 font-medium">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            required
                        />
                    </div>

                    {/* Submit Button (full width) */}
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? "Submitting..." : "Submit Details"}
                        </button>
                    </div>

                    {/* Login Link */}
                    <div className="md:col-span-2 text-center text-gray-600">
                        Already registered? <a href="/auth/login" className="text-red-600 font-semibold hover:underline">Login</a>
                    </div>

                </form>
            </div>
        </div>
    );
}
