"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import { Store } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("register");
  const tn = useTranslations("nav");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
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
      const e = err as Error;
      setError(e.message || "An error occurred");
    }
  };

  return (
    <div className="bg-primary min-h-[calc(100dvh-var(--header-height,80px))]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-6 pb-2">
        <p className="text-white/30 text-xs font-medium">
          <Link href="/" className="hover:text-accent transition-colors">
            {tn("home")}
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-white/60">{t("createAccount")}</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 items-start min-h-[70vh]">
          {/* Left Column — Form */}
          <div className="py-8 lg:py-12">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold italic text-white mb-10">
              {t("createAccount")}
            </h1>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-sm font-medium text-center">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  {t("fullName")}
                </label>
                <input
                  {...register("name", {
                    required: t("nameRequired"),
                    minLength: { value: 2, message: t("nameMinChars") },
                  })}
                  type="text"
                  placeholder={t("fullNamePlaceholder")}
                  className={`w-full bg-white/5 border ${
                    errors.name
                      ? "border-red-500/50"
                      : "border-white/10 focus:border-accent"
                  } py-4 px-5 text-sm text-white font-medium placeholder:text-white/20 outline-none transition-all`}
                />
                {errors.name && (
                  <p className="text-[10px] font-bold text-red-400 ml-1 uppercase">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  {t("emailAddress")}
                </label>
                <input
                  {...register("email", {
                    required: t("emailRequired"),
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: t("invalidEmail"),
                    },
                  })}
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  className={`w-full bg-white/5 border ${
                    errors.email
                      ? "border-red-500/50"
                      : "border-white/10 focus:border-accent"
                  } py-4 px-5 text-sm text-white font-medium placeholder:text-white/20 outline-none transition-all`}
                />
                {errors.email && (
                  <p className="text-[10px] font-bold text-red-400 ml-1 uppercase">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    {t("password")}
                  </label>
                  <input
                    {...register("password", {
                      required: t("passwordRequired"),
                      minLength: { value: 6, message: t("passwordMinChars") },
                    })}
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    className={`w-full bg-white/5 border ${
                      errors.password
                        ? "border-red-500/50"
                        : "border-white/10 focus:border-accent"
                    } py-4 px-5 text-sm text-white font-medium placeholder:text-white/20 outline-none transition-all`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    {t("confirm")}
                  </label>
                  <input
                    {...register("confirmPassword", {
                      required: t("passwordRequired"),
                      validate: (value) => value === password || t("noMatch"),
                    })}
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    className={`w-full bg-white/5 border ${
                      errors.confirmPassword
                        ? "border-red-500/50"
                        : "border-white/10 focus:border-accent"
                    } py-4 px-5 text-sm text-white font-medium placeholder:text-white/20 outline-none transition-all`}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/80 text-primary font-black py-4 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase text-xs tracking-[0.3em] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  t("submit")
                )}
              </button>
            </form>

            {/* Become Supplier CTA */}
            <div className="mt-8 p-4 bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10">
                  <Store size={18} className="text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white/80">
                    {t("sellOnCasa")}
                  </p>
                  <p className="text-[10px] text-white/40">
                    {t("registerAsSupplier")}
                  </p>
                </div>
                <Link
                  href="/become-supplier"
                  className="text-[10px] font-black uppercase tracking-widest text-accent hover:text-white transition-colors whitespace-nowrap"
                >
                  {t("applyNow")}
                </Link>
              </div>
            </div>

            {/* Sign in link */}
            <p className="mt-6 text-sm text-white/40 text-center">
              {t("alreadyHaveAccount")}{" "}
              <Link
                href="/login"
                className="text-accent font-bold hover:text-white transition-colors"
              >
                {t("signIn")}
              </Link>
            </p>
          </div>

          {/* Right Column — Product Showcase */}
          <div className="hidden lg:block py-12">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=650&fit=crop"
                  alt="Luxury bag"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-bold text-sm">Louis Vuitton</p>
                  <p className="text-accent text-xs font-bold">5,500 TND</p>
                </div>
              </div>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=650&fit=crop"
                  alt="Designer bag"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-bold text-sm">Versace</p>
                  <p className="text-accent text-xs font-bold">1,400 TND</p>
                </div>
              </div>
              <div className="col-span-2 relative aspect-[2/1] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=400&fit=crop"
                  alt="Fashion collection"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold">
                    Collection
                  </p>
                  <p className="text-white font-bold text-sm">
                    Nouvelles Arrivées
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
