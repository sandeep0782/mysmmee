'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { CheckCircle2, File, Heart, Loader2, MapPin, MessageCircle, ShoppingCart, Star, Truck, User2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Spinner from '@/lib/BookLoader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookDetails } from '@/types/type'
import NoData from '@/lib/NoData'
import { filters } from '@/constant/Filter'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import toast from 'react-hot-toast'
import { useAddToCartMutation, useAddToWishlistMutation, useGetProductBySlugQuery, useRemoveFromWishlistMutation } from '@/store/api'
import { addToCart } from '@/store/slices/cartSlice'
import { addToWishlistAction, removeFromWishlistAction } from '@/store/slices/wishlistSlice'
import { ShareButton } from '@/app/components/Share'
import ZoomImage from '@/app/components/ZoomImage'
import SimilarProducts from '@/app/components/SimilarProducts'
import { DELIVERABLE_PINCODES } from '@/constant/DeliveryPincode'

const page = () => {
    const { slug } = useParams()
    const router = useRouter()
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [isAddtoCart, setIsAddtoCart] = useState(false)
    const { data: apiResponse, isLoading, isError } = useGetProductBySlugQuery(slug, {
        skip: !slug, // skips query if slug is empty
    });
    const [product, setProduct] = useState<BookDetails | null>(null)
    const [addToCartMutation] = useAddToCartMutation()
    const [addToWishlistMutation] = useAddToWishlistMutation()
    const [removeWishlistMutation] = useRemoveFromWishlistMutation()
    const wishlist = useSelector((state: RootState) => state.wishlist.items)
    const dispatch = useDispatch()
    const [loadedImages, setLoadedImages] = useState<boolean[]>([]);

    const cartItems = useSelector((state: RootState) => state.cart.items)
    const isInCart = product && cartItems?.some(item => item.product._id === product._id)

    const [pinCode, setPinCode] = useState("")
    const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null)
    const [isDeliverable, setIsDeliverable] = useState<boolean | null>(null)
    const DELIVERABLE_PINCODES_SET = new Set(DELIVERABLE_PINCODES);


    useEffect(() => {
        if (apiResponse?.success && apiResponse?.data) {
            setProduct(apiResponse.data)

        }
    }, [apiResponse])

    const handleAddToCart = async () => {
        if (product) {
            setIsAddtoCart(true)
            try {
                const result = await addToCartMutation({ productId: product?._id, quantity: 1 }).unwrap()
                if (result.success && result.data) {
                    dispatch(addToCart(result.data))
                    toast.success(result.message || "Added to Cart Successfully")
                } else {
                    throw new Error(result.message || 'Failed to add to cart')
                }
            } catch (error: any) {
                const errormessage = error?.data?.message
                toast.error(errormessage)
            } finally {
                setIsAddtoCart(false)
            }
        }
    }

    const handleAddToWishlist = async (productId: string) => {
        try {
            const isWishlist = wishlist.some((item) => item.products.includes(productId))
            if (isWishlist) {
                const result = await removeWishlistMutation(productId).unwrap()
                if (result.success) {
                    dispatch(removeFromWishlistAction(productId))
                    toast.success(result.message || "Removed from Wishlist successfully")
                } else {
                    throw new Error(result.message || 'Failed to remove from Wishlist')
                }
            } else {
                const result = await addToWishlistMutation({ productId }).unwrap()
                if (result.success) {
                    dispatch(addToWishlistAction(result.data))
                    toast.success(result.message || "Added to Wishlist successfully")
                } else {
                    throw new Error(result.message || 'Failed to add to Wishlist')
                }
            }
        } catch (error: any) {
            const errormessage = error?.data?.message
            toast.error(errormessage)
        }
    }


    const productImages = product?.images || []

    if (isLoading) return <Spinner />
    if (!product || isError)
        return (
            <div className="my-10 max-w-3xl justify-center mx-auto">
                <NoData
                    imageUrl="/images/no-book.jpg"
                    message="No products available. Please try again later."
                    description="Try adjusting your filters or check back soon for available listings."
                // onClick={() => router.push("/")}
                // buttonText="Sell your books"
                />
            </div>
        )

    const calculateDiscount = (price: number, finalPrice: number): number => {
        if (price > finalPrice && price > 0) {
            return Math.round(((price - finalPrice) / price) * 100)
        }
        return 0
    }

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString)
        return formatDistanceToNow(date, { addSuffix: true })
    }

    const handleSelect = (id: string) => setSelectedSize(id)

    const handleCheckDelivery = () => {
        const pin = pinCode.trim();
        if (!pin || pin.length !== 6) {
            setDeliveryMessage("Please enter a valid 6-digit PIN code");
            setIsDeliverable(false);
            return;
        }

        if (DELIVERABLE_PINCODES_SET.has(pin)) {
            setDeliveryMessage("Delivery available at this PIN code ✅");
            setIsDeliverable(true);
        } else {
            setDeliveryMessage("Sorry, delivery is not available at this location ❌");
            setIsDeliverable(false);
        }
    };
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
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

                {/* <div className="grid grid-cols-2 gap-2"> */}

                <div className="grid gap-4 md:grid-cols-[1.8fr_1.2fr] ">
                    {/* Images Section */}
                    <div className="grid grid-cols-2 gap-2">
                        {/* {productImages.map((image, index) => (
                            <div key={index} className="relative w-full border bg-white overflow-hidden aspect-[3/4]">
                                <Image
                                    src={image as string}
                                    alt={`${product.title} ${index + 1}`}
                                    width={400} // desired width
                                    height={533} // 3:4 ratio
                                    className="w-full h-full object-cover transition-transform duration-300 ease-in hover:scale-105"
                                />
                            </div>
                        ))} */}
                        {productImages.map((image, index) => (
                            <div key={index} className="relative w-full border bg-white overflow-hidden aspect-[3/4]">
                                {!loadedImages[index] && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                                <ZoomImage
                                    key={index}

                                    src={image as string}
                                    alt={`${product.title} ${index + 1}`}
                                // width={400} // thumbnail size
                                // height={533} // maintain 3:4 ratio
                                // fill
                                // className="w-full h-full object-cover transition-transform duration-300 ease-in hover:scale-105"
                                // placeholder="blur"
                                // blurDataURL="/images/placeholder.png" // low-res blurred image
                                // sizes="(max-width: 768px) 100vw, 50vw" // responsive sizing
                                />
                            </div>
                        ))}

                    </div>

                    {/* Product Details Section */}
                    <div className="space-y-6">
                        {/* Title & Brand */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold">{product.brand?.name}</h1>
                                <h1 className="text-gray-500 text-2xl font-semibold">{product.description}</h1>
                                <p className="text-sm text-muted-foreground">Posted: {formatDate(product.createdAt)}</p>
                            </div>
                            <div className="flex gap-2">
                                <ShareButton
                                    url={`${window.location.origin}/products/${product._id}`}
                                    title={`check out this product:${product.title}`}
                                    text={`I found a beautiful product on MYSMME:${product.title}`}
                                />
                                <Button variant="outline" onClick={() => handleAddToWishlist(product._id)}>
                                    <Heart className={`h-4 w-4 mr-1 ${wishlist.some((w) => w.products.includes(product._id)) ? "fill-red-500" : ""}`} />
                                    <span className="hidden md:inline">
                                        {wishlist.some((w) => w.products.includes(product._id)) ? "Remove from Wishlist" : "Add to Wishlist"}
                                    </span>
                                </Button>
                            </div>
                        </div>

                        {/* Price & Discount */}
                        <div className="space-y-4">
                            <div className="border-t border-gray-300"></div>
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-3xl font-bold text-black">₹ {product.finalPrice}</span>
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

                            {/* Size Selection */}

                            <div className="flex gap-4 font-bold">
                                <div>SELECT SIZE</div>
                                <div className="text-red-500 cursor-pointer">SIZE CHART &gt;</div>
                            </div>

                            {/* <div className="flex flex-wrap gap-3 mb-6">
                                {product.sizes?.map((item, index) => {
                                    const isOutOfStock = item.stock === 0;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => !isOutOfStock && setSelectedSize(item.size)}
                                            disabled={isOutOfStock}
                                            className={`relative px-3 py-1 border rounded cursor-pointer transition-colors duration-300 ${selectedSize === item.size ? "bg-green-700 text-white" : "hover:bg-gray-100"}${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            {item.size}

                                            {isOutOfStock && (
                                                <span className="absolute inset-0 flex items-center justify-center">
                                                    <span className="absolute w-full h-[3px] bg-red-500 -rotate-45"></span>
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div> */}







                            {/* <div className="flex flex-wrap gap-3 mb-6">
                                {product.sizes.map(size => (
                                    <button
                                        key={size._id}
                                        onClick={() => handleSelect(size._id)}
                                        className={`px-3 py-1 border rounded cursor-pointer transition-colors duration-300 ${selectedSize === size._id ? 'bg-red-500 text-white' : 'hover:bg-gray-100'}`}
                                    >
                                        {size.name}
                                    </button>
                                ))}
                            </div> */}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4">
                                {/* <Button className="flex-[0.6] py-6 bg-blue-700 flex items-center justify-center cursor-pointer" onClick={handleAddToCart} disabled={isAddtoCart}>
                                    {isAddtoCart ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={20} />
                                            Adding to Cart
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                            Buy Now
                                        </>
                                    )}
                                </Button>
                                */}
                                <Button
                                    className={`flex-[0.6] py-6 flex items-center justify-center cursor-pointer transition-colors ${isInCart ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary_hover"
                                        }`}
                                    onClick={() => {
                                        if (isInCart) {
                                            router.push("/checkout/cart")
                                        } else {
                                            handleAddToCart()
                                        }
                                    }}
                                    disabled={isAddtoCart}
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
                                    onClick={() => handleAddToWishlist(product._id)}
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

                            {/* Delivery & Info */}
                            <div className="border-t border-gray-300"></div>
                            <div className="flex items-center gap-2 font-semibold text-gray-900">
                                <span>CHECK DELIVERY OPTION</span>
                                <Truck className="h-5 w-5 text-gray-900" strokeWidth={1} />
                            </div>
                            <div className="relative w-full">
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
                                </div>

                                {deliveryMessage && (
                                    <p
                                        className={`text-sm mt-2 ${isDeliverable ? "text-green-600" : "text-red-500"
                                            }`}
                                    >
                                        {deliveryMessage}
                                    </p>
                                )}

                            </div>
                            <div className="text-gray-600">Please enter PIN code to check delivery time & Pay on Delivery Availability</div>
                            <div className="flex flex-col gap-2 text-sm text-gray-700">
                                <span className="font-medium">100% Original Products</span>
                                <span>Pay on delivery might be available</span>
                                <span>Easy 7 days returns and exchange</span>
                            </div>

                            {/* Product Details */}
                            <div className="border-t border-gray-300"></div>
                            <div className="space-y-4 text-gray-900">
                                <h1 className="flex items-center gap-2 font-semibold"><File className="h-5 w-5" /> PRODUCT DETAILS</h1>
                                <div>
                                    <h2 className="font-semibold">Design Detail</h2>
                                    <p>{product.description}</p>
                                </div>
                                <div>
                                    <h2 className="font-semibold">Size & Fit</h2>
                                    <p>Length: {product.price}</p>
                                    <p>Width: {product.price}</p>
                                </div>
                                <div>
                                    <h2 className="font-semibold">Material & Care</h2>
                                    <p>Saree Fabric: Silk Blend</p>
                                    <p>Blouse Fabric: Silk Blend</p>
                                    <p>Dry Clean</p>
                                </div>
                                <div>
                                    <h2 className="font-semibold">Specifications</h2>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                        <div><p className="text-gray-500 text-sm">Type</p><p>Banarasi</p></div>
                                        <div><p className="text-gray-500 text-sm">Ornamentation</p><p>Zari</p></div>
                                        <div><p className="text-gray-500 text-sm">Border</p><p>Woven Design</p></div>
                                        <div><p className="text-gray-500 text-sm">Blouse Fabric</p><p>Silk Blend</p></div>
                                        <div><p className="text-gray-500 text-sm">Blouse</p><p>Blouse Piece</p></div>
                                        <div><p className="text-gray-500 text-sm">Saree Fabric</p><p>Silk Blend</p></div>
                                        <div><p className="text-gray-500 text-sm">Wash Care</p><p>Dry Clean</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Description & Sold By */}
                <div className="mt-8 grid gap-8 md:grid-cols-2">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Description</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">{product.description}</CardContent>
                    </Card>
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Sold By</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-blue-300 flex items-center justify-center">
                                    <User2 className="h-6 w-6 text-blue-500" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{product.title}</span>
                                        <Badge variant="secondary" className="text-green-600">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Verified
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        Manohar Pur Haryana
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <MessageCircle className="h-4 w-4 text-blue-600" />
                                <span>Contact: {product.title}</span>
                            </div>
                        </CardContent>
                    </Card>
                    {/* <SimilarProducts
                        // articleTypeSlug={product.articleType?.slug} // pass slug instead of _id
                        // currentProductSlug={product.slug}          // exclude current product by slug
                        colorSlug={product.color.slug}             // optional
                    /> */}
                </div>
            </div>
        </div>
    )
}

export default page
