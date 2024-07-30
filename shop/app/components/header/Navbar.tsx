'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FiUser } from 'react-icons/fi';
import { TiShoppingCart } from 'react-icons/ti';
import { RxHamburgerMenu } from 'react-icons/rx';
import { GiPowerButton } from "react-icons/gi";
import { IoIosLogOut } from "react-icons/io";
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  ordersCountNav: number;
}

const Navbar: React.FC<NavbarProps> = ({ ordersCountNav }) => {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<string[]>([]);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoriesDropdownToggle = () => {
    setIsCategoriesDropdownOpen(prev => !prev);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsCategoriesDropdownOpen(false);
    setIsNavbarOpen(false); // Close hamburger menu
  };

  const handleAccountDropdownToggle = () => {
    setIsAccountDropdownOpen(prev => !prev);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    setIsNavbarOpen(false); // Close hamburger menu
  };

  const handleSignIn = async () => {
    await signIn("google");
    router.push('/');
    setIsNavbarOpen(false); // Close hamburger menu
  };

  const handleNavbarToggle = () => {
    setIsNavbarOpen(prev => !prev);
  };

  return (
    <header className="flex flex-col md:flex-row shadow-lg py-4 px-4 sm:px-10 bg-white font-sans min-h-70px tracking-wide relative z-50">
      <div className="flex items-center justify-between w-full">
        <Link href="/">
          <p className="text-2xl font-bold">MyApp</p>
        </Link>

        <div className="md:hidden flex items-center">
          <button onClick={handleNavbarToggle} className="text-2xl">
            <RxHamburgerMenu />
          </button>
        </div>

        <nav className={`md:flex items-center gap-8 ${isNavbarOpen ? 'hidden' : 'hidden'} md:block`}>
          <div className="flex gap-8 items-center text-black">
            <Link href="/">
              <p className="text-[#333] font-semibold cursor-pointer">Home</p>
            </Link>

            {categories.length > 0 && (
              <div className="relative">
                <p
                  className={`text-[#333] font-semibold cursor-pointer flex items-center ${isCategoriesDropdownOpen ? 'text-blue-600' : ''}`}
                  onClick={handleCategoriesDropdownToggle}
                >
                  Categories
                  <svg
                    className="w-2.5 h-2.5 ms-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 10 6"
                    aria-hidden="true"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </p>

                {isCategoriesDropdownOpen && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 mt-1 z-10">
                    {categories.map((category, index) => (
                      <Link key={index} href={`/products/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-').replace(/['&]/g, ''))}`}>
                        <p
                          className={`block px-4 py-2 text-sm hover:bg-purple-200 ${selectedCategory === category ? 'text-blue-600 font-medium' : ''}`}
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Link href="/shophome">
              <p className="text-[#333] font-semibold cursor-pointer">Shop</p>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {session ? (
              <>
                <Link href="/ShopCard" className="flex items-center">
                  <TiShoppingCart className="w-5 h-5 mr-1" />
                  {ordersCountNav > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">{ordersCountNav}</span>}
                </Link>

                <div className="relative">
                  <button
                    id="dropdownAccountButton"
                    className="text-gray-700 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
                    onClick={handleAccountDropdownToggle}
                  >
                    <FiUser className="w-4 h-4 mr-1" />
                    {session.user?.name}
                    <svg
                      className="w-2.5 h-2.5 ms-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 10 6"
                      aria-hidden="true"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  {isAccountDropdownOpen && (
                    <div className="absolute top-full right-0 z-20 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-lg">
                      <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownAccountButton">
                        <li>
                          <Link href="/account" onClick={() => setIsNavbarOpen(false)}>
                            <p onClick={handleAccountDropdownToggle} className="block px-4 py-2 hover:bg-gray-100">
                              Account
                            </p>
                          </Link>
                        </li>
                        <li>
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={handleSignOut}
                          >
                            Sign out
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="text-blue-500 hover:underline"
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </div>

      {isNavbarOpen && (
        <>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-9 ${isNavbarOpen ? 'block' : 'hidden'}`} onClick={handleNavbarToggle}></div>
        <div className={`absolute top-16 left-0 w-full bg-gray-200 shadow-lg md:hidden z-10`}>
          <div className="flex flex-col items-center py-4">
            <Link href="/" onClick={() => setIsNavbarOpen(false)}>
              <p className="text-[#333] font-semibold mb-4">Home</p>
            </Link>
            {categories.length > 0 && (
              <div className="mb-4">
                <p className="text-[#333] font-semibold cursor-pointer" onClick={handleCategoriesDropdownToggle}>
                  Categories
                </p>
                {isCategoriesDropdownOpen && (
                  <div className="bg-white shadow-lg rounded-lg py-2 mt-1">
                    {categories.map((category, index) => (
                      <Link onClick={() => setIsNavbarOpen(false)} key={index} href={`/products/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-').replace(/['&]/g, ''))}`}>
                        <p onClick={handleCategoriesDropdownToggle} className="block px-4 py-2 text-sm hover:bg-orange-800">{category}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            <Link href="/ShopCard" className="flex items-center " onClick={() => setIsNavbarOpen(false)}>
              <TiShoppingCart className="w-5 h-5 mr-1" />
              {ordersCountNav > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">{ordersCountNav}</span>}
            </Link>
            <Link href="/shophome" className='py-2' onClick={() => setIsNavbarOpen(false)}>
              <p className="text-[#333] font-semibold">Shop</p>
            </Link>
            <Link href="/account" onClick={() => setIsNavbarOpen(false)}>
              <p className="block px-4 py-2 hover:bg-gray-100">
                Account
              </p>
            </Link>
            {session ? (
              <button
                onClick={handleSignOut}
              >
               <IoIosLogOut />
              </button>
            ) : (
              <button
                onClick={handleSignIn}
              >
               <GiPowerButton />
              </button>
            )}
          </div>
        </div>
        </>
      )}
      
    </header>
    
  );
};

export default Navbar;
