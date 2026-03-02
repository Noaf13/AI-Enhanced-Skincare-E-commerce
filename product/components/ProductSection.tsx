"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import FilterSidebar from "@/components/FilterSidebar";
import { useFilters, Product } from "@/hooks/useFilters";

interface ProductSectionProps {
  products: Product[];
}

//readable labels so we show "Hyaluronic Acid" not "hyaluronic-acid"
const SKIN_TYPE_LABELS: Record<string, string> = {
  normal: "Normal",
  oily: "Oily",
  dry: "Dry",
  combination: "Combination",
  sensitive: "Sensitive",
  all: "All Skin Types",
};

const INGREDIENT_LABELS: Record<string, string> = {
  "hyaluronic-acid": "Hyaluronic Acid",
  "vitamin-c": "Vitamin C",
  retinol: "Retinol",
  niacinamide: "Niacinamide",
  "salicylic-acid": "Salicylic Acid",
  ceramides: "Ceramides",
  "aha-bha": "AHA/BHA",
  spf: "SPF",
  "aloe-vera": "Aloe Vera",
  "tea-tree": "Tea Tree",
  peptides: "Peptides",
  squalane: "Squalane",
};

export default function ProductSection({ products }: ProductSectionProps) {
  //get everything we need from the filter hook
  const {
    filters,
    filteredProducts,
    availableCategories,
    availableSkinTypes,
    availableIngredients,
    highestPrice,
    activeFilterCount,
    setSearchQuery,
    setCategory,
    setMaxPrice,
    toggleSkinType,
    toggleIngredient,
    clearAllFilters,
  } = useFilters(products);

  return (
    <section id="bestsellers" className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center sm:text-left">
          Best Sellers
        </h2>
        {/* show how many products match the current filters */}
        <p className="text-sm text-gray-400 mt-1">
          {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""}
          {activeFilterCount > 0 && " found"}
        </p>
      </div>

      {/* little tags showing whats currently filtered - can click x to remove each one */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {filters.searchQuery && (
            <FilterTag
              label={`"${filters.searchQuery}"`}
              onRemove={() => setSearchQuery("")}
            />
          )}
          {filters.category && (
            <FilterTag
              label={filters.category}
              onRemove={() => setCategory(null)}
            />
          )}
          {filters.maxPrice < highestPrice && (
            <FilterTag
              label={`Under £${filters.maxPrice}`}
              onRemove={() => setMaxPrice(highestPrice)}
            />
          )}
          {filters.skinTypes.map((t: string) => (
            <FilterTag
              key={t}
              label={SKIN_TYPE_LABELS[t] || t}
              onRemove={() => toggleSkinType(t)}
            />
          ))}
          {filters.ingredients.map((i: string) => (
            <FilterTag
              key={i}
              label={INGREDIENT_LABELS[i] || i}
              onRemove={() => toggleIngredient(i)}
            />
          ))}
          <button
            onClick={clearAllFilters}
            className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* sidebar with search and filters */}
        <div className="w-60 flex-shrink-0">
          <div className="sticky top-6 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <FilterSidebar
              searchQuery={filters.searchQuery}
              category={filters.category}
              maxPrice={filters.maxPrice}
              skinTypes={filters.skinTypes}
              ingredients={filters.ingredients}
              availableCategories={availableCategories}
              availableSkinTypes={availableSkinTypes}
              availableIngredients={availableIngredients}
              highestPrice={highestPrice}
              activeFilterCount={activeFilterCount}
              setSearchQuery={setSearchQuery}
              setCategory={setCategory}
              setMaxPrice={setMaxPrice}
              toggleSkinType={toggleSkinType}
              toggleIngredient={toggleIngredient}
              clearAllFilters={clearAllFilters}
            />
          </div>
        </div>

        {/* product grid */}
        <div className="flex-1">
          {/* empty state when no products match */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-1">No products found</p>
              <p className="text-gray-400 text-sm mb-4">
                Try adjusting your filters or search query.
              </p>
              <button
                onClick={clearAllFilters}
                className="text-sm font-medium text-[#90af9f] hover:text-[#7a9a8a] underline underline-offset-2"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product: Product) => (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col"
                >
                  <Link href={`/products/${product.slug.current}`}>
                    <div className="cursor-pointer">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-60 object-cover rounded-md mb-3"
                        />
                      )}
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                    </div>
                  </Link>

                  {/* little tags showing skin type and ingredients on each card */}
                  {(product.skinType?.length || product.ingredients?.length) && (
                    <div className="flex flex-wrap gap-1 mt-1.5 mb-2">
                      {product.skinType?.slice(0, 2).map((t: string) => (
                        <span
                          key={t}
                          className="text-[10px] font-medium uppercase tracking-wide bg-[#90af9f]/10 text-[#6b8f7f] px-2 py-0.5 rounded-full"
                        >
                          {SKIN_TYPE_LABELS[t] || t}
                        </span>
                      ))}
                      {product.ingredients?.slice(0, 2).map((i: string) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium uppercase tracking-wide bg-pink-50 text-pink-400 px-2 py-0.5 rounded-full"
                        >
                          {INGREDIENT_LABELS[i] || i}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-gray-600 mb-2">£{product.price}</p>
                  <div className="mt-auto">
                    {/* push button to the bottom */}
                    <AddToCartButton product={product} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// remove filters 
function FilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium pl-3 pr-1.5 py-1 rounded-full">
      {label}
      <button
        onClick={onRemove}
        className="p-0.5 rounded-full hover:bg-gray-200"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}