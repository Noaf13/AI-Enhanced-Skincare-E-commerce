"use client";

import React, { useState } from "react";

interface FilterSidebarProps {
  searchQuery: string;
  category: string | null;
  maxPrice: number;
  skinTypes: string[];
  ingredients: string[];
  availableCategories: string[];
  availableSkinTypes: string[];
  availableIngredients: string[];
  highestPrice: number;
  activeFilterCount: number;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string | null) => void;
  setMaxPrice: (price: number) => void;
  toggleSkinType: (skinType: string) => void;
  toggleIngredient: (ingredient: string) => void;
  clearAllFilters: () => void;
}

//Labels for products to show info
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

//colalpsable section
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left group"
      >
        <span className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
          {title}
        </span>
        {/* arrow flips when open */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 group-hover:text-gray-600 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* animate open/close */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function FilterSidebar({
  searchQuery,
  category,
  maxPrice,
  skinTypes,
  ingredients,
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
}: FilterSidebarProps) {
  return (
    <aside className="w-full">
      {/* header with filter count badge */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-[#90af9f] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-medium text-[#90af9f] hover:text-[#7a9a8a]  underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#90af9f]/30 focus:border-[#90af9f]"
          />
          {/* clear button only shows when theres text */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100"
            >
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* category - single select, click again to deselect */}
      {availableCategories.length > 0 && (
        <FilterSection title="Category">
          <div className="space-y-1.5">
            {availableCategories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setCategory(category === cat ? null : cat)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                  category === cat
                    ? "bg-[#90af9f]/10 text-[#6b8f7f] font-semibold border border-[#90af9f]/30"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* price - single slider for max price */}
      <FilterSection title="Price Range">
        <div className="px-1">
          <div className="text-sm text-gray-600 mb-3 font-medium">
            Up to £{maxPrice}
          </div>
          <input
            type="range"
            min={0}
            max={highestPrice}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#90af9f]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>£0</span>
            <span>£{highestPrice}</span>
          </div>
        </div>
      </FilterSection>

      {/* skin type - multi select with checkboxes */}
      {availableSkinTypes.length > 0 && (
        <FilterSection title="Skin Type">
          <div className="space-y-1">
            {availableSkinTypes.map((type: string) => (
              <label
                key={type}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={skinTypes.includes(type)}
                  onChange={() => toggleSkinType(type)}
                  className="w-4 h-4 rounded border-gray-300 text-[#90af9f] focus:ring-[#90af9f] focus:ring-offset-0 cursor-pointer"
                />
                <span
                  className={`text-sm ${
                    skinTypes.includes(type)
                      ? "text-gray-900 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {SKIN_TYPE_LABELS[type] || type}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* ingredients - multi select, closed by default so it doesnt take up too much space */}
      {availableIngredients.length > 0 && (
        <FilterSection title="Key Ingredients" defaultOpen={false}>
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
            {availableIngredients.map((ing: string) => (
              <label
                key={ing}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={ingredients.includes(ing)}
                  onChange={() => toggleIngredient(ing)}
                  className="w-4 h-4 rounded border-gray-300 text-[#90af9f] focus:ring-[#90af9f] focus:ring-offset-0 cursor-pointer"
                />
                <span
                  className={`text-sm ${
                    ingredients.includes(ing)
                      ? "text-gray-900 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {INGREDIENT_LABELS[ing] || ing}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}
    </aside>
  );
}