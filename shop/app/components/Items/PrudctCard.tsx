'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { IOrder, IOrderItem } from '@/types';
import { useSession } from 'next-auth/react';
import useOrder from '@/hooks/orderItem/useOrderStore';
import { toast } from 'react-toastify';
import axios from 'axios';
import RatingStars from './RatingStars';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  category: string;
  onClick: () => void;
  isInOrder: boolean; 
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, image, price, rating, category, onClick, isInOrder }) => {
  const { data: session } = useSession();
  const { mutate: createOrder } = useOrder();
  const [existingOrders, setExistingOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session || !session.user) {
        // toast.warning('You need to log in to view orders');
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

    if (itemExists || isInOrder) {
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
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to create order');
      console.error('Failed to create order:', error);
    }
  };

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-md flex flex-col h-full overflow-hidden">
      <div
        className="relative w-full h-96 mb-4 cursor-pointer hover:scale-105 transition-transform"
        onClick={onClick} // Clicking on this div opens the modal
      >
        <Image src={image} alt={name} layout="fill" objectFit="cover" className="rounded-lg" />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-lg font-bold">View Details</span>
        </div>
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-gray-300">#{category}</h3>
        <p className="text-gray-600 mb-2 text-left">${price.toFixed(2)}</p>
        <h3 className="text-xl font-semibold mb-2 text-gray-600 flex-grow">{name}</h3>
        <RatingStars rating={rating} />
      </div>
      <button
        className={`bg-blue-500 text-white py-2 px-4 rounded-lg mt-auto ${isInOrder ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'}`}
        onClick={handleAddToCart}
        disabled={isInOrder}
      >
        {isInOrder ? 'Item already in order list' : 'Order'}
      </button>
    </div>
  );
};

export default ProductCard;
