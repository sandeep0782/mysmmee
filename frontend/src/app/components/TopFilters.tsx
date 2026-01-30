import React from 'react'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'

interface TopFiltersProps {
    sortOption: string
    setSortOption: (value: string) => void
    className?: string // ✅ optional className
}

const TopFilters: React.FC<TopFiltersProps> = ({
    sortOption,
    setSortOption,
    className // ✅ destructure it
}) => {
    return (
        <div className={`flex justify-center items-center ${className || ''}`}>
            <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full h-full flex items-center justify-center">
                    <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">Price Low to High</SelectItem>
                    <SelectItem value="price-high">Price High to Low</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default TopFilters
