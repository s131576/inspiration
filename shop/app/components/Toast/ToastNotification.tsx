import React from 'react';

interface ProductCardProps {
  id: string;
  category: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  onAddToOrder: () => void; // Ensure this is included in the props
}

const ProductCard: React.FC<ProductCardProps> = ({ id, category, name, image, price, rating, onAddToOrder }) => {
  return (
    <div className="border p-4 rounded-lg shadow-lg">
      <img src={image} alt={name} className="w-full h-48 object-cover mb-4 rounded-lg" />
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">{category}</p>
      <p className="text-gray-800">${price.toFixed(2)}</p>
      <p className="text-yellow-500">{rating} ★</p>
      <button 
        onClick={onAddToOrder}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600"
      >
        Add to Order
      </button>
    </div>
  );
};

export default ProductCard;
