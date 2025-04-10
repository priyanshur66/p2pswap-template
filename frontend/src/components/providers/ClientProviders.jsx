"use client";

import { BlockchainProvider } from "@/lib/blockchain-context";
import { Toaster } from "@/components/ui/toaster";

export function ClientProviders({ children }) {
  return (
    <BlockchainProvider>
      {children}
      <Toaster />
    </BlockchainProvider>
  );
} 