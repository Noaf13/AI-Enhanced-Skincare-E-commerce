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

// expanded product interface to include the new fields needed for filtering
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
  // updated query to also fetch skintype + ingredients for the filter system
  // removed the [0...6] limit so all products show
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
      {/* moved product grid into its own component to keep this file clean and add filtering */}
      <ProductSection products={products} />
    </main>
  );
}