"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Mail, Lock, User, ArrowRight, Store } from "lucide-react";
import Logo from "@/components/Logo";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterInput) => {
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Registration failed");
        return;
      }

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInResult?.error) {
        setError(signInResult.error);
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 py-6 md:py-8">
      <div className="w-full max-w-2xl">
        {/* Card Container */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 italic-shimmer relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-accent" />

          <div className="p-5 md:p-8 lg:p-12">
            {/* Header */}
            <div className="hidden md:flex flex-col items-center mb-6 md:mb-8 text-center">
              <div className="bg-primary p-3 md:p-4 rounded-xl md:rounded-2xl mb-4 md:mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                <Logo />
              </div>
              <h1 className="text-xl md:text-3xl font-black text-primary tracking-tight mb-1 md:mb-2">
                Create Account
                <span className="text-accent text-2xl md:text-4xl">.</span>
              </h1>
              <p className="text-text-dark/40 text-[9px] md:text-sm font-medium uppercase tracking-[0.2em] md:tracking-widest">
                Join the exclusive community
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-xl md:rounded-2xl">
                <p className="text-red-600 text-[10px] md:text-sm font-medium text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-5"
            >
              {/* Name Field */}
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-dark/30 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                    <User size={16} className="md:w-[18px]" />
                  </div>
                  <input
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 2, message: "Min 2 characters" },
                    })}
                    type="text"
                    placeholder="John Doe"
                    className={`w-full bg-secondary/50 border-2 ${
                      errors.name
                        ? "border-red-500/50"
                        : "border-transparent focus:border-accent"
                    } rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-4 text-sm md:text-base text-primary font-bold placeholder:text-gray-300 outline-none transition-all`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[9px] md:text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-dark/30 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                    <Mail size={16} className="md:w-[18px]" />
                  </div>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email",
                      },
                    })}
                    type="email"
                    placeholder="alex@example.com"
                    className={`w-full bg-secondary/50 border-2 ${
                      errors.email
                        ? "border-red-500/50"
                        : "border-transparent focus:border-accent"
                    } rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-4 text-sm md:text-base text-primary font-bold placeholder:text-gray-300 outline-none transition-all`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[9px] md:text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Fields - Two columns responsive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-dark/30 ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                      <Lock size={16} className="md:w-[18px]" />
                    </div>
                    <input
                      {...register("password", {
                        required: "Required",
                        minLength: { value: 6, message: "Min 6 chars" },
                      })}
                      type="password"
                      placeholder="••••••••"
                      className={`w-full bg-secondary/50 border-2 ${
                        errors.password
                          ? "border-red-500/50"
                          : "border-transparent focus:border-accent"
                      } rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-4 text-sm md:text-base text-primary font-bold placeholder:text-gray-300 outline-none transition-all`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-dark/30 ml-1">
                    Confirm
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                      <Lock size={16} className="md:w-[18px]" />
                    </div>
                    <input
                      {...register("confirmPassword", {
                        required: "Required",
                        validate: (value) => value === password || "No match",
                      })}
                      type="password"
                      placeholder="••••••••"
                      className={`w-full bg-secondary/50 border-2 ${
                        errors.confirmPassword
                          ? "border-red-500/50"
                          : "border-transparent focus:border-accent"
                      } rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-4 text-sm md:text-base text-primary font-bold placeholder:text-gray-300 outline-none transition-all`}
                    />
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-black text-secondary font-black py-4 md:py-5 rounded-xl md:rounded-2xl transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 uppercase text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] disabled:bg-gray-200 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-accent w-0 group-hover:w-full transition-all duration-500 opacity-10" />
                {isSubmitting ? (
                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Become Supplier CTA - Compact version for mobile */}
            <div className="mt-6 md:mt-8 p-3 md:p-4 bg-accent/5 rounded-xl md:rounded-2xl border border-accent/20">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-accent/10 rounded-lg md:rounded-xl">
                  <Store size={16} className="text-accent md:w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] md:text-xs font-bold text-primary">
                    Sell on Casa di Moda?
                  </p>
                  <p className="hidden xs:block text-[8px] md:text-[10px] text-text-dark/50">
                    Register as a supplier today
                  </p>
                </div>
                <Link
                  href="/become-supplier"
                  className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-accent hover:text-primary transition-colors whitespace-nowrap"
                >
                  Apply Now
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 md:mt-8 text-center">
              <p className="text-[10px] md:text-xs font-medium text-text-dark/40">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-accent font-black uppercase tracking-widest hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
