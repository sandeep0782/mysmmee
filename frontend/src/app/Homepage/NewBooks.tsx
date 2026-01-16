import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { useGetProductsQuery } from "@/store/api";
import { BookDetails } from "@/types/type";
import BookLoader from "@/lib/BookLoader";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button'

const NewBooks = () => {
  const { data: apiResponse = {}, isLoading } = useGetProductsQuery({});
  const [books, setBooks] = useState<BookDetails[]>([]);
  const router = useRouter()

  // Take first 20 newest products
  useEffect(() => {
    if (apiResponse?.success) {
      setBooks(apiResponse.data.slice(0, 20));
    }
  }, [apiResponse]);

  const calculateDiscount = (price: number, finalPrice: number) => {
    return price > finalPrice && price > 0 ? Math.round(((price - finalPrice) / price) * 100) : 0;
  }

  if (isLoading) return <BookLoader />;

  return (
    <section className="py-16 bg-gray-50">
      <div className="w-[95%] mx-auto px-4">
        <h2 className="text-3xl font-bold text-left mb-12 uppercase tracking-widest">
          Newly Added <span className="text-primary">Products</span>
        </h2>

        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map((book) => (
              <Card key={book._id} className="group relative overflow-hidden rounded transition-shadow duration-300 hover:shadow-2xl bg-white border-0">
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative w-full" style={{ paddingTop: "153.33%" }}>
                    <Link href={`/products/${book.slug}`}>
                      <Image
                        src={book.images[0]}
                        alt={book.title}
                        fill
                        priority
                        className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>

                    {/* Discount Badge */}
                    {calculateDiscount(book.price, book.finalPrice) > 0 && (
                      <div className="absolute left-2 top-2 z-10">
                        <span className="bg-orange-600/90 text-white px-2 py-1 text-xs rounded">
                          {calculateDiscount(book.price, book.finalPrice)}% off
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-black line-clamp-1">
                      {book.brand?.name || book.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-1">
                      {book.description}
                    </p>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-lg font-bold text-black">
                        ₹ {book.finalPrice}
                      </span>
                      {book.price && (
                        <span className="text-sm text-zinc-500 line-through">
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
        ) : (
          <p className="text-center text-gray-500">No products to display.</p>
        )}
      </div>
    </section>
  )
}

export default NewBooks
