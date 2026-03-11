"use client";

import { useStateContext, WishlistItem } from "@/context/StateContext";
import { FiHeart } from 'react-icons/fi';   // outline
import { FaHeart } from 'react-icons/fa';  //filled in 

interface WishlistButtonProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    slug: { current: string };
  };
}

export default function WishlistButton({ product }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useStateContext();

  const wishlisted = isInWishlist(product._id);

  function handleClick() {
    if (wishlisted) {
      removeFromWishlist(product._id);
    } else {
      //create a wishlist item from the product data
      const wishlistItem: WishlistItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug.current,
      };
      addToWishlist(wishlistItem);
    }
  }

  return (
  <button
      onClick={handleClick}
      title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {wishlisted ? (
        <FaHeart className="w-5 h-5 text-pink-300" />
      ) : (
        <FiHeart className="w-5 h-5 text-gray-400 hover:text-pink-300 " />
      )}
    </button>
  );
}