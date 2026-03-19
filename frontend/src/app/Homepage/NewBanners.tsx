"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useGetProductsQuery } from "@/store/api";
import { BookDetails } from "@/types/type";
import BookLoader from "@/lib/BookLoader";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const NewBanners = () => {
  const { data: apiResponse = {}, isLoading } = useGetProductsQuery({});
  const [books, setBooks] = useState<BookDetails[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const calculateDiscount = (price: number, finalPrice: number) => {
    return price > finalPrice && price > 0
      ? Math.round(((price - finalPrice) / price) * 100)
      : 0;
  };

  const pickRandomBook = (allBooks: BookDetails[]) => {
    return allBooks[Math.floor(Math.random() * allBooks.length)];
  };

  // Initialize 3 random books
  useEffect(() => {
    if (apiResponse?.success && apiResponse.data.length > 0) {
      setBooks([
        pickRandomBook(apiResponse.data),
        pickRandomBook(apiResponse.data),
        pickRandomBook(apiResponse.data),
      ]);
    }
  }, [apiResponse]);

  // Change one card at a time every 5 seconds
  useEffect(() => {
    if (!apiResponse?.success || apiResponse.data.length === 0) return;

    const interval = setInterval(() => {
      setBooks((prevBooks) => {
        const newBooks = [...prevBooks];
        newBooks[currentIndex] = pickRandomBook(apiResponse.data);
        return newBooks;
      });

      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, [apiResponse, currentIndex]);

  if (isLoading) return <BookLoader />;

  if (!books.length)
    return (
      <p className="text-center text-gray-500 py-10">No products to display.</p>
    );

  return (
    <section className="py-4 bg-gray-50">
      <div className="w-[95%] max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-6">
          {books.map((book, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl hover:scale-105 w-full sm:w-[32%] bg-white border border-gray-100"
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative w-full aspect-[4/5]">
                  <Link href={`/products/${book.slug}`}>
                    <Image
                      src={book.images[0]}
                      alt={book.title}
                      fill
                      priority
                      className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Discount Badge */}
                  {calculateDiscount(book.price, book.finalPrice) > 0 && (
                    <div className="absolute left-3 top-3 z-10">
                      <span className="bg-orange-600/90 text-white px-3 py-1 text-sm rounded-lg font-medium shadow-md">
                        {calculateDiscount(book.price, book.finalPrice)}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Content (hidden until hover) */}
                <div className="absolute inset-0 bg-blac bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                  <h3 className="text-lg font-semibold line-clamp-1">
                    {book.brand?.name || book.title}
                  </h3>

                  <p className="text-sm line-clamp-2 mt-1">
                    {book.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-lg font-bold">
                      ₹ {book.finalPrice}
                    </span>
                    {book.price && (
                      <span className="text-sm line-through text-gray-300">
                        ₹ {book.price}
                      </span>
                    )}
                  </div>

                  <Button
                    className="bg-primary hover:bg-primary_hover w-full mt-3"
                    onClick={() => router.push(`/products/${book.slug}`)}
                  >
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewBanners;
