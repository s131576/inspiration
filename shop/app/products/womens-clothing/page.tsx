'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '@/app/components/Items/PrudctCard';
import Loading from '@/app/components/loading/Loading';
import OrderModal from '@/app/components/modals/order/OrderModal';
import useStagairStore from '@/shopStore';
import { Product, IOrder } from '@/types';
import { useSession } from 'next-auth/react';

const Page: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [existingOrders, setExistingOrders] = useState<IOrder[]>([]);
  const toggleOrderModal = useStagairStore((state) => state.toggleOrderModal);
  const orderModalOpen = useStagairStore((state) => state.orderModal);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session || !session.user) {
        return;
      }
      const userEmail = session.user.email;
      if (!userEmail) {
        return;
      }
      try {
        const { data } = await axios.get('/api/orders');
        setExistingOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    };

    fetchOrders();
  }, [session, selectedProduct, existingOrders, orderModalOpen]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('https://fakestoreapi.com/products');
        const filteredProducts = data.filter((product: Product) => product.category === "women's clothing");
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const isProductInOrders = (productTitle: string): boolean => {
    return existingOrders.some(order =>
      order.items.some(item => item.name === productTitle)
    );
  };

  const handleProductClick = (product: Product): void => {
    setSelectedProduct(product);
    toggleOrderModal();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='bg-gradient-to-r from-red-500 min-h-screen'>
      {/* Header Section */}
      <header className="bg-gradient-to-r from-pink-500 py-8 text-white text-center shadow-lg">
        <h1 className="text-5xl font-extrabold">Women's Clothing</h1>
        <p className="text-xl mt-2">Discover the latest trends and styles just for you!</p>
      </header>

      {/* Main Content Section */}
      <main className="container mx-auto px-4 py-12">
        <section className="mb-12">
          {/* <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Featured Collections</h2> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id.toString()}
                  category={product.category}
                  name={product.title}
                  image={product.image}
                  price={product.price}
                  rating={product.rating.rate}
                  onClick={() => handleProductClick(product)}
                  isInOrder={isProductInOrders(product.title)}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                <p>No products available in this category.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      {/* Order Modal */}
      {selectedProduct && orderModalOpen && (
        <OrderModal
          product={selectedProduct}
          isInOrder={isProductInOrders(selectedProduct.title)}
        />
      )}
    </div>
  );
};

export default Page;
