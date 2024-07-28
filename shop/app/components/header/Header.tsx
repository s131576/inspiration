import React from "react";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "./Dropdown";

export interface MenuItem {
  title: string;
  route?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  // {
  //   title: "Home",
  //   route: "/",
    
  // },
  {
    title: "Products",
    children: [
      {
        title: "Hinkle Horns",
        route: "/products/hinkle-horns",
      },
      {
        title: "Doozers",
        route: "/products/doozers",
      },
      {
        title: "Zizzer-zazzers",
        route: "/products/zizzer-zazzers",
      },
    ],
  },
  
];

export default function Header() {
  return (
    <header className="flex gap-10 items-center bg-zinc-800 py-4 px-2">
      <Link href="https://designly.biz" target="_blank">
        {/* Updated logo styling with Tailwind CSS */}
        {/* <div className="flex items-center">
          <Image src="/logo.svg" width={160} height={40} alt="logo" />
        </div> */}
      </Link>
      <div className="flex gap-8 items-center text-white">
        {menuItems.map((item) => {
          return item.hasOwnProperty("children") ? (
            <Dropdown key={item.title} item={item} />
          ) : (
            <Link
              key={item.title}
              className="hover:text-blue-500"
              href={item?.route || ""}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
