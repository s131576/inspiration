// pages/index.js
'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Footer from "../footer/Footer";
import { Product } from "@/types";
import ProductCard from "../Items/PrudctCard";
import Loading from "../loading/Loading";
import { Video } from "../video/Video";

const Landingpage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        const filteredProducts = data.filter((product: Product) => Math.floor(product.rating.rate) > 3).slice(0, 3);
        setProducts(filteredProducts);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-gradient-to-b from-purple-800 to-indigo-900 min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <Video />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Discover Your Style</h1>
            <p className="text-lg mb-6">Explore a wide range of products that suit your taste.</p>
            <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-300 ease-in-out">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Popular Products</h2>
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landingpage;
