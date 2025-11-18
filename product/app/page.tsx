import Image from "next/image";
import Navbar from "@/components/Navbar";
import Herobanner from "@/components/HeroBanner"
import { client } from "@/sanity/lib/client";
import Link from "next/link";

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

  return (

    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar/>
      <Herobanner></Herobanner>

    
      <section id="bestsellers" className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Best Sellers</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              {/* Wrap only the clickable parts in Link */}
              <Link href={`/products/${p.slug.current}`}>
                <div className="cursor-pointer">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={300}
                      height={300}
                      className="w-full h-60 object-cover rounded-md mb-3"
                    />
                  )}
                  <h3 className="text-lg font-semibold ">
                    {p.name}
                  </h3>
                </div>
              </Link>
              
              <p className="text-gray-600 mb-2">£{p.price}</p>
              <div className="flex justify-center">
                <button 
                  style={{
                    backgroundColor:'#90af9f', 
                    color:'white',
                    padding:6,
                    borderRadius:9999
                  }} 
                  className="hover:shadow-lg transition"
                >
                  add to basket
                </button>
              </div>
            </div> 
          ))}   
        </div>
      </section>
    </main>
  );
}