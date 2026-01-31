"use client";

import React, { useState } from "react";

const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can integrate email sending logic or API
        alert("Thank you for contacting us!");
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className="min-h-screen py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-4">Contact Us</h1>
                <p className="text-gray-600 text-center mb-12">
                    Have questions or want to collaborate? Fill out the form below or reach us directly via email or phone.
                </p>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col justify-center space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Email</h2>
                            <p className="text-gray-700">
                                <a href="mailto:iamsjangid@gmail.com" className="text-primary underline">
                                    iamsjangid@gmail.com
                                </a>
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Phone</h2>
                            <p className="text-gray-700">+91 9650070010</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Address</h2>
                            <p className="text-gray-700">22, Sector-110 A, Gurgaon-Haryana-122017</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;
