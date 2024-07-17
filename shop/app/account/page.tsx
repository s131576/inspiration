'use client'
// account.tsx
import React from 'react';
import { useSession } from 'next-auth/react';
import { FiSettings, FiTrash2, FiShoppingBag } from 'react-icons/fi'; // Icons for sidebar options

const AccountPage: React.FC = () => {
  const { data: session } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-screen-lg mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-4">Account</h1>
      <div className="flex">
        {/* User Image */}
        {session.user?.image && (
          <img
            src={session.user.image}
            alt="User Avatar"
            className="w-24 h-24 rounded-full mr-4"
          />
        )}
        <div className="bg-white shadow-md rounded-md p-4 flex-1">
          {/* Email */}
          <div className="mb-4">
            <strong>Email:</strong> {session.user?.email}
          </div>
          {/* Sidebar */}
          <div className="border-l pl-4">
            <h2 className="text-lg font-semibold mb-2">Info</h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FiShoppingBag className="mr-2" />
                <span className="cursor-pointer hover:text-blue-500">Bought</span>
              </li>
              <li className="flex items-center">
                <FiSettings className="mr-2" />
                <span className="cursor-pointer hover:text-blue-500">Settings</span>
              </li>
              <li className="flex items-center">
                <FiTrash2 className="mr-2" />
                <span className="cursor-pointer hover:text-red-500">Delete Account</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
