// components/landingpage/ProductCard.tsx
import React from "react";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  image: string;
  price: string;
  rating: number;
  category:string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, image, price, rating,category }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="relative w-full h-96 mb-4">
        <Image src={image} alt={name} layout="fill" objectFit="cover" className="rounded-lg" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-300">#{category}</h3>
      <p className="text-gray-600 mb-2 text-left">${price}</p>
      <h3 className="text-xl font-semibold mb-2 text-gray-600">{name}</h3>
      <button className="bg-blue-500">Order</button>
      {/* <div className="flex items-center">
        {Array.from({ length: Math.floor(rating) }, (_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L10 14.697l-3.766 1.98a.75.75 0 0 1-1.088-.79l.719-4.192-3.046-2.97a.75.75 0 0 1 .416-1.28l4.21-.611 1.882-3.815A.75.75 0 0 1 10 2z"
            />
          </svg>
        ))}
        <span className="text-gray-600 ml-1">{rating}</span>
      </div> */}
    </div>
  );
};

export default ProductCard;
