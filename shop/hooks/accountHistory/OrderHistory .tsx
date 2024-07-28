'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [paidOrders, setPaidOrders] = useState([]);

  useEffect(() => {
    const fetchPaidOrders = async () => {
      try {
        const response = await axios.get(`/api/orders/payed/${userEmail}`);
        setPaidOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch paid orders', error);
      }
    };

    fetchPaidOrders();
  }, [userEmail]);

  if (paidOrders.length === 0) {
    return <p>You have not bought any items yet.</p>;
  }

  return (
    <div>
      {paidOrders.map((order: any) => (
        <div key={order.id} className="mb-4 p-4 border rounded-md">
          <h3 className="text-xl font-semibold">Order ID: {order.id}</h3>
          <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
          <p>Paid At: {order.paidAt ? new Date(order.paidAt).toLocaleString() : 'Not Paid'}</p>
          <div>
            {order.Order.map((item: any) => (
              <div key={item.id} className="ml-4">
                <p>Product: {item.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
