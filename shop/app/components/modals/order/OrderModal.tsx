'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { IOrder, IOrderItem, Product } from '@/types';
import useStagairStore from '@/shopStore';
import { useSession } from 'next-auth/react';
import useOrder from '@/hooks/orderItem/useOrderStore';
import { toast } from 'react-toastify';
import axios from 'axios';
import RatingStars from '../../Items/RatingStars';

interface OrderModalProps {
  product: Product;
}

const OrderModal: React.FC<OrderModalProps> = ({ product }) => {
  const orderModalOpen = useStagairStore((state) => state.orderModal);
  const toggleOrderModal = useStagairStore((state) => state.toggleOrderModal);

  const { data: session } = useSession();
  const { mutate: createOrder } = useOrder();
  const [existingOrders, setExistingOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [temporarilyOrdered, setTemporarilyOrdered] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session || !session.user) {
        toast.warning('You need to log in to view orders');
        setIsLoading(false);
        return;
      }

      const userEmail = session.user.email;
      if (!userEmail) {
        setIsLoading(false);
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

    if (orderModalOpen) {
      fetchOrders();
    }
  }, [session, temporarilyOrdered]);

  useEffect(() => {
    if (!orderModalOpen) {
      setTemporarilyOrdered(false);
    }
  }, [orderModalOpen]);

  if (!orderModalOpen) return null;

  const handleAddToCart = async () => {
    if (!session || !session.user) {
      toast.warning('You need to log in to order');
      return;
    }

    const userIdentifier = session.user.email || session.user.name;
    if (!userIdentifier) {
      return;
    }

    // if (isLoading) {
    //   toast.info('Loading your orders...');
    //   return;
    // }

    const itemExists = existingOrders.some(order =>
      order.items.some(item => item.name === product.title)
    );

    if (itemExists || temporarilyOrdered) {
      toast.warn('Item already exists in an order');
      return;
    }

    const orderItem: IOrderItem = {
      id: new Date().toISOString(),
      orderId: '',
      productId: product.id,
      quantity: 1,
      price: product.price,
      name: product.title,
      category: product.category,
      image: product.image,
    };

    const order: IOrder = {
      id: new Date().toISOString(),
      userId: userIdentifier,
      items: [orderItem],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      setTemporarilyOrdered(true);
      await createOrder(order);
      toast.success('Order created successfully');
      const response = await axios.get(`/api/orders/${session.user.email}`);
      setExistingOrders(response.data);
    } catch (error) {
      setTemporarilyOrdered(false);
      toast.error('Failed to create order');
      console.error('Failed to create order:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white max-w-4xl w-full rounded-lg shadow-lg overflow-hidden relative flex flex-col md:flex-row" style={{ height: '500px' }}>
        <button
          onClick={toggleOrderModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-black z-10"
        >
          X
        </button>
        <div className="relative w-full md:w-1/2 h-64 md:h-full flex items-center justify-center">
          <Image
            src={product.image || '/placeholder.jpg'}
            alt={product.title || 'Product Image'}
            layout="fill"
            objectFit="contain"
            className="object-contain"
          />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-amber-800">{product.title}</h2>
            <p className="text-gray-700 mb-4">{product.description || 'No description available.'}</p>
            <p className="text-xl font-semibold text-green-600">${product.price}</p>
            <RatingStars rating={product.rating.rate}/>
          </div>
          <div className="relative w-full h-96 mb-4 flex items-end">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-auto"
              onClick={handleAddToCart}>
              Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;