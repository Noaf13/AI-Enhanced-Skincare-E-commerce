"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useStateContext } from "@/context/StateContext";
import { AiOutlineClose } from "react-icons/ai";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, moveToCart } = useStateContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
       
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            />
              
            <Link
              href="/"
              className="inline-block bg-[#90af9f] text-white px-6 py-3 rounded-md hover:bg-[#7a9a8a] transition font-medium"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-4"
              >
                {/* Product image */}
                {item.image ? (
                  <Link href={`/products/${item.slug}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md cursor-pointer"
                    />
                  </Link>
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="text-sm font-semibold text-gray-900 hover:underline cursor-pointer">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-0.5">£{item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveToCart(item)}
                    className="px-3 py-1.5 bg-[#90af9f] text-white text-xs font-medium rounded-md hover:bg-[#7a9a8a] transition-colors"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-400 transition-colors"
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
