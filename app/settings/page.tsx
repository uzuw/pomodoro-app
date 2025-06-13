"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SettingsPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">Settings</h1>

      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      ) : (
        <Link
          href="/login"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default SettingsPage;
