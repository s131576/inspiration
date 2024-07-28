
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const useOrdersCount = () => {
  const { data: session } = useSession();
  const [ordersCount, setOrdersCount] = useState<number>(0);

  useEffect(() => {
    if (!session?.user?.email) {
      setOrdersCount(0);
      return;
    }

    const fetchOrdersCount = async () => {
      try {
        const response = await fetch(`/api/orders/${session.user.email}`);
        if (response.ok) {
          const data = await response.json();
          setOrdersCount(data.length); 
        } else {
          console.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrdersCount();

    const interval = setInterval(() => {
      fetchOrdersCount();
    }, 10000); 

    return () => clearInterval(interval);
  }, [session]);

  return ordersCount;
};

export default useOrdersCount;
