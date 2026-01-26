import ProductDetails from '@/app/components/ProductDetails' // make sure path is correct
import { Metadata } from 'next'
import React from 'react'

// page receives slug from dynamic route
type Props = {
    params: { slug: string }
}

// Metadata generator (outside the component)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = params.slug

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/slug/${slug}`, {
        credentials: 'include',
    })
    const productData = await res.json()

    if (!productData?.data) {
        return {
            title: "Product Not Found",
            description: "The product you are looking for does not exist."
        }
    }

    const product = productData.data

    return {
        title: product.title || "Product Details",
        description: product.description || "Check out this product on our store",
        openGraph: {
            images: product.images || []
        }
    }
}

const Page = async ({ params }: Props) => {
    const slug = params.slug

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/slug/${slug}`, {
        credentials: 'include',
    })
    const productData = await res.json()

    if (!productData?.data) {
        return <div>Product not found</div>
    }

    return (
        <div>
            <ProductDetails product={productData.data} />
        </div>
    )
}

export default Page
