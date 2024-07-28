import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { IOrder } from '@/types';
import useStagairStore from '@/shopStore';

const useOrder = () => {
  const queryClient = useQueryClient();
  const { setOrders } = useStagairStore();

  const mutation = useMutation(
    async(orderData: IOrder) => {
      return await axios.post('/api/orders', orderData)
        .then(response => response.data as IOrder);
    },
    {
      onSuccess: (data) => {
        setOrders([data]); 
        queryClient.invalidateQueries('orders');
        console.log('Order created successfully');
      },
      onError: (error) => {
        console.error('Error creating order:', error);
      },
    }
  );

  return mutation;
};

export default useOrder;
