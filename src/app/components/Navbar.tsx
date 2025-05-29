"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ShoppingCartIcon,
  ClockIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/shop", label: "Shop", Icon: ShoppingCartIcon },
  { href: "/timer", label: "Timer", Icon: ClockIcon },
  { href: "/profile", label: "Profile", Icon: UserCircleIcon },
  { href: "/settings", label: "Settings", Icon: Cog6ToothIcon },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-4 right-4 z-50 flex flex-col items-center space-y-6 px-4 py-4 rounded-2xl shadow-xl bg-black/20 backdrop-blur-md border border-white/10">
      {navItems.map(({ href, label, Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className="group relative flex items-center justify-center"
          >
            <div
              className={`p-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-blue-500 shadow-md"
                  : "hover:bg-white/20 hover:shadow-md"
              }`}
            >
              <Icon
                className={`h-6 w-6 transition-colors duration-300 ${
                  isActive ? "text-white" : "text-white group-hover:text-blue-400"
                }`}
              />
            </div>

            {/* Tooltip */}
            <span className="absolute right-full mr-3 text-black bg-white text-sm font-medium px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transform -translate-x-2 transition duration-200 whitespace-nowrap">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
