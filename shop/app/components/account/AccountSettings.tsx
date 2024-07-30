'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IUser } from '@/types';
import useUpdateUser from '@/hooks/account/useUpdateAccount';
import { useSession, signOut } from 'next-auth/react';


const AccountSettings: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const [settings, setSettings] = useState<IUser | null>(null);
  // const [oldEmail,setOldEmail]=useState("");
  const [newEmail,setNewEmail]=useState("");
  const [name,setName]=useState("");
  const { mutate: updateUserNew } = useUpdateUser();


  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await axios.get(`/api/users/${userEmail}`);
        setSettings(response.data);
      } catch (error) {
        console.error('Failed to fetch account settings', error);
      }
    };
    fetchAccount();
  }, [userEmail]);

  

  const formhandler=(e)=>{
    e.preventDefault();

    useEffect(()=>{
      const loadUser=async()=>{
        updateUserNew({
          name:name,
          oldEmail:userEmail,
          newEmail:newEmail
        })
      }
      loadUser();
    },[])


  }

  return (
    <div className="py-4">
    {/* <h2 className="text-2xl font-semibold mb-4">Profile</h2> */}
    {settings && (
      <form className="space-y-4" onSubmit={formhandler}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={settings.name}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={(e)=>setName(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={settings.email}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={(e)=>setNewEmail(e.target.value)}
          />
        </div>
        
        {/* <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update
        </button> */}
      </form>
    )}
  </div>
  
  );
};

export default AccountSettings;
