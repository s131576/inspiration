"use client";
import queryClient from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import Footer from "../components/footer/Footer";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <SessionProvider>
    <QueryClientProvider client={queryClient}>
      {children}
      <Footer />
      </QueryClientProvider>
    </SessionProvider>
    ;
};

export default AuthProvider;
