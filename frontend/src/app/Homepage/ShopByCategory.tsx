"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGetArticleTypesQuery } from "@/store/api";
import BookLoader from "@/lib/BookLoader";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

const ShopByCategory = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: apiResponse, isLoading } = useGetArticleTypesQuery({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [itemsPerSlide, setItemsPerSlide] = useState(5);

  /* ================= RESPONSIVE ITEMS PER SLIDE ================= */
  useEffect(() => {
    const updateItemsPerSlide = () => {
      let perSlide = 5;
      if (window.innerWidth < 640) perSlide = 2;
      else if (window.innerWidth < 1024) perSlide = 3;
      setItemsPerSlide(perSlide);
    };
    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    if (apiResponse?.data?.length) setCategories(apiResponse.data);
  }, [apiResponse]);

  const totalSlides = Math.ceil(categories.length / itemsPerSlide);

  useEffect(() => {
    if (currentSlide >= totalSlides) {
      setCurrentSlide(totalSlides - 1 >= 0 ? totalSlides - 1 : 0);
    }
  }, [totalSlides, currentSlide]);

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);

  if (isLoading) return <BookLoader />;
  if (!categories.length)
    return <p className="text-center text-gray-500 py-10">No categories available</p>;

  return (
    <section aria-label="Shop by Category" className="py-16 bg-red-50">
      <div className="w-[95%] mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 uppercase tracking-widest text-center md:text-left">
          Shop by <span className="text-primary">Category</span>
        </h2>

        <div className="relative">
          {/* Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="flex-none w-full">
                  <div className="flex justify-center gap-4 sm:gap-6 flex-wrap md:flex-nowrap">
                    {categories
                      .slice(
                        slideIndex * itemsPerSlide,
                        slideIndex * itemsPerSlide + itemsPerSlide
                      )
                      .map((category) => (
                        <Card
                          key={category._id}
                          className="w-[120px] sm:w-32 md:w-40 h-48 sm:h-56 md:h-60 relative overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
                        >
                          <Link
                            href={`/products?articleType=${category.slug}`}
                            className="block w-full h-full"
                          >
                            {category.image ? (
                              <div className="relative w-full h-full group">
                                <Image
                                  src={category.image}
                                  alt={`Category: ${category.name}`}
                                  fill
                                  className="object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
                                />
                                {/* Overlay category name */}
                                <div className="absolute bottom-0 left-0 w-full bg-black/40 text-white text-center py-1 text-xs sm:text-sm">
                                  {category.name}
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gray-200 w-full h-full flex items-center justify-center rounded-lg">
                                <span className="text-gray-500 text-xs sm:text-sm">
                                  {category.name}
                                </span>
                              </div>
                            )}
                          </Link>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                aria-label="Previous category slide"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hidden sm:flex"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next category slide"
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hidden sm:flex"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Dots */}
              <div className="mt-6 flex justify-center gap-2 sm:gap-3">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-3 w-3 rounded-full ${
                      currentSlide === index ? "bg-blue-600" : "bg-gray-300"
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