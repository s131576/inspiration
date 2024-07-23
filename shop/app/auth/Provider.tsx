"use client";
import queryClient from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <SessionProvider>
    <QueryClientProvider client={queryClient}>
      {children}
      </QueryClientProvider>
    </SessionProvider>
    ;
};

export default AuthProvider;
