import { useMutation, useQueryClient } from 'react-query';

const useDeleteOrder = (orderId: any) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async() => {
      return await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      }).then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Network response was not ok');
        }
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
        console.log('Order deleted successfully');
      },
      onError: (error) => {
        console.error('Error deleting order:', error);
      },
    }
  );
  return mutation;
};

export default useDeleteOrder;
