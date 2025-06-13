"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isRegistering
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      localStorage.setItem("token", data.token);
      router.push("/settings");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fceee7] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#d2691e]">
          {isRegistering ? "Create an Account" : "Login to Your Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#d2691e] text-white py-2 rounded hover:bg-[#c1581a] transition"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setIsRegistering(false);
                  setError("");
                }}
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setIsRegistering(true);
                  setError("");
                }}
              >
                Register
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
