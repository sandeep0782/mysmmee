"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useGetMenuQuery } from "@/store/api";
import { MenuCategory } from "@/types/type";

export default function MainMenu() {
    const { data, isLoading, error } = useGetMenuQuery();
    const menu = (data as any)?.data as MenuCategory[] | undefined;

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const closeTimeout = useRef<NodeJS.Timeout | null>(null);

    if (isLoading) return <p>Loading menu...</p>;
    if (error) return <p>Error loading menu</p>;

    const handleMouseEnter = (idx: number) => {
        if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
        }
        setOpenIndex(idx);
    };

    const handleMouseLeave = () => {
        closeTimeout.current = setTimeout(() => {
            setOpenIndex(null);
        }, 150); // 👈 delay prevents flicker
    };

    return (
        <nav>
            <div className="max-w-7xl mx-auto px-4">
                <ul className="flex space-x-6 py-4">
                    {menu?.map((category, idx) => {
                        const hasarticleTypes =
                            category.articleTypes && category.articleTypes.length > 0;

                        return (
                            <li key={category._id} className="relative">
                                <div
                                    onMouseEnter={() => handleMouseEnter(idx)}
                                    onMouseLeave={handleMouseLeave}
                                    className="relative"
                                >
                                    {/* Main Menu */}
                                    <Link
                                        href={`/products?category=${category.slug}`}
                                        className="flex items-center space-x-1 text-md text-gray-700 relative group uppercase font-bold"
                                    >
                                        <span>{category.name}</span>
                                        {/* <ChevronDown
                                            className={`w-4 h-4 transition-transform ${openIndex === idx ? "rotate-180" : ""
                                                }`}
                                        /> */}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full"></span>
                                    </Link>

                                    {/* Dropdown Panel */}
                                    <div
                                        className={`absolute left-0 top-full mt-3 w-[320px] min-h-[120px]
                    bg-pink-400 rounded-lg z-50 transition-all duration-200
                    ${openIndex === idx
                                                ? "opacity-100 visible translate-y-0"
                                                : "opacity-0 invisible translate-y-2"
                                            }`}
                                    >
                                        {hasarticleTypes ? (
                                            <ul>
                                                {category.articleTypes!.map((article) => (
                                                    <li
                                                        key={article._id}
                                                        className="px-4 py-2 hover:bg-pink-500"
                                                    >
                                                        <Link
                                                            href={`/products?category=${category.slug}&articleType=${article.slug}`}
                                                            className="block uppercase font-semibold text-gray-800"
                                                            onClick={() => setOpenIndex(null)} // ✅ Close dropdown on click

                                                        >
                                                            {article.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="p-4 uppercase text-gray-800">
                                                No items
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
