import React from 'react'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'

interface TopFiltersProps {
    sortOption: string
    setSortOption: (value: string) => void
}

const TopFilters: React.FC<TopFiltersProps> = ({
    sortOption,
    setSortOption,

}) => {
    
    return (
        <div className="flex justify-between items-center mb-6">
            {/* Sort */}
            <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
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
