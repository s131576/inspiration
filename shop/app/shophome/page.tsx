'use client';
import React, { useState, useEffect } from 'react';
import Loading from '../components/loading/Loading';
import useStagairStore from '@/shopStore';
import OrderModal from '../components/modals/order/OrderModal';
import ProductCard from '../components/Items/PrudctCard';

// Define the Product type
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const orderModalOpen = useStagairStore((state) => state.orderModal);
  const toggleOrderModal = useStagairStore((state) => state.toggleOrderModal);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    toggleOrderModal();
  };

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((response) => response.json())
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRating(e.target.value);
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPriceRange(e.target.value);
  };

  const priceRanges = [
    { label: '0 - 20', min: 0, max: 20 },
    { label: '20 - 50', min: 20, max: 50 },
    { label: '50 - 100', min: 50, max: 100 },
    { label: '100 - 500', min: 100, max: 500 },
    { label: '500 - 1000', min: 500, max: 1000 },
    { label: '1000 - 5000', min: 1000, max: 5000 },
  ];
  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory ? product.category === selectedCategory : true;
    const ratingMatch = selectedRating ? Math.floor(product.rating.rate) === parseFloat(selectedRating) : true;
    
    const selectedRange = priceRanges.find(range => range.label === selectedPriceRange);
    const priceMatch = selectedRange
      ? product.price >= selectedRange.min && product.price <= selectedRange.max
      : true;
  
    return categoryMatch && ratingMatch && priceMatch;
  });
  

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex">
      <div className="w-1/4 p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Category</label>
          <select className="w-full p-2 border border-gray-300 rounded" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="jewelery">Jewelery</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rating</label>
          <select className="w-full p-2 border border-gray-300 rounded" value={selectedRating} onChange={handleRatingChange}>
            <option value="">All Ratings</option>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Price</label>
          <select className="w-full p-2 border border-gray-300 rounded" value={selectedPriceRange} onChange={handlePriceRangeChange}>
            <option value="">All Prices</option>
            {priceRanges.map(range => (
              <option key={range.label} value={range.label}>{range.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-3/4 p-4">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
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
        {selectedProduct && orderModalOpen && (
          <OrderModal product={selectedProduct} />
        )}
      </div>
    </div>
  );
};

export default ShopPage;
