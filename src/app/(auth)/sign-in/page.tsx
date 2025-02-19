"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignIn = () => {
  const supabaseClient = useSupabaseClient();
  const { session, isLoading } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (session?.user && !isLoading) {
      router.replace('/dashboard');
    }
  }, [session, isLoading, router]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='M0 0h1v1H0zM23 23h1v1h-1z'/%3E%3C/svg%3E")`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glowing tag */}
        <div className="flex justify-center mb-8">
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur-xl" />
            <div className="relative px-6 py-2 bg-[#0A0A0A] rounded-full text-sm text-[#8491A5] border border-[#1D2839]">
              <span className="flex items-center gap-2">
                Sign in to QuickContractAI
              </span>
            </div>
          </div>
        </div>

        {/* Title and description */}
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#E2E8F0] via-[#BAE6FD] to-[#7DD3FC] bg-clip-text text-transparent animate-gradient">
              Welcome back
            </span>
          </h1>
          <p className="text-[#8491A5] text-lg max-w-sm">
            Enter your email to sign in or create an account
          </p>
        </div>

        {/* Auth container with glow */}
        <div className="relative">
          <div className="absolute -inset-1 bg-blue-500/5 rounded-2xl blur-xl" />
          <div className="relative p-8 bg-[#0A0A0A] border border-[#1D2839] rounded-2xl shadow-2xl">
            <Auth
              supabaseClient={supabaseClient}
              providers={[]}
              magicLink={true}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#3B82F6",
                      brandAccent: "#60A5FA",
                      inputBackground: "#0F1117",
                      inputBorder: "#1D2839",
                      inputBorderHover: "#3B82F6",
                      inputBorderFocus: "#3B82F6",
                    },
                    radii: {
                      borderRadiusButton: "9999px",
                      buttonBorderRadius: "9999px",
                      inputBorderRadius: "12px",
                    },
                  },
                },
                className: {
                  button: "select-none font-medium",
                  input: "select-none",
                  label: "text-[#8491A5]",
                  anchor: "text-blue-400 hover:text-blue-300",
                }
              }}
              theme="dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;