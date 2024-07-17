'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";
import Dropdown from "./Dropdown"; // Assuming you have a Dropdown component
import { MenuItem } from "./Header"; // Assuming you have MenuItem interface

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<string[]>([]); // State to hold categories
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const menuItems: MenuItem[] = [
    {
      title: "Home",
      route: "/",
    },
    {
      title: "Categories",
      children: categories.map((category) => ({
        title: category,
        route: `/products/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-').replace(/['&]/g, ''))}`,
      })),
    },
  ];

  return (
    <header className="flex shadow-lg py-4 px-4 sm:px-10 bg-white font-sans min-h-70px tracking-wide relative z-50">
      <div className="flex flex-wrap items-center justify-between gap-4 w-full">
        <Link href="/">
          <p className="lg:absolute max-lg:left-10 lg:top-2/4 lg:left-2/4 lg:-translate-x-1/2 lg:-translate-y-1/2">
            {/* <img src="/logo.png" alt="logo" className="w-72 h-20" /> */}
          </p>
        </Link>

        <div className="flex gap-8 items-center text-black">
          {menuItems.map((item, index) =>
            item.children ? (
              <Dropdown key={index} item={item} />
            ) : (
              <Link key={index} href={item.route || ""}>
                <p className=" text-[#333] block font-semibold text-15px cursor-pointer">{item.title}</p>
              </Link>
            )
          )}
        </div>

        <div className="flex items-center ml-auto space-x-6">
          {session ? (
            <>
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <h3 className="text-gray-500">{session.user?.name}</h3>
              <button className="text-black" onClick={() => signOut()}>
                <FiLogOut className="text-black ml-1" />
              </button>
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
