'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/app/components/header/Navbar';

const OrderCountProvider = ({ children }: { children: React.ReactNode }) => {
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrdersCount = async () => {
      if (session?.user?.email) {
        try {
          const response = await axios.get(`/api/orders/${session.user.email}`);
          setOrdersCount(response.data.length); 
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
    };

    fetchOrdersCount();
    const interval = setInterval(() => {
      fetchOrdersCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [session?.user?.email]);

  return (
    <>
      <Navbar ordersCountNav={ordersCount} />
      {children}
    </>
  );
};

export default OrderCountProvider;
