"use client";

import { useStateContext } from '@/context/StateContext';
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
  const handleAddToCart = () => {
    const cartItem = {
      _id: product._id,  name: product.name,price: product.price,
      quantity: 1,
      image: product.image
    };
    onAdd(cartItem, 1);
  };

  return (
    <button
      onClick={handleAddToCart}
      className=" bg-[#90af9f] text-white py-3 px-6 rounded-lg hover:bg-[#7a9a8a] transition-all duration-200 font-medium text-sm uppercase tracking-wide shadow-md hover:shadow-lg transform hover:scale-105 w-full"
    >
      Add to cart
    </button>
  );
}