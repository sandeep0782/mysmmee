"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
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
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        setOpenIndex(idx);
    };

    const handleMouseLeave = () => {
        closeTimeout.current = setTimeout(() => {
            setOpenIndex(null);
        }, 150);
    };

    // Define underline colors for categories
    const underlineColors = ["bg-pink-500", "bg-green-500", "bg-blue-500", "bg-yellow-500"];

    return (
        <nav>
            <div className="max-w-7xl mx-auto px-4">
                <ul className="flex space-x-6 py-4 relative">
                    {menu?.map((category, idx) => {
                        const hasarticleTypes =
                            category.articleTypes && category.articleTypes.length > 0;
                        const underlineColor = underlineColors[idx % underlineColors.length];

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
                                        className="flex items-center space-x-1  text-gray-700 relative group uppercase "
                                    >
                                        <span>{category.name}</span>
                                        {/* Underline */}
                                        <span
                                            className={`absolute left-0 bottom-[-30px] h-1 rounded w-full transition-all duration-200 ${underlineColor} ${openIndex === idx ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                                }`}
                                        />

                                    </Link>

                                    {/* Dropdown Panel */}
                                    <div
                                        className={`absolute left-0 top-full mt-9 w-[320px] min-h-[120px] bg-white rounded-lg z-50 transition-all duration-200 shadow-lg
                    ${openIndex === idx ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"}`}
                                    >
                                        {hasarticleTypes ? (
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2">
                                                {category.articleTypes!.map((article) => (
                                                    <li key={article._id} className="px-2 py-1">
                                                        <Link
                                                            href={`/products?category=${category.slug}&articleType=${article.slug}`}
                                                            className="block uppercase font-normal text-gray-800 hover:font-bold transition-all duration-150"
                                                            onClick={() => setOpenIndex(null)} // Close dropdown on click
                                                        >
                                                            {article.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="p-4 uppercase text-gray-800">No items</div>
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
