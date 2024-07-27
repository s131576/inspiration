'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { IOrder, IOrderItem } from '@/types';
import useOrder from '@/hooks/orderItem/useOrderStore';
import axios from 'axios';

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
  const { mutate: createOrder } = useOrder();
  const [existingOrders, setExistingOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session || !session.user) {
        toast.warning('You need to log in to view orders');
        return;
      }

      const userEmail = session.user.email;
      if (!userEmail) {
        return;
      }

      try {
        const response = await axios.get(`/api/orders/${userEmail}`);
        setExistingOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  const handleAddToCart = async () => {
    if (!session || !session.user) {
      toast.warning('You need to log in to order');
      return;
    }

    const userIdentifier = session.user.email || session.user.name;
    if (!userIdentifier) {
      return;
    }

    if (isLoading) {
      toast.info('Loading your orders...');
      return;
    }

    if (!existingOrders) {
      console.error('Existing orders are not available');
      return;
    }

    const itemExists = existingOrders.some(order =>
      order.items.some(item => item.name === name)
    );

    if (itemExists) {
      toast.warn('Item already exists in an order');
      return;
    }

    const orderItem: IOrderItem = {
      id: new Date().toISOString(),
      orderId: '',
      productId: parseInt(id),
      quantity: 1,
      price,
      name,
      category,
      image,
    };

    const order: IOrder = {
      id: new Date().toISOString(),
      userId: userIdentifier,
      items: [orderItem],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await createOrder(order);
      toast.success('Order created successfully');
      const response = await axios.get(`/api/orders/${session.user.email}`);
      setExistingOrders(response.data);
    } catch (error) {
      toast.error('Failed to create order');
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
        <p className="text-gray-600 mb-2 text-left">${price.toFixed(2)}</p>
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
          <span className="text-gray-600 ml-1">{Math.floor(Number(rating.toFixed(1)))}</span>
        </div>
      </div>
      <button onClick={handleAddToCart} className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-auto">
        Order
      </button>
    </div>
  );
};

export default ProductCard;
