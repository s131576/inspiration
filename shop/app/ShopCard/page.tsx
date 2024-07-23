'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useUpdateOrderItemQuantity from '@/hooks/orderItem/useUpdateOrder';
import useDebounce from '@/helpers/useDeBounce';
import Loading from '../components/loading/Loading';
import { toast } from 'react-toastify';

interface OrderItem {
  id: string;
  orderId: string;
  productId: number;
  quantity: number;
  price: number;
  name: string;
  category: string;
  image: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantityState, setQuantityState] = useState<{ [key: string]: number }>({});
  const [debouncedQuantity, setDebouncedQuantity] = useState<{ [key: string]: number }>({});

  const { mutate: updateOrderItemQuantity } = useUpdateOrderItemQuantity();
  const debouncedQuantityState = useDebounce(debouncedQuantity, 500); // Debounce for 500ms

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders');
        setOrders(response.data);

        const initialQuantities: { [key: string]: number } = {};
        response.data.forEach(order =>
          order.items.forEach(item => {
            initialQuantities[item.id] = item.quantity;
          })
        );
        setQuantityState(initialQuantities);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (Object.keys(debouncedQuantityState).length === 0) return;

    Object.keys(debouncedQuantityState).forEach(itemId => {
      const newQuantity = debouncedQuantityState[itemId];
      const orderItem = orders.flatMap(order => order.items).find(item => item.id === itemId);

      if (orderItem) {
        updateOrderItemQuantity({
          orderId: orderItem.orderId,
          itemId,
          quantity: newQuantity
        });
      }
    });
  }, [debouncedQuantityState]);

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await axios.delete(`/api/orders/${orderId}`);
      toast.success('Order deleted successfully');
      setOrders(orders.filter(order => order.id !== orderId));
      

    } catch (error) {
      console.error('Failed to delete order', error);
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      console.error('Quantity must be greater than 0');
      return;
    }

    setQuantityState(prevQuantities => ({
      ...prevQuantities,
      [itemId]: newQuantity
    }));

    setDebouncedQuantity(prevQuantities => ({
      ...prevQuantities,
      [itemId]: newQuantity
    }));
  };

  const handleInputChange = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    handleQuantityChange(itemId, newQuantity);
  };

  // Function to calculate the total price per item for all orders
  const calculateTotalPricePerItem = (orders: Order[], quantityState: { [key: string]: number }): number => {
    return orders.flatMap(order => order.items)
      .reduce((acc, item) => acc + (item.price * (quantityState[item.id] || item.quantity)), 0);
  };

  const totalPricePerItem = calculateTotalPricePerItem(orders, quantityState).toFixed(2);

  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return <div className="flex items-center justify-center h-screen text-gray-500">No orders found</div>;
  }

  return (
    <div className="bg-gray-400 min-h-screen p-4">
      <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <p className="text-lg text-gray-600 mb-4">Total Price Per Item: ${totalPricePerItem}</p>
        <button className="bg-blue-500 text-white py-2 px-4 rounded">
          Place Order
        </button>
      </div>
      <div>
        {orders.map(order => (
          <div key={order.id} className="mb-4 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
            <p className="text-gray-600 mb-2">Created at: {new Date(order.createdAt).toLocaleString()}</p>
            {order.items.map(item => (
              <div key={item.id} className="flex items-center mb-4 p-2 border-b">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Category: {item.category}</p>
                  <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                  <p className="text-gray-600">Quantity:
                    <input
                      type="number"
                      min="1"
                      value={quantityState[item.id] || item.quantity}
                      onChange={(e) => handleInputChange(item.id, e)}
                      className="ml-2 p-1 border rounded"
                    />
                  </p>
                  <div className="flex justify-center mt-2">
                    <p className="text-gray-600 text-xl font-semibold">
                      Total/Item: ${(item.price * (quantityState[item.id] || item.quantity)).toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="bg-red-500 text-white py-1 px-4 rounded"
                >
                  Delete Order
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;