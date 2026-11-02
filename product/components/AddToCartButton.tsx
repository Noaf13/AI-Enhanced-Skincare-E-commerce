/**
 * Add to Cart Button Component
 *
 * Client-side button component for adding products to the shopping cart.
 * Provides visual feedback during the add operation and prevents multiple clicks.
 * Integrates with the global cart state context for state management.
 *
 * @component
 * @param {AddToCartButtonProps} props - Component properties
 * @param {Product} props.product - Product to add to cart
 * @returns {JSX.Element} Interactive add to cart button with loading state
 *
 * @example
 * // Usage in product card
 * <AddToCartButton product={product} />
 *
 * @dependencies
 * - useStateContext: Global cart state management
 * - React.useState: Local loading state management
 *
 * @features
 * - Loading state during async operation
 * - Disabled state during loading
 * - Visual feedback with hover effects
 * - Prevents double-clicking
 */
"use client";

import { useStateContext } from "@/context/StateContext";
import React from "react";
//state context for cart logic

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  slug: {
    current: string;
  };
}

interface AddToCartButtonProps {
  product: Product;
  //so typescript doesnt show error (def)
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { onAdd } = useStateContext();
  //add is loadng state for visual feedback-track waiting for server
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddToCart = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const cartItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      };
      await onAdd(cartItem, 1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className=" bg-[#90af9f] text-white py-3 px-6 rounded-lg hover:bg-[#7a9a8a] transition-all duration-200 font-medium text-sm uppercase tracking-wide shadow-md hover:shadow-lg transform hover:scale-105 w-full"
    >
      {isLoading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
