'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { FiUser } from "react-icons/fi";
import { TiShoppingCart } from "react-icons/ti";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  userId: string;
  items: { id: string; quantity: number }[];
  createdAt: string;
  updatedAt: string;
}

const Navbar = () => {
  const router = useRouter();
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: session } = useSession();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch orders count when user session changes
  useEffect(() => {
    if (session?.user.email) {
      const fetchOrdersCount = async () => {
        try {
          const response = await fetch(`/api/orders/${session.user.email}`);
          if (response.ok) {
            const data = await response.json();
            setOrdersCount(data.length); // Assuming data is an array of orders
          } else {
            console.error("Failed to fetch orders");
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchOrdersCount();

      // Optionally set up polling to refresh orders count periodically
      const interval = setInterval(() => {
        fetchOrdersCount();
      }, 10000); // Adjust the interval as needed

      return () => clearInterval(interval);
    }
  }, [session]);

  const handleCategoriesDropdownToggle = () => {
    setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsCategoriesDropdownOpen(false); // Close dropdown after selection
  };

  const handleAccountSelect = () => {
    setIsAccountDropdownOpen(false); // Close dropdown after selection
  };

  const handleAccountDropdownToggle = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');  // Redirect to home page after sign out
  };

  return (
    <header className={`flex shadow-lg py-4 px-4 sm:px-10 bg-white font-sans min-h-70px tracking-wide relative z-50 ${isScrolled ? 'sticky top-0 bg-white z-100' : 'relative z-100'}`}>
      <div className="flex flex-wrap items-center justify-between gap-4 w-full">
        <Link href="/">
          <p className="lg:absolute max-lg:left-10 lg:top-2/4 lg:left-2/4 lg:-translate-x-1/2 lg:-translate-y-1/2">
          </p>
        </Link>

        <div className="flex gap-8 items-center text-black">
          <Link href="/">
            <p className="text-[#333] block font-semibold text-15px cursor-pointer">Home</p>
          </Link>
          {categories.length > 0 && (
            <div className="relative">
              <p
                className={`text-[#333] font-semibold text-15px cursor-pointer flex items-center ml-auto space-x-6 ${isCategoriesDropdownOpen ? 'text-blue-600' : ''}`}
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
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 mt-1">
                  {categories.map((category, index) => (
                    <Link key={index} href={`/products/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-').replace(/['&]/g, ''))}`}>
                      <p
                        className={`block px-4 py-2 text-sm hover:bg-gray-200 ${selectedCategory === category ? 'text-blue-600 font-medium' : ''}`}
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
        </div>

        <div className="flex items-center ml-auto space-x-6">
          {session ? (
            <>
              <div className="flex items-center space-x-2">
                <Link href="/ShopCard" className="flex items-center">
                  <TiShoppingCart className="w-5 h-5 mr-1" />
                  {ordersCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">{ordersCount}</span>}
                </Link>
              </div>
              {/* Account Dropdown */}
              <div className="relative">
                <button
                  id="dropdownAccountButton"
                  className="text-white bg-gray-700 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-400"
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
                {/* Dropdown Content */}
                {isAccountDropdownOpen && (
                  <div className="absolute top-full right-0 z-20 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-lg">
                    <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownAccountButton">
                      <li>
                        <Link onClick={handleAccountSelect} href={"/account"}>
                          <p className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
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
              onClick={() => signIn("google")}
              className="text-007bff hover:underline"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
