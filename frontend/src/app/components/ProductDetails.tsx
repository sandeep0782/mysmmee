'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Heart, Loader2, ShoppingCart, Truck, File } from 'lucide-react'
import { BookDetails } from '@/types/type'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import toast from 'react-hot-toast'
import { addToCart } from '@/store/slices/cartSlice'
import { addToWishlistAction, removeFromWishlistAction } from '@/store/slices/wishlistSlice'
import { useAddToCartMutation, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/store/api'
import { toggleLoginDialog } from '@/store/slices/userSlice'
import ZoomImage from './ZoomImage'
import ReviewsSection from './Review'
import { ShareButton } from './Share'
import NoData from '@/lib/NoData'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Props = {
    product: BookDetails
}

const ProductDetails = ({ product }: Props) => {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user.user)
    const cartItems = useSelector((state: RootState) => state.cart.items)
    const wishlist = useSelector((state: RootState) => state.wishlist.items)

    const [loadedImages, setLoadedImages] = useState<boolean[]>(new Array(product.images?.length).fill(false))
    const [pinCode, setPinCode] = useState("")
    const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null)
    const [isDeliverable, setIsDeliverable] = useState<boolean | null>(null)
    const [isAddtoCart, setIsAddtoCart] = useState(false)
    const [returnOption, setReturnOption] = useState<"yes" | "no" | null>(null) // mandatory return choice

    const DELIVERABLE_PINCODES_SET = new Set<string>(["110001", "110002", "110003"]) // example

    const [addToCartMutation] = useAddToCartMutation()
    const [addToWishlistMutation] = useAddToWishlistMutation()
    const [removeWishlistMutation] = useRemoveFromWishlistMutation()

    const isInCart = cartItems?.some(item => item.product._id === product._id)
    const router = useRouter()

    const handleAddToCart = async () => {
        if (!user) {
            toast("Please login to add to cart 🔒")
            dispatch(toggleLoginDialog())
            return
        }
        if (!returnOption) {
            toast.error("Please select Return Facility option before proceeding!")
            return
        }
        setIsAddtoCart(true)
        try {
            const priceToUse = returnOption === "yes" ? product.finalPrice + 100 : product.finalPrice
            const result = await addToCartMutation({ productId: product._id, quantity: 1, price: priceToUse }).unwrap()
            if (result.success) {
                dispatch(addToCart(result.data))
                toast.success("Added to cart")
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to add to cart")
        } finally {
            setIsAddtoCart(false)
        }
    }

    const handleAddToWishlist = async (productId: string) => {
        if (!user) {
            toast("Please login to add to wishlist 🔒")
            dispatch(toggleLoginDialog())
            return
        }
        try {
            const isWishlist = wishlist.some(w => w.products.includes(productId))
            if (isWishlist) {
                const result = await removeWishlistMutation(productId).unwrap()
                if (result.success) dispatch(removeFromWishlistAction(productId))
            } else {
                const result = await addToWishlistMutation(productId).unwrap()
                if (result.success) dispatch(addToWishlistAction(result.data))
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update wishlist")
        }
    }

    const handleCheckDelivery = () => {
        const pin = pinCode.trim()
        if (!pin || pin.length !== 6) {
            setDeliveryMessage("Enter valid 6-digit PIN code")
            setIsDeliverable(false)
            return
        }
        if (DELIVERABLE_PINCODES_SET.has(pin)) {
            setDeliveryMessage("Delivery available ✅")
            setIsDeliverable(true)
        } else {
            setDeliveryMessage("Delivery not available ❌")
            setIsDeliverable(false)
        }
    }

    const calculateDiscount = (price: number, finalPrice: number) =>
        price > finalPrice && price > 0 ? Math.round(((price - finalPrice) / price) * 100) : 0

    const productImages = product?.images || []

    const formatTotalRatings = (count: number) => {
        if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
        if (count >= 1000) return (count / 1000).toFixed(1) + "k";
        return count.toString();
    };

    return (
        <div className="min-h-screen">
            <div className="w-[95%] mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="mb-4 flex items-center gap-2 text-muted-foreground">
                    <Link href="/" className="text-blue-500 hover:underline">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="text-blue-500 hover:underline">Products</Link>
                    <span>/</span>
                    {product.category ? (
                        <>
                            <Link
                                href={`/category/${product.category._id}`}
                                className="text-blue-500 hover:underline"
                            >
                                {product.category.name}
                            </Link>
                            <span>/</span>
                        </>
                    ) : null}
                    <span>{product.description}</span>
                </nav>

                <div className="grid gap-4 md:grid-cols-[1.8fr_1.2fr] ">
                    {/* Images Section */}
                    {/* Images Section */}
                    <div className="grid grid-cols-2 gap-2">
                        {productImages.map((image, index) => (
                            <div
                                key={index}
                                className="relative w-full border bg-white overflow-hidden aspect-[3/4]"
                            >
                                {/* Loader while image is loading */}
                                {!loadedImages[index] && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                                        <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
                                    </div>
                                )}

                                {/* ZoomImage Thumbnail */}
                                <ZoomImage
                                    src={image as string}
                                    alt={`${product.title} ${index + 1}`}
                                    onLoad={() => {
                                        // mark this image as loaded
                                        setLoadedImages((prev) => {
                                            const newLoaded = [...prev]
                                            newLoaded[index] = true
                                            return newLoaded
                                        })
                                    }}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Product Details Section */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-bold">{product.brand?.name}</h1>
                                <ShareButton
                                    url={`${window.location.origin}/products/${product._id}`}
                                    title={`Check out this product: ${product.title}`}
                                    text={`I found a beautiful product on MYSMME: ${product.title}`}
                                />
                            </div>

                            <h1 className="text-gray-500 text-xl">{product.description}</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="font-semibold">{product.rating.toFixed(1)}</span>
                                <span>|</span>
                                <span className="text-red-500">
                                    {formatTotalRatings(product.numReviews)} {product.numReviews === 1 ? "Rating" : "Ratings"}
                                </span>
                            </div>

                            {/* Price & Discount */}
                            <div className="space-y-4">
                                <div className="border-t border-gray-300"></div>
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className="text-2xl font-bold text-black">₹ {returnOption === "yes" ? product.finalPrice + 100 : product.finalPrice}</span>
                                    <span className="text-sm text-muted-foreground font-medium">MRP</span>
                                    <span className="text-lg text-muted-foreground line-through">₹ {product.price}</span>
                                    {calculateDiscount(product.price, product.finalPrice) > 0 && (
                                        <span className="text-md font-semibold text-orange-600">
                                            ({calculateDiscount(product.price, product.finalPrice)}% off)
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-[rgb(3,166,133)] text-sm font-bold">inclusive of all taxes</h1>
                                </div>

                                {/* Return Facility - mandatory */}
                                <div className="flex flex-col gap-2 mt-4">
                                    <span className="font-medium">Avail Return Facility by paying only ₹100</span>
                                    <div className="flex gap-4 items-center">
                                        <label className="flex items-center gap-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="returnOption"
                                                value="yes"
                                                checked={returnOption === "yes"}
                                                onChange={() => setReturnOption("yes")}
                                                className="w-4 h-4"
                                            />
                                            Yes
                                        </label>
                                        <label className="flex items-center gap-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="returnOption"
                                                value="no"
                                                checked={returnOption === "no"}
                                                onChange={() => setReturnOption("no")}
                                                className="w-4 h-4"
                                            />
                                            No
                                        </label>
                                    </div>
                                    {returnOption === null && (
                                        <p className="text-red-500 text-sm">Please select an option before proceeding</p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <Button
                                        className={`flex-[0.6] py-6 flex items-center justify-center cursor-pointer transition-colors ${isInCart ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary_hover"
                                            }`}
                                        onClick={handleAddToCart}
                                        disabled={isAddtoCart || !returnOption}
                                    >
                                        {isAddtoCart ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" size={20} />
                                                Adding to Cart
                                            </>
                                        ) : isInCart ? (
                                            <>
                                                <ShoppingCart className="mr-2 h-5 w-5" />
                                                Go to Cart
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="mr-2 h-5 w-5" />
                                                Buy Now
                                            </>
                                        )}
                                    </Button>

                                    <button
                                        onClick={() => product && handleAddToWishlist(product._id)}
                                        className={`flex-[0.4] py-2 border rounded-md flex items-center justify-center transition-colors duration-300 ${wishlist.some((w) => w.products.includes(product._id))
                                            ? "bg-red-500 text-white border-red-500"
                                            : "bg-white text-red-500 border-red-500 cursor-pointer"
                                            }`}
                                    >
                                        <Heart
                                            className={`h-4 w-4 mr-1 ${wishlist.some((w) => w.products.includes(product._id))
                                                ? "fill-white text-white"
                                                : "text-red-500 cursor-pointer"
                                                }`}
                                        />
                                        <span className="hidden md:inline cursor-pointer">
                                            {wishlist.some((w) => w.products.includes(product._id))
                                                ? "Wishlisted"
                                                : "Add to Wishlist"}
                                        </span>
                                    </button>
                                </div>

                                {/* Delivery Section */}
                                <div className="border-t border-gray-300 mt-4"></div>
                                <div className="flex items-center gap-2 font-semibold text-gray-900">
                                    <span>CHECK DELIVERY OPTION</span>
                                    <Truck className="h-5 w-5 text-gray-900" strokeWidth={1} />
                                </div>
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        placeholder="Enter Pin Code"
                                        value={pinCode}
                                        onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
                                        maxLength={6}
                                        className="w-full px-3 py-2 pr-24 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                                    />
                                    <button
                                        onClick={handleCheckDelivery}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 font-semibold px-3 py-1 cursor-pointer"
                                    >
                                        Check
                                    </button>
                                    {deliveryMessage && (
                                        <p className={`text-sm mt-2 ${isDeliverable ? "text-green-600" : "text-red-500"}`}>
                                            {deliveryMessage}
                                        </p>
                                    )}
                                </div>
                                <div className="text-gray-600">Please enter PIN code to check delivery time & Pay on Delivery Availability</div>

                                {/* Product Details */}
                                <div className="border-t border-gray-300 mt-4"></div>
                                <ReviewsSection product={product} user={user} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails
