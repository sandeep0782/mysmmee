'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useGetCategoriesQuery, useGetProductsQuery } from "@/store/api";
import { BookDetails } from "@/types/type"; // Replace with your Product type
import BookLoader from "@/lib/BookLoader";

const ShopByCategory = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const { data: apiResponse = {}, isLoading } = useGetCategoriesQuery({});
    const [products, setProducts] = useState<BookDetails[]>([]); // Replace BookDetails with Product type

    useEffect(() => {
        if (apiResponse?.success) {
            setProducts(apiResponse.data.slice(0, 9));
        }
    }, [apiResponse]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + 3) % 3)
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % 3)
    }

    if (isLoading) return <BookLoader />;

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-left mb-12 uppercase tracking-widest">
                    Shop by <span className="text-primary ">Category</span>
                </h2>
                <div className="relative">
                    {products.length > 0 ? (
                        <>
                            <div className="overflow-hidden">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                >
                                    {[0, 1, 2].map((slideIndex) => (
                                        <div key={slideIndex} className="flex-none w-full">
                                            <div className="flex justify-center gap-6">
                                                {products.slice(slideIndex * 3, slideIndex * 3 + 3).map((product) => (
                                                    <Card
                                                        key={product._id}
                                                        className="w-40 h-40 rounded-full overflow-hidden flex flex-col items-center justify-center shadow-md"
                                                    >
                                                        <Link href={`/products/${product.slug || product._id}`} className="flex flex-col items-center justify-center">
                                                            <div className="relative w-24 h-24 mb-3">
                                                                <Image
                                                                    src={product.images[0] || "/placeholder.png"}
                                                                    alt={product.title}
                                                                    fill
                                                                    className="object-cover rounded-full"
                                                                />
                                                            </div>
                                                            <h3 className="text-center text-sm font-medium line-clamp-2">{product.title}</h3>
                                                        </Link>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Scroll Buttons */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>

                            {/* Dots Navigation */}
                            <div className="mt-8 flex justify-center space-x-2">
                                {[0, 1, 2].map((dot) => (
                                    <button
                                        key={dot}
                                        onClick={() => setCurrentSlide(dot)}
                                        className={`h-3 w-3 rounded-full ${currentSlide === dot ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-500">No products to display.</p>
                    )}
                </div>
            </div>
        </section>
    )
}

export default ShopByCategory