"use client";

import { signIn, useSession, getSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, Droplets, LogIn, Eye, EyeOff } from "lucide-react"; 

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectUser = useCallback((role: string) => {
    const userRole = role?.toLowerCase();
    if (userRole === "admin") router.push("/admin");
    else if (userRole === "donor") router.push("/donor");
    else if (userRole === "receiver") router.push("/receiver");
    else router.push("/");
  }, [router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      redirectUser(session.user.role);
    }
  }, [status, session, redirectUser]); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (res?.error) {
        // Specific error from authorize() or "CredentialsSignin"
        setError(res.error === "CredentialsSignin" ? "Invalid credentials" : res.error);
        setLoading(false);
      } else {
        const updatedSession = await getSession();
        if (updatedSession?.user?.role) {
          redirectUser(updatedSession.user.role);
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      setError(`Login failed: ${(err as Error).message}`);
      setLoading(false);
    }
  };

  if (status === "loading") return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-red-100 p-3 rounded-full mb-3">
            <Droplets className="text-red-600 w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Login to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Identifier Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2" htmlFor="identifier">
              <User size={16} /> Email or Username
            </label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-black transition-all"
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter email or username"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2" htmlFor="password">
              <Lock size={16} /> Password
            </label>
            <div className="relative">
              <input
                className="w-full p-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-black transition-all"
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button" // Important: prevents form submission
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-red-600 hover:bg-red-700 shadow-lg active:scale-95"
            }`}
          >
            {loading ? "Verifying..." : (
              <>
                <LogIn size={18} /> Login Now
              </>
            )}
          </button>

          <div className="flex flex-col items-center space-y-3 mt-6 pt-4 border-t border-gray-100">
            <Link className="text-sm text-gray-600 hover:text-red-600 transition-colors" href="/forgotPassword">
              Forgot Password?
            </Link>
            <p className="text-sm text-gray-600">
              New here?
              <Link className="text-red-600 pl-1 font-semibold hover:underline" href="/signup">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}