'use client';
import React from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { FiTrash2 } from 'react-icons/fi';

const AccountPage: React.FC = () => {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;

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
    <div className="max-w-screen-lg mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-4">Account</h1>
      <div className="flex">
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
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
