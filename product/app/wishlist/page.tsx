/**
 * Wishlist Page Component
 *
 * Shows all items the user has saved to their wishlist.
 * Wishlist state comes from StateContext and is persisted in localStorage per user.
 * Items can be moved to cart or removed directly from this page.
 *
 * @component
 * @returns {JSX.Element} wishlist items or empty state
 *
 * @dependencies
 * - useStateContext: wishlist state and actions
 * - StateContext: wishlistItems, removeFromWishlist, moveToCart
 */
"use client";

import React from "react";
import Navbar from "@/components/Navbar";

import Link from "next/link";
import { useStateContext } from "@/context/StateContext";
import { AiOutlineClose } from "react-icons/ai";
import { BsImage } from "react-icons/bs"; // fallback for items with for image
import { BsHeartbreak } from "react-icons/bs"; // empty state icon

/**
 * WishlistPage
 *
 * client component - needs to read wishlist state from context
 * shows each wishlisted item with an image, name, price and two actions
 *
 * @returns {JSX.Element}
 */
export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, moveToCart } = useStateContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-400 mt-1">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {/* empty state */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
            <BsHeartbreak className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-1">Your wishlist is empty</p>
            <p className="text-gray-400 text-sm mb-5">
              Save items you like by clicking the heart icon on any product.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#90af9f] text-white px-5 py-2 rounded hover:bg-[#7a9a8a] transition text-sm font-medium"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
              >
                {/* product image - links to product page */}
                {item.image ? (
                  <Link href={`/products/${item.slug}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded cursor-pointer"
                    />
                  </Link>
                ) : (
                  // no image fallback
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center shrink-0">
                    <BsImage className="w-5 h-5 text-gray-300" />
                  </div>
                )}

                {/* name + price */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="text-sm font-semibold text-gray-900 hover:underline cursor-pointer">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-0.5">£{item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* moves item to cart and removes from wishlist */}
                  <button
                    onClick={() => moveToCart(item)}
                    className="px-3 py-1.5 bg-[#90af9f] text-white text-xs font-medium rounded hover:bg-[#7a9a8a] transition"
                  >
                    Add to Cart
                  </button>

                  {/* remove from wishlist */}
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-400 transition"
                    title="Remove from wishlist"
                  >
                    <AiOutlineClose className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}