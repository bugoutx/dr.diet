"use client";

import "sonner/dist/styles.css";
import { Toaster } from "sonner";

export default function AdminToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "border-slate-200 shadow-lg",
          success: "text-drd-primary",
          error: "text-red-600",
        },
      }}
    />
  );
}
