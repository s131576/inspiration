'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';
import { FiTrash2, FiShoppingCart, FiSettings } from 'react-icons/fi';
import useStagairStore from '@/shopStore';
import { useRouter } from 'next/navigation';  
import ConfirmationModal from '../components/modals/account/DeleteAccount';
import OrderHistory from '../components/account/OrderHistory';
import AccountSettings from '../components/account/AccountSettings';

const AccountPage: React.FC = () => {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;
  const [activeTab, setActiveTab] = useState<'bought' | 'settings' | null>(null);

  const toggleModalDelete = useStagairStore((state) => state.toggleOrderModalDelete);
  const router = useRouter();  

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please log in to view this page.</div>;
  }

  const handleDeleteAccount = async () => {
    if (userEmail) {
      try {
        const response = await axios.delete(`/api/users/${userEmail}`);
        console.log("account fetch api/orders")
        toast.success(response.data.message);
        await signOut();  
        router.push('/');  
      } catch (error) {
        console.error('Failed to delete account', error);
        toast.error('Failed to delete account');
      }
    } else {
      console.error('User email is not available');
      toast.error('User email is not available');
    }
  };

  const openDeleteModal = () => {
    toggleModalDelete();
  };

  const closeDeleteModal = () => {
    toggleModalDelete();
  };

  return (
    <div className="max-w-screen-lg min-h-screen mx-auto py-10 px-4 ">
      <h1 className="text-3xl font-semibold mb-4">Account</h1>

      <div className="flex mb-6 items-center">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt="User Avatar"
            className="w-24 h-24 rounded-full mr-4"
          />
        )}
        <div className="bg-white shadow-md rounded-md p-4 flex-1">
          <div className="mb-4">
            <strong>Email:</strong> {session.user?.email}
          </div>
          <div className="border-l pl-4">
            <h2 className="text-lg font-semibold mb-2">Info</h2>
            <ul className="space-y-2">
              <li
                className="flex items-center cursor-pointer hover:text-red-500"
                onClick={openDeleteModal}
              >
                <FiTrash2 className="mr-2" />
                <span>Delete Account</span>
              </li>
              <li
                className={`flex items-center cursor-pointer hover:text-blue-500 ${
                  activeTab === 'settings' ? 'text-blue-500' : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                <FiSettings className="mr-2" />
                Settings
              </li>
              <li
                className={`flex items-center cursor-pointer hover:text-blue-500 ${
                  activeTab === 'bought' ? 'text-blue-500' : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('bought')}
              >
                <FiShoppingCart className="mr-2" />
                Order history
              </li>
            </ul>
          </div>
        </div>
      </div>

      {activeTab === 'bought' && userEmail && (
        <div className="bg-white shadow-md rounded-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <FiShoppingCart className="mr-2" />
            Order history
          </h2>
          <div>
            <OrderHistory userEmail={userEmail} />
          </div>
        </div>
      )}

      {activeTab === 'settings' && userEmail &&(
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <FiSettings className="mr-2" />
            Settings
          </h2>
          <div>
          <AccountSettings userEmail={userEmail} />
          </div>
        </div>
      )}

      <ConfirmationModal
        onConfirm={handleDeleteAccount}
        onCancel={closeDeleteModal}
      />
    </div>
  );
};

export default AccountPage;
