"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

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
import { Loader2, Mail, ArrowLeft, Send, HeartPulse } from "lucide-react";
import { emailSchema } from "@/schema/emailSchema";
import { ErrorResponse } from "@/utils/ErrorResponse";

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.post("/api/users/forgotPassword", {
        email: data.email,
      });

      toast.success(response.data.message);
      const { username, emailType } = response.data;
      
      router.replace(`/verify/${username}?emailType=${emailType}`);

    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || "Something went wrong. Please try again.";
      console.error("Forgot password error:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Medical-themed Background Accents */}
      <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-rose-50 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px]" />

      <div className="w-full max-w-md z-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-200 mb-6 rotate-3">
            <HeartPulse size={32} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Forgot <span className="text-rose-600">Password?</span>
          </h2>
          <p className="text-slate-500 font-medium mt-3 text-sm leading-relaxed">
            No worries. Enter your registered email and we&apos;ll send <br className="hidden md:block" /> 
            a secure recovery code to your inbox.
          </p>
        </div>

        {/* Clean Professional Card */}
        <div className="bg-white border border-slate-100 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/60">
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-slate-400">
                      Registered Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <Input
                          placeholder="name@example.com"
                          {...field}
                          className="pl-12 h-14 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-rose-500 focus:border-rose-500 transition-all"
                          required
                          type="email"
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
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    <span>SENDING...</span>
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Recovery Code <Send size={18} />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-slate-500 text-sm font-semibold hover:text-rose-600 transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to <span className="underline decoration-rose-200 underline-offset-4">Sign In</span>
            </Link>
          </div>
        </div>

        {/* Brand Footer */}
        <p className="text-center mt-10 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-300">
          Blood Logistics Platform &copy; 2026
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;