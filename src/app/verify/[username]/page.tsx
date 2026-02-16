"use client";
import { verifySchema } from "@/schema/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, RotateCcw, Droplets } from "lucide-react";
import { ApiError } from "next/dist/server/api-utils";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const searchParams = useSearchParams();
  const emailType = searchParams.get("emailType");

  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [remainingTries, setRemainingTries] = useState<number | null>(null);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const onResendCode = async () => {
    if (countdown > 0 || remainingTries === 0) return;
    setIsResending(true);
    try {
      const response = await axios.post("/api/resend-code", {
        username: params.username,
        emailType,
      });
      toast.success(response.data.message);
      setRemainingTries(response.data.remainingTries);
      setCountdown(60);
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      toast.error(axiosError.response?.data?.message || "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
        emailType,
      });
      toast.success(response.data.message);
      if (emailType === "RESET") {
        router.replace(`/resetPassword?username=${params.username}&code=${data.code}`);
      } else {
        router.replace("/login");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast.error(
        axiosError.response?.data?.message ?? "An error occurred during verification."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl border border-rose-100">
        
        {/* Header Section - Themed for Blood Logistics */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-50 mb-6 border-4 border-white shadow-inner">
            <Droplets className="h-10 w-10 text-rose-600 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Security <span className="text-rose-600">Check</span>
          </h1>
          <p className="mt-3 text-slate-500 text-sm font-medium">
            Enter the 6-digit code sent to your email to verify your life-saving account.
            <span className="block text-rose-500 font-semibold mt-2">Code valid for 5 minutes</span>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
                    Enter Verification Code
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <React.Fragment key={index}>
                            <InputOTPSlot
                              index={index}
                              className="w-10 h-14 sm:w-12 sm:h-16 text-2xl font-bold bg-slate-50 border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-rose-100 focus:border-rose-500 transition-all shadow-sm"
                            />
                          </React.Fragment>
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-rose-600 font-medium text-xs mt-3" />
                </FormItem>
              )}
            />

            <div className="space-y-6">
              <Button
                type="submit"
                className="w-full bg-rose-600 text-white hover:bg-rose-700 h-16 rounded-3xl text-lg font-bold transition-all active:scale-95 shadow-lg shadow-rose-200"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" /> 
                    <span>VERIFYING...</span>
                  </>
                ) : (
                  "CONFIRM & VERIFY"
                )}
              </Button>

              {/* Resend Section */}
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={onResendCode}
                  disabled={countdown > 0 || isResending || remainingTries === 0}
                  className="flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-800 transition-colors disabled:text-slate-300 disabled:cursor-not-allowed group"
                >
                  {isResending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                  )}
                  {countdown > 0 ? `Resend Code in ${countdown}s` : "Didn't get the code? Resend"}
                </button>

                {remainingTries !== null && (
                  <p className="text-xs font-semibold text-rose-400 bg-rose-50 px-3 py-1 rounded-full">
                    {remainingTries > 0 
                      ? `${remainingTries} attempts left today` 
                      : "Daily limit reached."}
                  </p>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;