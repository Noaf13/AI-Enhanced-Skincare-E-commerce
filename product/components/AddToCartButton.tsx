"use client";

import { useStateContext } from '@/context/StateContext';
import React from 'react';
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
  //add isloaidng state for visual feedback-track waiting for server
  const[isLoading,setIsLoading] = React.useState(false);

  const handleAddToCart = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try{
    const cartItem = {
      _id: product._id,  name: product.name,price: product.price,
      quantity: 1,
      image: product.image
    };
    await onAdd(cartItem, 1);}
    finally{
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled = {isLoading}
      className=" bg-[#90af9f] text-white py-3 px-6 rounded-lg hover:bg-[#7a9a8a] transition-all duration-200 font-medium text-sm uppercase tracking-wide shadow-md hover:shadow-lg transform hover:scale-105 w-full"
    >
      {isLoading ? 'Adding...':'Add to Cart'}
    </button>
  );
}