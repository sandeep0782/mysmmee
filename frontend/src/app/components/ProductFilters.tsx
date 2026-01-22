import React, { useState } from "react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { filters } from "@/constant/Filter";
import { Search, X } from "lucide-react";
import { useGetBrandsQuery, useGetCategoriesQuery, useGetColorsQuery } from "@/store/api";

interface ProductFiltersProps {
    selectedBrand: string[];
    selectedGender: string[];
    selectedColor: string[];
    selectedCategory: string[];
    toggleFilter: (section: string, item: string) => void;
    hideBrandFilter?: boolean

}

const ProductFilters: React.FC<ProductFiltersProps> = ({
    selectedBrand,
    selectedGender,
    selectedColor,
    selectedCategory,
    toggleFilter,
    hideBrandFilter = false

}) => {
    const { data: colorResponse } = useGetColorsQuery({});
    const colors = colorResponse?.data || [];

    const { data: brandResponse } = useGetBrandsQuery({});
    const brands = brandResponse?.data || [];
    const { gender } = filters;

    const { data: categoryResponse } = useGetCategoriesQuery({});
    const category = categoryResponse?.data || [];

    // States
    const [colorSearch, setColorSearch] = useState("");
    const [searchColorActive, setSearchColorActive] = useState(false);

    const [brandSearch, setBrandSearch] = useState("");
    const [searchBrandActive, setSearchBrandActive] = useState(false);

    const visibleCount = 10;

    const filteredColors = colors.filter((col: any) =>
        col.name.toLowerCase().includes(colorSearch.toLowerCase())
    );
    const visibleColors = filteredColors.slice(0, visibleCount);
    const remainingColorCount = filteredColors.length - visibleColors.length;

    const filteredBrands = brands.filter((brand: any) =>
        brand.name.toLowerCase().includes(brandSearch.toLowerCase())
    );
    const visibleBrands = filteredBrands.slice(0, visibleCount);
    const remainingBrandCount = filteredBrands.length - visibleBrands.length;

    const getLabel = (item: any) =>
        typeof item === "string" ? item : item?.name || "";

    return (
        <Accordion
            type="multiple"
            defaultValue={["brand", "gender", "color", "category"]}
            className="bg-white p-6 border"
        >
            {/* BRAND */}
            {!hideBrandFilter && (
                <AccordionItem value="brand">
                    <AccordionTrigger
                        className="text-base font-semibold text-black uppercase [&>svg]:hidden"
                        onClick={(e) => e.preventDefault()}
                    >
                        <div className="mb-2">Brand</div>
                        {/* Brand Search */}
                        <div className="flex items-center justify-end">
                            {!searchBrandActive ? (
                                <div
                                    onClick={() => setSearchBrandActive(true)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <Search size={18} />
                                </div>
                            ) : (
                                <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="text"
                                        placeholder="Search brand..."
                                        value={brandSearch}
                                        onChange={(e) => setBrandSearch(e.target.value)}
                                        className="w-full p-2 py-1 border rounded-md text-sm pr-8"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => {
                                            setSearchBrandActive(false);
                                            setBrandSearch("");
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {/* Brand List */}
                            {visibleBrands.map((brand: any) => {
                                const checked = selectedBrand.includes(brand._id) || selectedBrand.includes(brand.slug);
                                return (
                                    <div
                                        key={brand._id}
                                        className="flex items-center space-x-2 cursor-pointer"
                                        onClick={() => toggleFilter("brand", brand._id)}
                                    >
                                        <Checkbox
                                            checked={checked}
                                            className="accent-primary w-4 h-4 border border-primary"
                                        />
                                        <label className="text-sm font-medium">{brand.name}</label>
                                    </div>
                                );
                            })}

                            {/* Remaining Count */}
                            {remainingBrandCount > 0 && (
                                <div className="text-sm text-red-500">
                                    +{remainingBrandCount} More Brand{remainingBrandCount > 1 ? "s" : ""}
                                </div>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            )}

            {/* GENDER */}
            <AccordionItem value="gender">
                <AccordionTrigger className="text-base font-semibold text-black uppercase [&>svg]:hidden">
                    Gender
                </AccordionTrigger>
                <AccordionContent>
                    <div className="mt-2 space-y-2">
                        {gender.map((gen, index) => {
                            const label = getLabel(gen);
                            const checked = selectedGender.includes(label);
                            return (
                                <div
                                    key={`gender-${label}-${index}`}
                                    className="flex items-center space-x-2 cursor-pointer"
                                    onClick={() => toggleFilter("gender", label)}
                                >
                                    <Checkbox checked={checked}
                                        className="accent-primary w-4 h-4 border border-primary"
                                    />
                                    <label className="text-sm font-medium">{label}</label>
                                </div>
                            );
                        })}
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* COLOR */}
            <AccordionItem value="color">
                <AccordionTrigger
                    className="text-base font-semibold text-black uppercase [&>svg]:hidden"
                    onClick={(e) => e.preventDefault()}
                >
                    <div className="mb-2">
                        Color
                    </div>
                    {/* Color Search */}
                    <div className="flex items-center justify-end">
                        {!searchColorActive ? (
                            <div
                                onClick={() => setSearchColorActive(true)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <Search size={18} />
                            </div>
                        ) : (
                            <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="text"
                                    placeholder="Search color..."
                                    value={colorSearch}
                                    onChange={(e) => setColorSearch(e.target.value)}
                                    className="w-full p-2 py-1 border rounded-md text-sm pr-8"
                                    autoFocus
                                />
                                <button
                                    onClick={() => {
                                        setSearchColorActive(false);
                                        setColorSearch("");
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2">

                        {/* Color List */}
                        {visibleColors.map((col: any) => {
                            const checked = selectedColor.includes(col._id);
                            return (
                                <div
                                    key={col._id}
                                    className="flex items-center space-x-2 cursor-pointer"
                                    onClick={() => toggleFilter("color", col._id)}
                                >
                                    <Checkbox checked={checked}
                                        className="accent-primary w-4 h-4 border border-primary"

                                    />
                                    <span
                                        className="h-4 w-4 rounded-full border border-gray-300"
                                        style={{ backgroundColor: col.hexCode || "#ccc" }}
                                    />
                                    <label className="text-sm font-medium">{col.name}</label>
                                </div>
                            );
                        })}

                        {/* Remaining Count */}
                        {remainingColorCount > 0 && (
                            <div className="text-sm text-red-500">
                                +{remainingColorCount} More Color{remainingColorCount > 1 ? "s" : ""}
                            </div>
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* CATEGORY */}
            <AccordionItem value="category">
                <AccordionTrigger className="text-base font-semibold text-black uppercase [&>svg]:hidden">
                    Category
                </AccordionTrigger>
                <AccordionContent>
                    <div className="mt-2 space-y-2">
                        {category.map((cat: any) => {
                            const checked = selectedCategory.includes(cat._id);
                            return (
                                <div
                                    key={cat._id}
                                    className="flex items-center space-x-2 cursor-pointer"
                                    onClick={() => toggleFilter("category", cat._id)}
                                >
                                    <Checkbox checked={checked}
                                        className="accent-primary w-4 h-4 border border-primary"
                                    />
                                    <label className="text-sm font-medium">{cat.name}</label>
                                </div>
                            );
                        })}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default ProductFilters;
