"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/sanity/lib/chatbot/types';

/**
 * @interface Props
 * @property {Product} product - product data returned from the chat api
 */
interface Props {
  product: Product;
}

/**
 * ProductCard
 *
 * small product card rendered inside chat bot messages
 * shows the product image, name, price and a link to the product page
 * only renders when the bot returns product recommendations
 *
 * @param {Props} props
 * @returns {JSX.Element}
 */
export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        {product.image && (
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="rounded-md object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 truncate">
            {product.name}


          </h4>
          <p className="text-lg font-bold text-[#90af9f] mt-1">
            £{product.price.toFixed(2)}
          </p>
          {/* links to the product detail page */}
          <Link
            href={`/products/${product.slug.current}`}
            
            className="inline-block mt-2 text-xs bg-[#90af9f] text-white px-3 py-1 rounded hover:bg-[#7a9a8a] transition"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
}