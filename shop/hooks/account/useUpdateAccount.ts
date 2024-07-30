import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const updateUser = async (data: { oldEmail: string; newEmail: string; name: string }) => {
    try {
      const response = await axios.patch(
        `/api/users/${data.oldEmail}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  };

  return useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("user updated");
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default useUpdateUser;
