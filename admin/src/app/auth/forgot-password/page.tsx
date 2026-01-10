"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ForgotPasswordFormData>();

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Password reset link sent to your email");
        reset(); // clear form
      } else {
        toast.error(result.message || "Failed to send password reset email");
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    //   <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
    //     <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
    //     <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
    //       <div>
    //         <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
    //         <input
    //           type="email"
    //           placeholder="you@example.com"
    //           {...register("email", { required: "Email is required" })}
    //           className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 ${errors.email ? "border-red-500" : "border-gray-300"}`}
    //         />
    //         {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
    //       </div>

    //       <button
    //         type="submit"
    //         disabled={loading}
    //         className="w-full bg-red-700 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-600 transition"
    //       >
    //         {loading ? "Sending..." : "Send Reset Link"}
    //       </button>
    //     </form>
    //   </div>
    // </div>
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/images/logo.png"
            alt="MYSMME Logo"
            width={56}
            height={56}
            priority
          />
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">
            Forgot Password
          </h1>
          <p className="text-sm text-gray-500">
            Enter your registred email id to reset password
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              {...register("email", { required: "Email is required" })}
              className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 ${errors.email ? "border-red-500" : "border-gray-200"
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-red-700 py-3 text-md font-bold text-white transition hover:bg-red-600 active:scale-[0.98] cursor-pointer"
          >
            {loading ? "Sending Reset Link..." : "Send Reset Link"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="font-semibold text-gray-900 hover:underline"
          >
            Login
          </a>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;
