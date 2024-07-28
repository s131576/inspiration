'use client'
import ProductCard from '@/app/components/Items/PrudctCard';
import Loading from '@/app/components/loading/Loading';
import OrderModal from '@/app/components/modals/order/OrderModal';
import useStagairStore from '@/shopStore';
import { Product } from '@/types';
import React, { useEffect, useState } from 'react'

const page = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const toggleOrderModal = useStagairStore((state) => state.toggleOrderModal);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        const filteredProducts = data.filter((product: Product) => product.category === "men's clothing");
        setProducts(filteredProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false); 
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(null); 
    setTimeout(() => {
      setSelectedProduct(product);
      toggleOrderModal();
    }, 0);
  };

  return (
    <div className='bg-emerald-600'>
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">@Men's clothing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id.toString()}
              category={product.category}
              name={product.title}
              image={product.image}
              price={product.price}
              rating={product.rating.rate}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      </section>
      {selectedProduct && <OrderModal product={selectedProduct} />}
    </div>
  );
};

export default page