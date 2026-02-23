"use client";

import { useState, useMemo } from "react";

//shape of product coming from sanity
export interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  slug: { current: string };
  categoryName?: string;
  skinType?: string[];
  ingredients?: string[];
}

//all the filters the user can change
export interface FilterState {
  searchQuery: string;
  category: string | null;
  maxPrice: number;
  skinTypes: string[];
  ingredients: string[];
}

export function useFilters(products: Product[]) {

  //starting state - nothing filtered yet
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    category: null,
    maxPrice: 100,
    skinTypes: [],
    ingredients: [],
  });

  //pull out all the unique category names from products so the sidebar knows what to show
  const availableCategories = useMemo(() => {
    const categoryNames = new Set<string>();

    for (let i = 0; i < products.length; i++) {
      if (products[i].categoryName) {
        categoryNames.add(products[i].categoryName!);
      }
    }
    //set ignores duplicates so we only get each category once
    return Array.from(categoryNames).sort();
  }, [products]);

  //same thing but for skin types
  const availableSkinTypes = useMemo(() => {
    const skinTypeNames = new Set<string>();

    for (let i = 0; i < products.length; i++) {
      const types = products[i].skinType || [];
      for (let j = 0; j < types.length; j++) {
        skinTypeNames.add(types[j]);
      }
    }

    return Array.from(skinTypeNames).sort();
  }, [products]);

  //same thing but for ingredients
  const availableIngredients = useMemo(() => {
    const ingredientNames = new Set<string>();

    for (let i = 0; i < products.length; i++) {
      const ings = products[i].ingredients || [];
      for (let j = 0; j < ings.length; j++) {
        ingredientNames.add(ings[j]);
      }
    }

    return Array.from(ingredientNames).sort();
  }, [products]);

  //find the most expensive product so the slider knows where to stop
  const highestPrice = useMemo(() => {
    if (products.length === 0) return 100;

    let max = 0;
    for (let i = 0; i < products.length; i++) {
      if (products[i].price > max) {
        max = products[i].price;
      }
    }

    return Math.ceil(max);
  }, [products]);

  //main filter logic - each product goes through every check
  const filteredProducts = useMemo(() => {
    const results: Product[] = [];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      let passesAll = true;

      //search - check if name or description matches what they typed
      if (filters.searchQuery !== "") {
        const query = filters.searchQuery.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(query);
        const descMatch = product.description
          ? product.description.toLowerCase().includes(query)
          : false;

        if (!nameMatch && !descMatch) {
          passesAll = false;
        }
      }

      //category - has to match exactly
      if (passesAll && filters.category !== null) {
        if (product.categoryName !== filters.category) {
          passesAll = false;
        }
      }

      //price - has to be under the max they set
      if (passesAll && product.price > filters.maxPrice) {
        passesAll = false;
      }

      //skin type - product needs to match at least one they ticked (OR logic)
      if (passesAll && filters.skinTypes.length > 0) {
        const productSkinTypes = product.skinType || [];
        let foundMatch = false;

        for (let j = 0; j < filters.skinTypes.length; j++) {
          if (productSkinTypes.includes(filters.skinTypes[j])) {
            foundMatch = true;
            break;
            //no point checking the rest once we found a match
          }
        }

        if (!foundMatch) {
          passesAll = false;
        }
      }

      //ingredients - product needs ALL the ones they ticked (AND logic)
      if (passesAll && filters.ingredients.length > 0) {
        const productIngredients = product.ingredients || [];

        for (let j = 0; j < filters.ingredients.length; j++) {
          if (!productIngredients.includes(filters.ingredients[j])) {
            passesAll = false;
            break;
            //if even one is missing theres no point checking the rest
          }
        }
      }

      //passed everything so add it to results
      if (passesAll) {
        results.push(product);
      }
    }

    return results;
  }, [products, filters]);

  //count how many filters are active for the badge
  let activeFilterCount = 0;
  if (filters.searchQuery !== "") activeFilterCount++;
  if (filters.category !== null) activeFilterCount++;
  if (filters.maxPrice < highestPrice) activeFilterCount++;
  activeFilterCount += filters.skinTypes.length;
  activeFilterCount += filters.ingredients.length;

  // --- actions to update filters ---

  function setSearchQuery(query: string) {
    setFilters({ ...filters, searchQuery: query });
  }

  function setCategory(category: string | null) {
    setFilters({ ...filters, category: category });
  }

  function setMaxPrice(price: number) {
    setFilters({ ...filters, maxPrice: price });
  }

  //toggle = if its already ticked remove it, if not add it
  function toggleSkinType(skinType: string) {
    if (filters.skinTypes.includes(skinType)) {
      const updated = filters.skinTypes.filter((t: string) => t !== skinType);
      setFilters({ ...filters, skinTypes: updated });
    } else {
      setFilters({ ...filters, skinTypes: [...filters.skinTypes, skinType] });
    }
  }

  function toggleIngredient(ingredient: string) {
    if (filters.ingredients.includes(ingredient)) {
      const updated = filters.ingredients.filter((i: string) => i !== ingredient);
      setFilters({ ...filters, ingredients: updated });
    } else {
      setFilters({ ...filters, ingredients: [...filters.ingredients, ingredient] });
    }
  }

  //reset everything back to default
  function clearAllFilters() {
    setFilters({
      searchQuery: "",
      category: null,
      maxPrice: highestPrice,
      skinTypes: [],
      ingredients: [],
    });
  }

  //give everything back to the component that uses this hook
  return {
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
  };
}