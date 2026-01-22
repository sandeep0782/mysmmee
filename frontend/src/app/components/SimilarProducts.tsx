"use client";

import React, { useEffect, useState } from "react";
import { BookDetails } from "@/types/type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import Spinner from "@/lib/BookLoader";

interface SimilarProductsProps {
  articleTypeId: string; // Primary filter
  colorId: string;       // Secondary filter
  currentProductId: string; // Exclude current product
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({
  articleTypeId,
  colorId,
  currentProductId,
}) => {
  const [similarProducts, setSimilarProducts] = useState<BookDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        // Fetch by articleType first
        const res = await fetch(
          `/api/products?articleType=${articleTypeId}&limit=20`
        );
        const data = await res.json();
        if (data?.success) {
          // Exclude current product
          let filtered = data.data.filter(
            (p: BookDetails) => p._id !== currentProductId
          );

          // If colorId exists, prioritize products with the same color
          if (colorId) {
            const sameColor = filtered.filter(
              (p: BookDetails) => p.color._id === colorId
            );
            const otherColors = filtered.filter(
              (p: BookDetails) => p.color._id !== colorId
            );
            filtered = [...sameColor, ...otherColors];
          }

          // Limit to 20
          setSimilarProducts(filtered.slice(0, 20));
        }
      } catch (err) {
        console.error("Failed to fetch similar products", err);
      } finally {
        setLoading(false);
      }
    };

    if (articleTypeId) fetchSimilarProducts();
  }, [articleTypeId, colorId, currentProductId]);

  if (loading) return <Spinner />;

  if (!similarProducts.length)
    return (
      <p className="text-center text-muted-foreground mt-10">
        No similar products found
      </p>
    );

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Similar Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {similarProducts.map((product) => (
          <Card
            key={product._id}
            className="border hover:shadow-md transition-shadow duration-300"
          >
            <Link href={`/products/${product.slug}`}>
              <CardHeader className="p-0">
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <h3 className="text-sm font-medium">{product.title}</h3>
                <p className="text-sm text-muted-foreground">
                  ₹ {product.finalPrice}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
