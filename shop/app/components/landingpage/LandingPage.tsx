'use client';
import React, { useEffect, useState } from 'react';
import { Product, IOrder } from '@/types';
import Loading from '../loading/Loading';
import OrderModal from '../modals/order/OrderModal';
import useStagairStore from '@/shopStore';
import { Video } from '../video/Video';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import ProductCard from '../Items/PrudctCard';

const Landingpage= () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [existingOrders, setExistingOrders] = useState<IOrder[]>([]);
  const orderModalOpen = useStagairStore((state) => state.orderModal);
  const toggleOrderModal = useStagairStore((state) => state.toggleOrderModal);
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
        const response = await axios.get(`/api/orders/${userEmail}`);
        setExistingOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    };
    fetchOrders();
  }, [session,selectedProduct,existingOrders,orderModalOpen]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        const data: Product[] = response.data;
        const filteredProducts = data
          .filter(product => Math.floor(product.rating.rate) > 3)
          .slice(0, 3);
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [session]);

  if (loading) {
    return <Loading />;
  }
  const isProductInOrders = (productTitle: string) => {
    return existingOrders.some(order =>
      order.items.some(item => item.name === productTitle)
    );
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    toggleOrderModal();
  };

  return (
    <div className="bg-gradient-to-b from-yellow-800  min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <Video />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">Discover Your Style</h1>
            <p className="text-xl mb-6">Explore a wide range of products that suit your taste.</p>
            <Link href="/shophome">
              <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-300 ease-in-out">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="w-full px-4 lg:px-16 py-16 text-center bg-gradient-to-b from-gray-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-4xl font-bold mb-2">#1 in the World</h3>
            <p className="text-lg">Recognized globally for our top-quality products and customer satisfaction.</p>
            <div className="border-t border-gray-300 mt-4"></div>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-2">20,000+ Customers</h3>
            <p className="text-lg">Join thousands of satisfied customers who trust our products and services.</p>
            <div className="border-t border-gray-300 mt-4"></div>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-2">High-Quality Guarantee</h3>
            <p className="text-lg">We ensure the best quality products, rigorously tested for excellence.</p>
            <div className="border-t border-gray-300 mt-4"></div>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-8">Popular Products</h2>
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
              isInOrder={isProductInOrders(product.title)}
            />
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-900 py-16 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">Get 20% Off Your First Order</h2>
          <p className="text-lg text-gray-300 mb-6">
            Sign up for our newsletter and receive a discount on your first purchase.
          </p>
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-white text-black px-4 py-3 rounded-md w-full max-w-md mx-auto mb-4 focus:outline-none"
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-semibold">
            Subscribe
          </button>
        </div>
      </section>

      {selectedProduct && orderModalOpen && (
        <OrderModal 
          product={selectedProduct} 
          isInOrder={isProductInOrders(selectedProduct.title)}
        />
      )}
      
    </div>
  );
};

export default Landingpage;
