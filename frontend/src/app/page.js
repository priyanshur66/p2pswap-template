import Link from "next/link";
import { Button } from "@/components/ui/button";
import {swapAddress} from "../lib/contractrefs"
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <main className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          Decentralized P2P Token Swap
        </h1>
        
        <p className="text-xl mb-8">
          Safely exchange tokens with hash time-locked contracts on Sepolia network
        </p>
        
        <div className="space-y-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-3">Create Offers</h2>
              <p className="text-gray-600">
                Lock tokens with a hash time-locked contract to create buy or sell offers
              </p>
            </div>
            
            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-3">Safe Exchanges</h2>
              <p className="text-gray-600">
                Trade tokens securely with cryptographic proofs and time locks
              </p>
            </div>
            
            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-3">Full Control</h2>
              <p className="text-gray-600">
                Unlock, retrieve, or decline offers with complete control over your assets
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Link href="/swap">
            <Button size="lg" className="text-lg px-8 py-6 h-auto">
              Start Swapping
            </Button>
          </Link>
        </div>
      </main>
      
      <footer className="mt-16 text-gray-500 text-sm">
        <p>Running on Sepolia Testnet</p>
        <p className="mt-2">Contract address : {swapAddress}</p>
      </footer>
    </div>
  );
}
