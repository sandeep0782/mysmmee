'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { Heart } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import { BookDetails } from '@/types/type'
import { RootState } from '@/store/store'
import { addToCart } from '@/store/slices/cartSlice'
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from '@/store/slices/wishlistSlice'
import {
  useAddToCartMutation,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from '@/store/api'

import ProductFilters from '../components/ProductFilters'
import TopFilters from '../components/TopFilters'
import Pagination from '@/constant/pagination'
import NoData from '@/lib/NoData'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Props = {
  products: BookDetails[]
}

export default function ProductsClient({ products }: Props) {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()

  // ---------------- state ----------------
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBrand, setSelectedBrand] = useState<string[]>([])
  const [selectedGender, setSelectedGender] = useState<string[]>([])
  const [selectedColor, setSelectedColor] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string[]>([])
  const [sortOption, setSortOption] = useState('newest')
  const [addingProductId, setAddingProductId] = useState<string | null>(null)

  const wishlist = useSelector((state: RootState) => state.wishlist.items)
  const cart = useSelector((state: RootState) => state.cart)

  const [addToCartMutation] = useAddToCartMutation()
  const [addToWishlist] = useAddToWishlistMutation()
  const [removeFromWishlist] = useRemoveFromWishlistMutation()

  const productPerPage = 12
  const searchTerms = searchParams.get('search')?.toLowerCase() ?? ''

  // ---------------- helpers ----------------
  const toggleFilter = (section: string, item: string) => {
    const update = (prev: string[]) =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]

    if (section === 'brand') setSelectedBrand(update)
    if (section === 'gender') setSelectedGender(update)
    if (section === 'color') setSelectedColor(update)
    if (section === 'category') setSelectedCategory(update)

    setCurrentPage(1)
  }

  const calculateDiscount = (price: number, finalPrice: number) =>
    price > finalPrice && price > 0
      ? Math.round(((price - finalPrice) / price) * 100)
      : 0

  // ---------------- filtering ----------------
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const brandMatch =
        !selectedBrand.length ||
        selectedBrand.includes(product.brand?._id)

      const genderMatch =
        !selectedGender.length ||
        selectedGender.includes(product.gender)

      const colorMatch =
        !selectedColor.length ||
        selectedColor.includes(product.color?._id)

      const categoryMatch =
        !selectedCategory.length ||
        selectedCategory.includes(product.category?._id)

      const searchMatch =
        !searchTerms ||
        product.title.toLowerCase().includes(searchTerms) ||
        product.description?.toLowerCase().includes(searchTerms)

      return (
        brandMatch &&
        genderMatch &&
        colorMatch &&
        categoryMatch &&
        searchMatch
      )
    })
  }, [
    products,
    selectedBrand,
    selectedGender,
    selectedColor,
    selectedCategory,
    searchTerms,
  ])

  // ---------------- sorting ----------------
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          )
        case 'oldest':
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          )
        case 'price-low':
          return (a.finalPrice ?? 0) - (b.finalPrice ?? 0)
        case 'price-high':
          return (b.finalPrice ?? 0) - (a.finalPrice ?? 0)
        default:
          return 0
      }
    })
  }, [filteredProducts, sortOption])

  // ---------------- pagination ----------------
  const totalPages = Math.ceil(sortedProducts.length / productPerPage)
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productPerPage,
    currentPage * productPerPage
  )

  // ---------------- actions ----------------
  const handleWishlist = async (productId: string) => {
    try {
      const isWishlisted = wishlist.some(w =>
        w.products.includes(productId)
      )

      const res = isWishlisted
        ? await removeFromWishlist(productId).unwrap()
        : await addToWishlist({ productId }).unwrap()

      if (res.success) {
        dispatch(
          isWishlisted
            ? removeFromWishlistAction(productId)
            : addToWishlistAction(res.data)
        )
        toast.success(res.message)
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Something went wrong')
    }
  }

  const handleAddToCart = async (product: BookDetails) => {
    setAddingProductId(product._id)
    try {
      const res = await addToCartMutation({
        productId: product._id,
        quantity: 1,
      }).unwrap()

      if (res.success) {
        dispatch(addToCart(res.data))
        toast.success(res.message)
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to add to cart')
    } finally {
      setAddingProductId(null)
    }
  }

  // ---------------- empty state ----------------
  if (!paginatedProducts.length) {
    return (
      <NoData
        imageUrl="/images/outofstock.png"
        message="No products found"
        description="Try adjusting your filters or search."
        onClick={() => router.push('/')}
        buttonText="Go Home"
      />
    )
  }

  // ---------------- render ----------------
  return (
    <div className="min-h-screen bg-white">
      <div className="w-[95%] mx-auto px-4 py-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <TopFilters
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        </div>

        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          <ProductFilters
            selectedBrand={selectedBrand}
            selectedGender={selectedGender}
            selectedColor={selectedColor}
            selectedCategory={selectedCategory}
            toggleFilter={toggleFilter}
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedProducts.map((product, index) => {
              const isInCart = cart.items.some(
                item => item.product._id === product._id
              )

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative w-full pt-[150%]">
                        <Link href={`/products/${product.slug}`}>
                          <Image
                            src={product.images?.[0] || '/images/placeholder.png'}
                            alt={product.title}
                            fill
                            priority={index < 4}
                            sizes="
                              (max-width: 640px) 50vw,
                              (max-width: 1024px) 33vw,
                              25vw
                            "
                            className="object-cover"
                          />
                        </Link>

                        {calculateDiscount(
                          product.price,
                          product.finalPrice
                        ) > 0 && (
                          <Badge className="absolute top-2 left-2 z-10">
                            {calculateDiscount(
                              product.price,
                              product.finalPrice
                            )}
                            % OFF
                          </Badge>
                        )}

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleWishlist(product._id)}
                          className="absolute top-2 right-2 bg-white z-10"
                        >
                          <Heart
                            className={
                              wishlist.some(w =>
                                w.products.includes(product._id)
                              )
                                ? 'fill-red-500'
                                : ''
                            }
                          />
                        </Button>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>

                        <div className="flex gap-2 mt-2">
                          <span className="font-bold">
                            ₹{product.finalPrice}
                          </span>
                          {product.price && (
                            <span className="line-through text-sm">
                              ₹{product.price}
                            </span>
                          )}
                        </div>

                        <Button
                          className="w-full mt-3"
                          disabled={addingProductId === product._id || isInCart}
                          onClick={() => handleAddToCart(product)}
                        >
                          {isInCart
                            ? 'Added'
                            : addingProductId === product._id
                            ? 'Adding...'
                            : 'Add to Cart'}
                        </Button>

                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(
                            new Date(product.createdAt),
                            { addSuffix: true }
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}
