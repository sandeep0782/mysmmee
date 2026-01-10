'use client'

import React from 'react'
import ProductsClient from '../components/ProductFilters'

const Page = () => {
    // We let ProductsClient fetch data via RTK Query
    return <ProductsClient />
}

export default Page
