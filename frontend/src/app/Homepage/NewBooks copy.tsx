import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useGetProductsQuery } from "@/store/api";
import { BookDetails } from "@/types/type";
import BookLoader from "@/lib/BookLoader";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button'
import FeaturesSection from '../components/Features'

const NewBooks = () => {
  const [currentBookSlide, setCurrentBookSlide] = useState(0)
  const { data: apiResponse = {}, isLoading } = useGetProductsQuery({});
  const [books, setBooks] = useState<BookDetails[]>([]);
  const router = useRouter()

  useEffect(() => {
    if (apiResponse?.success) {
      setBooks(apiResponse.data.slice(0, 9));
    }
  }, [apiResponse]);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBookSlide((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prevSlide = () => {
    setCurrentBookSlide((prev) => (prev - 1 + 3) % 3)
  }

  const nextSlide = () => {
    setCurrentBookSlide((prev) => (prev + 1) % 3)
  }


  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };


  if (isLoading) return <BookLoader />;
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-left mb-12 uppercase tracking-widest">
          Newly Added <span className="text-primary ">Products</span>
        </h2>
        <div className="relative">
          {books.length > 0 ? (
            <>
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentBookSlide * 100}%)` }}
                >
                  {[0, 1, 2].map((slideIndex) => (
                    <div key={slideIndex} className="flex-none w-full">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {books.slice(slideIndex * 3, slideIndex * 3 + 3).map((book) => (
                <Card
  key={book._id}
  className="group relative overflow-hidden rounded-xl bg-white border-0 transition-shadow duration-300 hover:shadow-2xl"
>
  <CardContent className="p-0">
    {/* Image */}
    <div className="relative w-full aspect-[3/4]">
      <Link href={`/products/${book.slug}`}>
        <Image
          src={book.images[0]}
          alt={book.title}
          fill
          priority
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Discount Badge */}
      {calculateDiscount(book.price, book.finalPrice) > 0 && (
        <span className="absolute top-2 left-2 z-10 rounded bg-orange-600 px-2 py-1 text-xs font-semibold text-white">
          {calculateDiscount(book.price, book.finalPrice)}% OFF
        </span>
      )}
    </div>

    {/* Content */}
    <div className="p-4 space-y-2">
      <Link href={`/products/${book.slug}`}>
        <h3 className="line-clamp-1 text-sm font-semibold text-black">
          {book.title}
        </h3>
      </Link>

      <p className="text-xs text-gray-400 line-clamp-1">
        {book.condition}
      </p>

      {/* Price */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-black">
          ₹{book.finalPrice}
        </span>
        {book.price && (
          <span className="text-sm text-gray-400 line-through">
            ₹{book.price}
          </span>
        )}
      </div>

      {/* CTA */}
      <Button
        className="w-full bg-primary hover:bg-primary_hover"
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
                    onClick={() => setCurrentBookSlide(dot)}
                    className={`h-3 w-3 rounded-full ${currentBookSlide === dot ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">No books to display.</p>
          )}
        </div>
      </div>
      {/* <FeaturesSection /> */}
    </section>


  )
}

export default NewBooks