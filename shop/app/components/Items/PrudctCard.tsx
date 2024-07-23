import React from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { IOrder, IOrderItem } from '@/types';
import useStagairStore from '@/shopStore';
import useOrder from '@/hooks/orderItem/useOrderStore';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, image, price, rating, category }) => {
  const { data: session } = useSession();
  const { setOrder } = useStagairStore();
  const { mutate: createOrder } = useOrder();

  const handleAddToCart = async () => {
    if (!session || !session.user) {
      console.error('User is not authenticated');
      return;
    }

    const userIdentifier = session.user.email || session.user.name;

    if (!userIdentifier) {
      console.error('User identifier is not available');
      return;
    }

    // Create a new order item
    const orderItem: IOrderItem = {
      id: new Date().toISOString(), // Unique ID for OrderItem
      orderId: '', // This should be updated or handled by the backend
      productId: parseInt(id), // Parse ID to number
      quantity: 1,
      price, // Price is already a number
      name,
      category,
      image,
    };

    // Create a new order
    const order: IOrder = {
      id: new Date().toISOString(), // Unique ID for Order
      userId: userIdentifier,
      items: [orderItem],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // Make API call to create order
      await createOrder(order);
      console.log('Order created successfully');
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full">
      <div className="relative w-full h-96 mb-4">
        <Image src={image} alt={name} layout="fill" objectFit="cover" className="rounded-lg" />
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-gray-300">#{category}</h3>
        <p className="text-gray-600 mb-2 text-left">${price.toFixed(2)}</p> {/* Format price to 2 decimal places */}
        <h3 className="text-xl font-semibold mb-2 text-gray-600 flex-grow">{name}</h3>
        <div className="flex items-center mb-4">
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
          <span className="text-gray-600 ml-1">{Math.floor(Number(rating.toFixed(1)))}</span> {/* Format rating to 1 decimal place */}
        </div>
      </div>
      <button onClick={handleAddToCart} className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-auto">
        Order
      </button>
    </div>
  );
};

export default ProductCard;
