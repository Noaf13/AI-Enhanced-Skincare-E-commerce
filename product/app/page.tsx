/**
 * Home Page Component
 *
 * Main landing page displaying a hero banner and a grid of best-selling products.
 * Fetches product data from Sanity CMS and renders product cards with add-to-cart functionality.
 * This is a server component that fetches data at build/request time.
 *
 * @component
 * @async
 * @returns {Promise<JSX.Element>} Home page with hero banner and product grid
 *
 * @example
 * // Automatically renders at the root URL (/)
 * // Shows 6 best-selling products in stock
 *
 * @dependencies
 * - sanity/lib/client: Sanity CMS client for data fetching
 * - components/Navbar: Navigation component
 * - components/HeroBanner: Hero section component
 * - components/AddToCartButton: Cart interaction component
 * - next/image: Optimized image component
 * - next/link: Client-side navigation
 */
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Herobanner from "@/components/HeroBanner";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";

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

export default async function HomePage() {
  /**
   * Fetches best-selling products from Sanity CMS
   * Query filters for in-stock products and limits to first 6
   * @constant {Product[]} products - Array of product objects
   */
  const products: Product[] = await client.fetch(
    `*[_type == "product" && stock == true][0...6]{
      _id,
      name,
      price,
     "image": image.asset->url,
      description,
      slug
    }`
  );
  //fetch product lists from client

  /**
   * HomePage Component
   *
   * Async server component that fetches and displays best-selling products.
   * Renders a hero banner followed by a responsive grid of product cards.
   *
   * @async
   * @returns {Promise<JSX.Element>} Complete home page layout
   *
   * @note Runs on server at build time or request time (Static/SSG or SSR)
   */

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navigation bar at the top of the screen */}
      <Navbar />
      {/* Hero banner section with carousel */}
      <Herobanner></Herobanner>

      {/* Best sellers product section */}
      <section id="bestsellers" className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Best Sellers</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col h-f"
            >
              <Link href={`/products/${p.slug.current}`}>
                <div className="cursor-pointer">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={300}
                      height={300}
                      className="w-full h-60 object-cover rounded-md mb-3 "
                    />
                  )}
                  <h3 className="text-lg font-semibold ">{p.name}</h3>
                </div>
              </Link>

              <p className="text-gray-600 mb-2">£{p.price}</p>
              <div className="mt-auto">
                {/* push button to the bottom  */}
                <AddToCartButton product={p} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
