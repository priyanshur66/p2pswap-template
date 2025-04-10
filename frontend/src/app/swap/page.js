"use client";

import { BlockchainProvider } from "@/lib/blockchain-context";
import WalletConnect from "@/components/swap/WalletConnect";
import SwapTabs from "@/components/swap/SwapTabs";
import EventsList from "@/components/swap/EventsList";
import { Toaster } from "@/components/ui/toaster";

export default function SwapPage() {
  return (
    <BlockchainProvider>
      <div className="min-h-screen p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">P2P Token Swap</h1>
          <WalletConnect />
        </header>

        <main className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <SwapTabs />
            </div>
            <div>
              <EventsList />
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </BlockchainProvider>
  );
} 