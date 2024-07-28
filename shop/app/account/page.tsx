'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { FiTrash2, FiShoppingCart, FiSettings } from 'react-icons/fi';
import OrderHistory from '@/hooks/accountHistory/OrderHistory ';

const AccountPage: React.FC = () => {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;
  const [activeTab, setActiveTab] = useState<'bought' | 'settings' | null>(null);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please log in to view this page.</div>;
  }

  const handleDeleteAccount = async () => {
    if (userEmail) {
      try {
        const response = await axios.delete(`/api/account/${userEmail}`);
        toast.success(response.data.message);
      } catch (error) {
        console.error('Failed to delete account', error);
        toast.error('Failed to delete account');
      }
    } else {
      console.error('User email is not available');
      toast.error('User email is not available');
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto py-10 px-4">
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
                onClick={handleDeleteAccount}
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

      {activeTab === 'settings' && (
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <FiSettings className="mr-2" />
            Settings
          </h2>
          <div>
            {/* Add content related to user settings here */}
            <p>Settings options will be available here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
