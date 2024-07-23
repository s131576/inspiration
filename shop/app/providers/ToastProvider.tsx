"use client";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ToastProvider = ({ children }: Props) => {
  return (
    <div>
      {children}
      <ToastContainer />
    </div>
  );
};

export default ToastProvider;
