"use client";

import React, { useEffect, useState } from "react";
import { useGetProductsQuery } from "@/store/api";
import { ProductDetails } from "@/types/type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductLoader from "@/lib/ProductLoader";

const Banner = () => {
  const { data: apiResponse = {}, isLoading } = useGetProductsQuery({});
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const pickRandomProduct = (allProducts: ProductDetails[]) =>
    allProducts[Math.floor(Math.random() * allProducts.length)];

  const calculateDiscount = (price: number, finalPrice: number) =>
    price > finalPrice && price > 0
      ? Math.round(((price - finalPrice) / price) * 100)
      : 0;

  useEffect(() => {
    if (apiResponse?.success && apiResponse.data.length > 0) {
      setProducts([
        pickRandomProduct(apiResponse.data),
        pickRandomProduct(apiResponse.data),
        pickRandomProduct(apiResponse.data),
      ]);
    }
  }, [apiResponse]);

  useEffect(() => {
    if (!apiResponse?.success || apiResponse.data.length === 0) return;

    const interval = setInterval(() => {
      setProducts((prevProducts) => {
        const newProducts = [...prevProducts];
        newProducts[currentIndex] = pickRandomProduct(apiResponse.data);
        return newProducts;
      });
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, [apiResponse, currentIndex]);

  if (isLoading) return <ProductLoader />;

  return (
    <section aria-label="Featured Products" className="py-4 bg-gray-50">
      <div className="w-[95%] max-w-[1400px] mx-auto px-4">
        {products.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No products to display.</p>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-6">
            {products.map((product, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl hover:scale-105 w-full sm:w-[32%] bg-white border border-gray-100"
              >
                <CardContent className="p-0">
                  <div className="relative w-full aspect-[4/5]">
                    <Link href={`/products/${product.slug}`}>
                      <Image
                        src={product.images[0]}
                        alt={`${product.title} by ${product.brand?.name || "Unknown Brand"}`}
                        fill
                        priority={index === 0}
                        className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    {calculateDiscount(product.price, product.finalPrice) > 0 && (
                      <div className="absolute left-3 top-3 z-10">
                        <span
                          className="bg-orange-600/90 text-white px-3 py-1 text-sm rounded-lg font-medium shadow-md"
                          aria-label={`${calculateDiscount(product.price, product.finalPrice)}% discount`}
                        >
                          {calculateDiscount(product.price, product.finalPrice)}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-black/30 text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col">
                    <h3 className="text-lg font-semibold line-clamp-1">
                      {product.brand?.name || product.title}
                    </h3>
                    <p className="text-sm line-clamp-2 mt-1">{product.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-lg font-bold">₹ {product.finalPrice}</span>
                      {product.price && (
                        <span className="text-sm line-through text-gray-300">₹ {product.price}</span>
                      )}
                    </div>
                    <Button
                      className="bg-primary hover:bg-primary_hover w-full mt-3"
                      onClick={() => router.push(`/products/${product.slug}`)}
                    >
                      Buy Now
                    </Button>
                  </div>
                </CardContent>

                {/* JSON-LD structured data */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "Product",
                      name: product.title,
                      image: product.images[0],
                      description: product.description,
                      brand: {
                        "@type": "Brand",
                        name: product.brand?.name || "Unknown Brand",
                      },
                      offers: {
                        "@type": "Offer",
                        priceCurrency: "INR",
                        price: product.finalPrice,
                        availability: "https://schema.org/InStock",
                        url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
                      },
                    }),
                  }}
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Banner;