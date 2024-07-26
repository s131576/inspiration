import { useQuery } from 'react-query';
import axios from 'axios';
import { IOrder } from '@/types';

const fetchOrders = async () => {
  const response = await axios.get('/api/orders');
  return response.data as IOrder[];
};

const useFetchOrders = () => {
  return useQuery('orders', fetchOrders);
};

export default useFetchOrders;
