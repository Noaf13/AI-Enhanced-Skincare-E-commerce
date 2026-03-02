/**
 * Home Page Component
 *
 * Main landing page displaying a hero banner and a filterable grid of products.
 * Fetches product data including category, skinType, and ingredients from Sanity CMS.
 * Server component — passes data to client-side ProductSection for filtering.
 *
 * @component
 * @async
 */
import Navbar from "@/components/Navbar";
import Herobanner from "@/components/HeroBanner";
import { client } from "@/sanity/lib/client";
import ProductSection from "@/components/ProductSection";

interface Product {
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

export default async function HomePage() {
  /**
   * Fetch products with skintype and ingredients for filtering system
   */
  const products: Product[] = await client.fetch(
    `*[_type == "product" && stock == true]{
      _id,
      name,
      price,
      "image": image.asset->url,
      description,
      slug,
      "categoryName": category->name,
      skinType,
      ingredients
    }`
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <Herobanner />
      {/* Made seperate product section to add the filtering system and improve file organisation */}
      <ProductSection products={products} />
    </main>
  );
}