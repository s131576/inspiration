import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const useCreatePaidOrder = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (orderData: { userEmail: string; orderIds: string[]; totalAmount: number }) => {
      const response = await axios.post(`/api/orders/payed/${orderData.userEmail}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
        toast.success('Paid order created successfully');
      },
      onError: () => {
        toast.error('Failed to create paid order');
      },
    }
  );
};

export default useCreatePaidOrder;
