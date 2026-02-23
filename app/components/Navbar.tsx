"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Define icon paths
const navItems = [
  { href: "/", label: "Home", icon: "/navbar/home.png" },
  { href: "/shop", label: "Shop", icon: "/navbar/shop.png" },
  { href: "/profile", label: "Profile", icon: "/navbar/profile.png" },
  { href: "/settings", label: "Settings", icon: "/navbar/settings.png" },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-[10vh] right-4 z-50 flex flex-col items-center space-y-6 px-4 py-4 rounded-2xl shadow-xl bg-black/20 backdrop-blur-md border border-white/10">
      

      {navItems.map(({ href, label, icon }) => {
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
                  ? "bg-white/10 shadow-md"
                  : "hover:bg-white/20 hover:shadow-md"
              }`}
            >
              <Image
                src={icon}
                alt={label}
                width={30}
                height={30}
                className={`transition duration-200 ${
                  isActive ? "scale-130" : "group-hover:scale-130"
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
