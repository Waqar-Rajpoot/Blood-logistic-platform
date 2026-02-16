"use client";

import React, { useState, Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, ShieldCheck, Lock, ArrowLeft, Fingerprint } from "lucide-react";
import { resetPasswordSchema } from "@/schema/resetPasswordSchema";
import { ErrorResponse } from "@/utils/ErrorResponse";

// 1. Logic Component - Styling updated to Blood Logistics theme
const ResetPasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const username = searchParams.get("username");
  const code = searchParams.get("code");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      if (!username || !code) {
        toast.error("Invalid request. Missing username or verification code.");
        router.replace("/forgot-password");
        return;
      }

      const resetData = {
        username: username,
        code: code,
        newPassword: data.newPassword,
      };

      const response = await axios.post("/api/users/resetPassword", resetData);
      toast.success(response.data.message || "Password reset successfully");
      router.replace("/login");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/60">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="newPassword"
            control={form.control}
            render={({ field }: any) => (
              <FormItem>
                <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-slate-400">
                  New Secure Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <Input
                      placeholder="••••••••"
                      {...field}
                      className="pl-12 pr-12 h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 focus:ring-rose-500 focus:border-rose-500 transition-all"
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-600 transition-colors"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-rose-600 text-xs font-medium" />
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }: any) => (
              <FormItem>
                <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-slate-400">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <Input
                      placeholder="••••••••"
                      {...field}
                      className="pl-12 pr-12 h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 focus:ring-rose-500 focus:border-rose-500 transition-all"
                      type={showPassword ? "text" : "password"}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-rose-600 text-xs font-medium" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-16 rounded-2xl bg-rose-600 text-white font-bold uppercase tracking-wider hover:bg-rose-700 active:scale-[0.98] transition-all shadow-lg shadow-rose-200"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-6 w-6" />
            ) : (
              "Update Secure Password"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-8 pt-6 border-t border-slate-50 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-slate-500 text-sm font-semibold hover:text-rose-600 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return to <span className="underline decoration-rose-200 underline-offset-4">Log In</span>
        </Link>
      </div>
    </div>
  );
};

// 2. Layout Wrapper - Background and Branding updated
const ResetPassword = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-rose-50 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-blue-50 rounded-full blur-[100px]" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 text-white shadow-xl mb-6">
             <Fingerprint size={32} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Secure <span className="text-rose-600">Access</span>
          </h2>
          <p className="text-slate-500 font-medium mt-3 text-sm leading-relaxed">
            Please create a strong password to protect <br className="hidden md:block" />
            your donor profile and sensitive data.
          </p>
        </div>

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl">
            <Loader2 className="animate-spin h-10 w-10 text-rose-600 mb-4" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Securing Connection...</p>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>

        <p className="text-center mt-10 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-300">
          Blood Logistics • Secure Protocol 2026
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;