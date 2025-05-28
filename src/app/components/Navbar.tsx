"use client";

import React from "react";
import Link from "next/link";
import {
  HomeIcon,
  ShoppingCartIcon,
  ClockIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { href: "/", label: "Lobby/Home", Icon: HomeIcon },
  { href: "/shop", label: "Shop", Icon: ShoppingCartIcon },
  { href: "/timer", label: "Timer", Icon: ClockIcon },
  { href: "/profile", label: "Profile/Login", Icon: UserCircleIcon },
  { href: "/settings", label: "Settings", Icon: Cog6ToothIcon },
];

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-4 right-4 bg-black bg-opacity-40 backdrop-blur-md rounded-xl px-2 py-4 flex flex-col items-center space-y-4 z-50 shadow-lg">
      {navItems.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          className="group relative flex justify-center items-center"
        >
          <Icon className="h-6 w-6 text-white group-hover:text-blue-400 transition" />

          {/* Tooltip */}
          <span className="absolute right-full mr-3 bg-white text-black text-sm font-medium px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transform -translate-x-2 transition duration-200 whitespace-nowrap">
            {label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
