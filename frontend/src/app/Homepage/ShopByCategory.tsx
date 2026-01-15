"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGetArticleTypesQuery, useGetCategoriesQuery } from "@/store/api";
import BookLoader from "@/lib/BookLoader";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

const ITEMS_PER_SLIDE = 5;

const ShopByCategory = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: apiResponse, isLoading } = useGetArticleTypesQuery({});
  const [categories, setCategories] = useState<Category[]>([]);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    if (apiResponse?.data?.length) {
      setCategories(apiResponse.data);
    }
  }, [apiResponse]);

  const totalSlides = Math.ceil(categories.length / ITEMS_PER_SLIDE);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (totalSlides <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  if (isLoading) return <BookLoader />;

  if (!categories.length) {
    return (
      <p className="text-center text-gray-500 py-10">
        No categories available
      </p>
    );
  }

  return (
    <section className="py-16 bg-red-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 uppercase tracking-widest">
          Shop by <span className="text-primary">Category</span>
        </h2>

        <div className="relative">
          {/* ================= SLIDER ================= */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="flex-none w-full">
                  <div className="flex justify-center gap-6">
                    {categories
                      .slice(
                        slideIndex * ITEMS_PER_SLIDE,
                        slideIndex * ITEMS_PER_SLIDE + ITEMS_PER_SLIDE
                      )
                      .map((category) => (
                        <Card
                          key={category._id}
                          className="w-40 h-60 relative overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
                        >
                          <Link
                            href={`/products?articleType=${category._id}`}
                            className="block w-full h-full"
                          >
                            {/* Image container */}
                            <div className="relative w-full h-full overflow-hidden group">
                              {category.image ? (
                                <div className="w-full h-full transform transition-transform duration-300 ease-in-out group-hover:scale-105">
                                  <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                                  <span className="text-gray-500">No Image</span>
                                </div>
                              )}

                              {/* Overlay for text */}
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <h3 className="text-white text-center text-sm font-semibold px-2 line-clamp-2">
                                  {category.name}
                                </h3>
                              </div>
                            </div>
                          </Link>
                        </Card>
                      ))}

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= NAV BUTTONS ================= */}
          {totalSlides > 1 && (
            <>
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

              {/* ================= DOTS ================= */}
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-3 w-3 rounded-full ${currentSlide === index
                      ? "bg-blue-600"
                      : "bg-gray-300"
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
