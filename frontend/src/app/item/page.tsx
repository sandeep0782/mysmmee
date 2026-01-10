'use client'

import React, { useState } from 'react'
import ProductsClient from '../components/ProductFilters'

const Page = () => {
    const [selectedBrand, setSelectedBrand] = useState<string[]>([])
    const [selectedGender, setSelectedGender] = useState<string[]>([])
    const [selectedColor, setSelectedColor] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string[]>([])

    const toggleFilter = (section: string, value: string) => {
        const updateFilter = (prev: string[]) =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]

        switch (section) {
            case 'brand':
                setSelectedBrand(updateFilter)
                break
            case 'gender':
                setSelectedGender(updateFilter)
                break
            case 'color':
                setSelectedColor(updateFilter)
                break
            case 'category':
                setSelectedCategory(updateFilter)
                break
        }
    }

    return (
        <ProductsClient
            selectedBrand={selectedBrand}
            selectedGender={selectedGender}
            selectedColor={selectedColor}
            selectedCategory={selectedCategory}
            toggleFilter={toggleFilter}
        />
    )
}

export default Page
