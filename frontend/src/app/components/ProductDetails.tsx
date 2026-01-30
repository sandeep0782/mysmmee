'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowRightFromLine, File, FileSpreadsheet, Heart, Loader2, ShoppingCart, Truck } from 'lucide-react'
import { BookDetails } from '@/types/type'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import toast from 'react-hot-toast'
import { addToCart } from '@/store/slices/cartSlice'
import { addToWishlistAction, removeFromWishlistAction } from '@/store/slices/wishlistSlice'
import { useAddToCartMutation, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/store/api'
import { toggleLoginDialog } from '@/store/slices/userSlice'
import ReviewsSection from './Review'
import { ShareButton } from './Share'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DeliveryCheck from './DeliveryCheck'

type Props = {
    product: BookDetails
}

const ProductDetails = ({ product }: Props) => {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user.user)
    const cartItems = useSelector((state: RootState) => state.cart.items)
    const wishlist = useSelector((state: RootState) => state.wishlist.items)
    const [showSizeError, setShowSizeError] = useState(false);

    const [loadedImages, setLoadedImages] = useState<boolean[]>(new Array(product.images?.length).fill(false))
    const [pinCode, setPinCode] = useState("")
    const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null)
    const [isDeliverable, setIsDeliverable] = useState<boolean | null>(null)
    const [isAddtoCart, setIsAddtoCart] = useState(false)

    const DELIVERABLE_PINCODES_SET = new Set<string>(["110001", "110002", "110003"]) // example pins

    const [addToCartMutation] = useAddToCartMutation()
    const [addToWishlistMutation] = useAddToWishlistMutation()
    const [removeWishlistMutation] = useRemoveFromWishlistMutation()
    const [selectedVariant, setSelectedVariant] = useState<any | null>(null)


    const isInCart = cartItems?.some(item => item.product._id === product._id)
    const router = useRouter()


    // Add to cart handler
    const handleAddToCart = async () => {
        if (!user) {
            toast("Please login to add to cart 🔒")
            dispatch(toggleLoginDialog())
            return
        }

        setIsAddtoCart(true)
        try {
            const result = await addToCartMutation({ productId: product._id, quantity: 1 }).unwrap()
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

    // Wishlist handler
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

    // Delivery check
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
        if (count >= 1000000) return (count / 1000000).toFixed(1) + "M"
        if (count >= 1000) return (count / 1000).toFixed(1) + "k"
        return count.toString()
    }

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

                <div className="grid gap-4 md:grid-cols-[1.8fr_1.2fr]">
                    {/* Images Section */}
                    <div className="grid grid-cols-2 gap-2 auto-rows-min">
                        {productImages.map((image, index) => (
                            <div
                                key={index}
                                className="relative w-full border bg-white overflow-hidden aspect-[3/4]"
                            >
                                {!loadedImages[index] && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                                        <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
                                    </div>
                                )}

                                {/* Simple Image without zoom */}
                                <Image
                                    src={image as string}
                                    alt={`${product.title} ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    onLoadingComplete={() => {
                                        setLoadedImages((prev) => {
                                            const newLoaded = [...prev]
                                            newLoaded[index] = true
                                            return newLoaded
                                        })
                                    }}
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
                                <span className="font-thin">{product.rating.toFixed(1)}</span>
                                <span>|</span>
                                <span className="text-red-500">
                                    {formatTotalRatings(product.numReviews)} {product.numReviews === 1 ? "Rating" : "Ratings"}
                                </span>
                            </div>

                            {/* Price & Discount */}
                            <div className="space-y-4">
                                <div className="border-t border-gray-300"></div>
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className="text-sm text-muted-foreground font-medium">MRP</span>
                                    <span className="text-xl text-bold">₹ {product.finalPrice}</span>
                                    <span className="text-lg text-muted-foreground line-through">₹ {product.price}</span>
                                    {calculateDiscount(product.price, product.finalPrice) > 0 && (
                                        <span className="text-md font-thin text-orange-600">
                                            ({calculateDiscount(product.price, product.finalPrice)}% off)
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-[rgb(3,166,133)] text-sm font-bold">inclusive of all taxes</h1>
                                </div>

                                <div className="space-y-3">
                                    {/* SELECT SIZE label always shown */}
                                    <div className="flex gap-4 font-bold">
                                        <div>SELECT SIZE</div>

                                        {/* Only show SIZE CHART if article is NOT saree */}
                                        {product.articleType?.name?.toLowerCase() !== "sarees" && (
                                            <div className="text-red-500 cursor-pointer">SIZE CHART &gt;</div>
                                        )}
                                    </div>

                                    {/* Size buttons for all products */}
                                    <div className="flex flex-wrap gap-3">
                                        {product.variants.map((variant) => {
                                            const sizeLabel =
                                                variant.brandSize ?? (variant.standardSize ? variant.standardSize.toString() : "NA");

                                            const isOutOfStock = variant.stock === 10;
                                            const isSelected = selectedVariant?.sku === variant.sku;

                                            return (
                                                <button
                                                    key={variant.sku}
                                                    onClick={() => setSelectedVariant(variant)}
                                                    className={`
    min-w-[48px] px-4 py-2 border rounded-full font-semibold transition
    ${isSelected
                                                            ? "border-primary text-primary"
                                                            : "border-gray-500 text-black font-bold hover:border-primary"
                                                        }
    ${isOutOfStock ? " cursor-not-allowed" : ""}
  `}
                                                >
                                                    {sizeLabel}
                                                </button>

                                            );
                                        })}
                                    </div>

                                    {/* Show "please select a size" only if variants exist */}
                                    {showSizeError && !selectedVariant && (
                                        <p className="text-red-500 text-sm mt-2">
                                            Please select a size
                                        </p>
                                    )}

                                </div>


                                {/* Return Facility */}
                                {/* <div className="flex flex-col gap-2 mt-4">
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
                                </div> */}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {/* <Button
                                        className={`flex-[0.6] py-6 flex items-center justify-center cursor-pointer transition-colors ${isInCart ? "bg-primary hover:bg-primary-hover" : "bg-primary hover:bg-primary-hover"
                                            }`}
                                        onClick={handleAddToCart}
                                        disabled={isAddtoCart || !selectedVariant}
                                    >
                                        {isAddtoCart ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" size={20} />
                                                Adding to Cart
                                            </>
                                        ) : isInCart ? (
                                            <>
                                                Go to Bag
                                                <ArrowRight className="mr-2 h-5 w-5" />
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="mr-2 h-5 w-5" />
                                                Buy Now
                                            </>
                                        )}
                                    </Button> */}
                                    <Button
                                        type="button"
                                        className="flex-[0.6] py-6 flex items-center justify-center gap-2 cursor-pointer transition-colors bg-primary hover:bg-primary-hover text-white"
                                        disabled={isAddtoCart}
                                        onClick={() => {
                                            if (isInCart) {
                                                router.push("/checkout/cart");
                                                return;
                                            }

                                            if (!selectedVariant) {
                                                setShowSizeError(true);
                                                return;
                                            }

                                            setShowSizeError(false);
                                            handleAddToCart();
                                        }}
                                    >
                                        {isAddtoCart && (
                                            <>
                                                <Loader2 className="animate-spin h-5 w-5" />
                                                <span>Adding to Cart</span>
                                            </>
                                        )}

                                        {!isAddtoCart && isInCart && (
                                            <>
                                                <span>Go to Bag</span>
                                                <ArrowRight className="h-5 w-5" />
                                            </>
                                        )}

                                        {!isAddtoCart && !isInCart && (
                                            <>
                                                <ShoppingCart className="h-5 w-5" />
                                                <span>Buy Now</span>
                                            </>
                                        )}
                                    </Button>


                                    <button
                                        onClick={() => product && handleAddToWishlist(product._id)}
                                        className={`flex-[0.4] py-2 border rounded-md flex items-center justify-center transition-colors duration-300 ${wishlist.some((w) => w.products.includes(product._id))
                                            ? "bg-primary text-white border-primary"
                                            : "bg-white text-primary border-primary cursor-pointer"
                                            }`}
                                    >
                                        <Heart
                                            className={`h-4 w-4 mr-1 ${wishlist.some((w) => w.products.includes(product._id))
                                                ? "fill-white text-white"
                                                : "text-primary cursor-pointer"
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
                                <DeliveryCheck />
                                <div className="text-gray-600">Please enter PIN code to check delivery time & Pay on Delivery Availability</div>

                                {/* Reviews */}
                                <div className="border-t border-gray-300 mt-4"></div>
                                <div className="mt-6 rounded-mdspace-y-2">
                                    <div className="flex items-center gap-2 text-gray-800 font-thin">
                                        ✅ <span>Easy 7 days exchange</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-800 font-thin">
                                        ✅ <span>100% Original Products</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-800 font-thin">
                                        ✅ <span>Returns is available on request</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-800 font-thin">
                                        ✅ <span>Pay on delivery might be available</span>
                                    </div>
                                </div>

                                <div className="space-y-3 bg-white">
                                    <h2 className="text-lg font-bold text-gray-800">BEST OFFERS</h2>
                                    <div className="text-gray-800 mb-2 space-y-1">
                                        <p>
                                            <span className="font-bold">Best Price:</span>{" "}
                                            <span className="text-orange-500">Rs.{product.finalPrice}</span>
                                        </p>
                                        <div className='px-4'>
                                            <p>
                                                <span className="font-thin">Applicable on:</span>{" "}
                                                Orders above Rs. 3000 (only on first purchase)
                                            </p>
                                            <p className="cursor-pointer">
                                                <span className="font-thin">Coupon code:</span>{" "}
                                                <span className="font-bold text-red-500">MYSMMEFIRST</span>
                                            </p>
                                            <p className="text-red-500 cursor-pointer">View Eligible Products</p>
                                        </div>
                                    </div>
                                    <div className="text-gray-800 space-y-2">
                                        <span className="font-bold">Return your old closthes:</span>{" "}
                                        <div className='px-4'>
                                            <p><span className="font-thin">Return your old clothes purchased from <span className='text-red-600 text-bold'>MYSMME </span>and get up to 50% discount on next purchase.</span></p>
                                            <p className="cursor-pointer">
                                                <span className="font-thin">Coupon code:</span>{" "}
                                                <span className="font-bold text-red-500">MYSMMERETURN</span>
                                            </p>
                                            <p className="text-blue-600 cursor-pointer">Terms & Condition</p>
                                        </div>
                                    </div>
                                    <div className="text-gray-800 space-y-2">
                                        <span className="font-bold">Special NORETURN Offer:</span>
                                        <div className="px-4">
                                            <p className="font-thin">
                                                Apply the <span className="font-bold text-red-500">NORETURN</span> coupon to get an additional ₹100 discount on each eligible product.
                                                One-time exchange is allowed.
                                            </p>
                                            <p className="text-blue-600 cursor-pointer">Terms & Conditions</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-gray-300 mt-4"></div>

                                <div className="space-y-4 text-gray-900">
                                    <h1 className="flex items-center gap-2 font-semibold">PRODUCT DETAILS
                                        <FileSpreadsheet className="h-5 w-5" /></h1>
                                    <div>
                                        <h2 className="font-semibold">Design Detail</h2>
                                        <p>{product.description}</p>
                                    </div>
                                    <div>
                                        <h2 className="font-semibold">Size & Fit</h2>
                                        <p>Length : 5.5 metres plus 0.8 metre blouse piece</p>
                                        <p>Width : 1.06 metres (approx.)</p>
                                    </div>
                                    <div>
                                        <h2 className="font-semibold">Material & Care</h2>
                                        <p>Saree Fabric : {product?.setDetails?.sareeFabric}</p>
                                        <p>Blouse Fabric : {product?.setDetails?.blouseFabric}</p>
                                        <p>{product?.fashionDetails?.careInstructions}</p>
                                    </div>
                                    <div>
                                        <h2 className="font-semibold mb-2">Specifications</h2>
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                            <div className="pb-1 border-b border-gray-200">
                                                <p className="text-gray-500 text-sm">Type</p>
                                                <p>{product?.setDetails?.setType}</p>
                                            </div>
                                            <div className="pb-1 border-b border-gray-200">
                                                <p className="text-gray-500 text-sm">Ornamentation</p>
                                                <p>{product?.fashionDetails?.ornamentation}</p>
                                            </div>
                                            <div className="pb-1 border-b border-gray-200">
                                                <p className="text-gray-500 text-sm">Border</p>
                                                <p>{product?.fashionDetails?.border}</p>
                                            </div>
                                            <div className="pb-1 border-b border-gray-200">
                                                <p className="text-gray-500 text-sm">Blouse Fabric</p>
                                                <p>{product?.setDetails?.blouseFabric}</p>
                                            </div>
                                            <div className="pb-1 border-b border-gray-200">
                                                <p className="text-gray-500 text-sm">Blouse</p>
                                                <p>{product?.setDetails?.blouseIncluded}</p>
                                            </div>
                                            <div className="pb-1 border-b border-gray-200">
                                                <p className="text-gray-500 text-sm">Saree Fabric</p>
                                                <p>{product?.setDetails?.sareeFabric}</p>
                                            </div>
                                            <div className=" border-gray-200">
                                                <p className="text-gray-500 text-sm">Wash Care</p>
                                                <p>{product?.fashionDetails?.careInstructions}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Review Section */}
                                    <ReviewsSection product={product} user={user} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ProductDetails
