'use client'
import ProductCard from '@/app/components/Items/PrudctCard';
import Loading from '@/app/components/loading/Loading';
import { Product } from '@/types';
import React, { useEffect, useState } from 'react'

const page = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        // Filter products with rating above 3
        const filteredProducts = data.filter((product: Product) => (product.category==="electronics"));
        setProducts(filteredProducts);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <div className='bg-emerald-600'>
         <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">@Electronics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id.toString()}
              category={product.category}
              name={product.title}
              image={product.image}
              price={product.price} // Pass price as number
              rating={product.rating.rate}
            />
          ))}
        </div>
      </section>

    </div>
  )
}

export default page