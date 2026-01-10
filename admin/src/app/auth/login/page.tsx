"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;

}

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormData>();
    const router = useRouter()
    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (res.ok && result.data?.user) {
                const role = result.data.user.role;

                if (role === "admin") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/user/dashboard");
                }
            } else {
                toast.error(result.message || "Login failed");
            }

        } catch (err) {
            toast.error("Internal Server Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-white px-4">
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
                        Welcome back
                    </h1>
                    <p className="text-sm text-gray-500">
                        Sign in to continue to MYSMME
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

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password", { required: "Password is required" })}
                                className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 ${errors.password ? "border-red-500" : "border-gray-200"
                                    }`}
                            />
                            <span
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </span>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-600">
                            <input
                                type="checkbox"
                                {...register("rememberMe")}
                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                            />
                            Remember me
                        </label>

                        <Link
                            href="/auth/forgot-password"
                            className="font-medium text-red-600 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>


                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full rounded-xl bg-red-700 py-3 text-md font-bold text-white transition hover:bg-red-600 active:scale-[0.98] cursor-pointer"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-gray-500">
                    Don’t have an account?{" "}
                    <a href="" className="font-semibold text-gray-900 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </main>
    );
};

export default Login;
