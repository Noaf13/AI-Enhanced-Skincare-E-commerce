/**
 * Product Detail Page Component
 *
 * A dynamic product detail page that fetches product data from Sanity CMS based on URL slug.
 * Displays product information, allows quantity selection, and provides add-to-cart functionality.
 * This is a client-side component that manages local state and interacts with the shopping cart context.
 *
 * @component
 * @example
 * // Route: /products/{product-slug}
 * // Automatically rendered when user navigates to a product URL
 *
 * @returns {JSX.Element} Rendered product detail page with add-to-cart functionality
 *
 * @see {@link Navbar} For the navigation component
 * @see {@link useStateContext} For cart state management
 * @see {@link CartItem} For cart item type definition
 */

"use client";

import React from "react";
import { client } from "../../../sanity/lib/client";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useStateContext } from "../../../context/StateContext";
import { CartItem } from "../../../context/StateContext";
import Navbar from "@/components/Navbar";

/**
 * Product interface defining the structure of product data fetched from Sanity CMS
 * @interface Product
 * @property {string} _id - Unique product identifier from Sanity
 * @property {string} name - Product display name
 * @property {number} price - Product price in GBP
 * @property {string} [image] - Optional product image URL
 * @property {string} [description] - Optional product description
 * @property {Object} slug - URL slug object
 * @property {string} slug.current - Current URL slug for routing
 *
 */

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

/**
 * Component props interface
 * @interface Props
 * @property {Object} params - Route parameters from Next.js dynamic routing
 * @property {string} params.slug - Product slug from URL path
 */

interface Props {
  params: {
    slug: string;
  };
}
/**
 * Fetches product data from Sanity CMS based on slug
 *
 * @async
 * @function getProduct
 * @param {string} slug - Product slug identifier
 * @returns {Promise<Product | null>} Product data object or null if not found/error
 *
 * @example
 * const product = await getProduct('premium-widget');
 *
 * @throws {Error} When Sanity query fails or network error occurs
 */

async function getProduct(slug: string): Promise<Product | null> {
  try {
    //Fetch product from Sanity using GROQ
    const product: Product = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]{
        _id,
        name,
        price,
        "image": image.asset->url,
        description,
        slug
      }`,
      { slug } //query parameter
    );

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
/**
 * Product Detail Page Component
 *
 * Main component that renders product details, quantity selector, and add-to-cart functionality.
 * Fetches product data on mount and updates when slug changes.
 *
 * @param {Props} props - Component properties
 * @param {Object} props.params - Route parameters
 * @param {string} props.params.slug - Product slug from URL
 *
 * @returns {JSX.Element} Product detail page UI
 *
 * @dependencies
 * - React.useState: Manages product state
 * - React.useEffect: Fetches product data on mount/slug change
 * - useStateContext: Provides cart state and actions
 * - getProduct: Fetches product data from Sanity
 * - Navbar: Navigation component
 */

export default function ProductPage({ params }: Props) {
  //state to store the fetched product data
  const [product, setProduct] = React.useState<Product | null>(null);

  const { qty, incQty, decQty, onAdd } = useStateContext();

  React.useEffect(() => {
    const fetchProduct = async () => {
      const productData = await getProduct(params.slug); //fetch product from stored slug
      setProduct(productData); //update state with fetched data
    };

    fetchProduct();
  }, [params.slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        {/* show loading state when product data is being fetched */}
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  /**
   * Handles add to cart button click
   * Creates a CartItem object from current product and quantity, then adds to cart
   *
   * @function handleAddToCart
   * @returns {void}
   *
   * @example
   * // When product price is 29.99 and qty is 2
   * handleAddToCart(); // Adds item with total 59.98 to cart
   */

  const handleAddToCart = () => {
    if (product) {
      const cartItem: CartItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.image,
      };
      onAdd(cartItem, qty);
    }
  };

  return (
    <div>
      {/* Render the navigation bar */}
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto lg:max-w-none">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
              <div className="w-full">
                <img
                  src={product.image || "/placeholder-image.jpg"}
                  alt={product.name}
                  className="w-full h-full object-center object-cover sm:rounded-lg shadow-lg"
                />
              </div>

              {/* Product detail setion */}
              <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                {/* Product name */}
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  {product.name}
                </h1>

                {/* Product price */}
                <div className="mt-3">
                  <p className="text-3xl text-gray-900 font-semibold">
                    £{product.price}
                  </p>
                </div>

                {/* Product description */}
                <div className="mt-6">
                  {product.description && (
                    <div className="text-base text-gray-700">
                      <p className="text-sm">{product.description}</p>
                    </div>
                  )}
                </div>

                {/* Quantity selector  */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-900">
                    Quantity
                  </h3>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={decQty}
                      className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    >
                      <AiOutlineMinus className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="mx-4 text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={incQty}
                      className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    >
                      <AiOutlinePlus className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Add to cart button */}
                <div className="mt-8">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-pink-300 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add to cart
                  </button>
                </div>

                {/* Buy now button */}
                <div className="mt-4">
                  <button className="w-full bg-pink-300 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
