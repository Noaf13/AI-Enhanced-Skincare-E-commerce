"use client";


import React from 'react';
import { client } from '../../../sanity/lib/client';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { useStateContext } from '../../../context/StateContext'; 
import { CartItem } from '../../../context/StateContext';
import Navbar from '@/components/Navbar';


//setting up product interface
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


interface Props {
  params: {
    slug: string;
  };
}


async function getProduct(slug: string): Promise<Product | null> {
  try {
    const product: Product = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]{
        _id,
        name,
        price,
        "image": image.asset->url,
        description,
        slug
      }`,
      { slug }
    );


    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}


export default function ProductPage({ params }: Props) {
  const [product, setProduct] = React.useState<Product | null>(null);
  const { qty, incQty, decQty, onAdd } = useStateContext();


  React.useEffect(() => {
    const fetchProduct = async () => {
      const productData = await getProduct(params.slug);
      setProduct(productData);
    };


    fetchProduct();
  }, [params.slug]);


  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }


  const handleAddToCart = () => {
    if (product) {
      const cartItem: CartItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.image
      };
      onAdd(cartItem, qty);
    }
  };


  return (
    <div>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 py-8 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto lg:max-w-none">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
              <div className="w-full">
                <img
                  src={product.image || '/placeholder-image.jpg'}
                  alt={product.name}
                  className="w-full h-full object-center object-cover sm:rounded-lg shadow-lg"
                />
              </div>


            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {product.name}
              </h1>


              <div className="mt-3">
                <p className="text-3xl text-gray-900 font-semibold">
                  £{product.price}
                </p>
              </div>


              <div className="mt-6">
                {product.description && (
                  <div className="text-base text-gray-700">
                    <p className='text-sm'>{product.description}</p>
                  </div>
                )}
              </div>


              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
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


              <div className="mt-8">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-pink-300 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add to cart
                </button>
              </div>


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
