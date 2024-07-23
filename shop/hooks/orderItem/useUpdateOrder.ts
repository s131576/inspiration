import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const useUpdateOrderItemQuantity = () => {
  const queryClient = useQueryClient();

  const updateOrder = async (data: { orderId: string; itemId: string; quantity: number }) => {
    try {
      const response = await axios.patch(
        `/api/orders/${data.orderId}`,
        { itemId: data.itemId, quantity: data.quantity },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error updating resource: ${error}`);
    }
  };

  return useMutation(updateOrder, {
    onSuccess: () => {
      queryClient.invalidateQueries("orders"); 
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export default useUpdateOrderItemQuantity;
