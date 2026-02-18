"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

type LoginInput = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("login");
  const tn = useTranslations("nav");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    defaultValues: { email: "", password: "" },
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
    <div className="bg-primary min-h-[calc(100dvh-var(--header-height,80px))]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-6 pb-2">
        <p className="text-white/30 text-xs font-medium">
          <Link href="/" className="hover:text-accent transition-colors">
            {tn("home")}
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-white/60">{t("welcomeBack")}</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 items-center min-h-[70vh]">
          {/* Left Column — Form */}
          <div className="py-8 lg:py-16">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold italic text-white mb-12">
              {t("welcomeBack")}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    {t("password")}
                  </label>
                  <Link
                    href="#"
                    className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-white transition-colors"
                  >
                    {t("forgot")}
                  </Link>
                </div>
                <input
                  {...register("password", {
                    required: t("passwordRequired"),
                    minLength: { value: 6, message: t("minChars") },
                  })}
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  className={`w-full bg-white/5 border ${
                    errors.password
                      ? "border-red-500/50"
                      : "border-white/10 focus:border-accent"
                  } py-4 px-5 text-sm text-white font-medium placeholder:text-white/20 outline-none transition-all`}
                />
                {errors.password && (
                  <p className="text-[10px] font-bold text-red-400 ml-1 uppercase">
                    {errors.password.message}
                  </p>
                )}
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
                  t("signIn")
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                {t("continueWith")}
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Social Login */}
            <div className="flex gap-4">
              <button className="flex-1 bg-white/5 border border-white/10 hover:border-accent/50 text-white font-bold py-3.5 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest cursor-pointer">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#fff"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#fff"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#fff"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#fff"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
            </div>

            {/* Register link */}
            <p className="mt-8 text-sm text-white/40 text-center">
              {t("noAccount")}{" "}
              <Link
                href="/register"
                className="text-accent font-bold hover:text-white transition-colors"
              >
                {t("joinUs")}
              </Link>
            </p>
          </div>

          {/* Right Column — Fashion Images */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-full max-w-lg">
              {/* Main phone mockup / fashion image */}
              <div className="relative aspect-[3/4] w-72 mx-auto">
                <div className="absolute inset-0 bg-white/5 border border-white/10 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop"
                    alt="Fashion"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Overlapping secondary image */}
              <div className="absolute -right-4 top-16 w-48 aspect-[3/4]">
                <div className="absolute inset-0 bg-white/5 border border-white/10 overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop"
                    alt="Fashion accessories"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Accent decorative element */}
              <div className="absolute -left-8 bottom-12 w-40 aspect-square">
                <div className="absolute inset-0 bg-white/5 border border-white/10 overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop"
                    alt="Luxury bag"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
