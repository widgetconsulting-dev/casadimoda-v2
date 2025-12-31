"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import Logo from "@/components/Logo";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  type LoginInput = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }: LoginInput) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        alert(result.error);
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Card Container */}
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 italic-shimmer relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-accent" />

          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="bg-primary p-4 rounded-2xl mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                <Logo />
              </div>
              <h1 className="text-3xl font-black text-primary tracking-tight mb-2">
                Welcome Back<span className="text-accent text-4xl">.</span>
              </h1>
              <p className="text-text-dark/40 text-sm font-medium uppercase tracking-widest">
                Access your exclusive account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email format",
                      },
                    })}
                    type="email"
                    placeholder="alex@example.com"
                    className={`w-full bg-secondary/50 border-2 ${
                      errors.email
                        ? "border-red-500/50"
                        : "border-transparent focus:border-accent"
                    } rounded-2xl py-4 pl-12 pr-4 text-primary font-bold placeholder:text-gray-300 outline-none transition-all`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-[10px] font-black uppercase tracking-widest text-accent hover:text-primary transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters",
                      },
                    })}
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-secondary/50 border-2 ${
                      errors.password
                        ? "border-red-500/50"
                        : "border-transparent focus:border-accent"
                    } rounded-2xl py-4 pl-12 pr-4 text-primary font-bold placeholder:text-gray-300 outline-none transition-all`}
                  />
                </div>
                {errors.password && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-black text-secondary font-black py-5 rounded-2xl transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 uppercase text-xs tracking-[0.3em] disabled:bg-gray-200 disabled:text-gray-400 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-accent w-0 group-hover:w-full transition-all duration-500 opacity-10" />
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-10 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-dark/20 mb-6">
                Or continue with
              </p>
              <button className="w-full bg-secondary hover:bg-gray-200 text-primary font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest cursor-pointer border border-gray-100">
                <GoogleIcon className="w-5 h-5" />
                Google Account
              </button>

              <p className="mt-10 text-xs font-medium text-text-dark/40">
                Don&apos;t have an exclusive account?{" "}
                <Link
                  href="#"
                  className="text-accent font-black uppercase tracking-widest hover:underline"
                >
                  Join Us
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
