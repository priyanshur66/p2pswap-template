import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBlockchain } from '@/lib/blockchain-context';

const Decline = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [creator, setCreator] = useState('');
  const [hashedSecret, setHashedSecret] = useState('');
  const [timeout, setTimeout] = useState(3600); // 1 hour in seconds
  const [loading, setLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const {
    decline,
    isConnected,
    getTokenBalance
  } = useBlockchain();

  // Fetch token balance when tokenAddress changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (tokenAddress && ethers.isAddress(tokenAddress) && isConnected) {
        setBalanceLoading(true);
        try {
          const balance = await getTokenBalance(tokenAddress);
          setTokenBalance(balance);
        } catch (error) {
          console.error("Error fetching token balance:", error);
          setTokenBalance(null);
        } finally {
          setBalanceLoading(false);
        }
      } else {
        setTokenBalance(null);
      }
    };
    
    fetchBalance();
  }, [tokenAddress, isConnected, getTokenBalance]);

  const handleTokenAddressChange = (e) => {
    setTokenAddress(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!isConnected) {
        throw new Error("Wallet not connected");
      }
      
      if (!tokenAddress || !ethers.isAddress(tokenAddress)) {
        alert("Please enter a valid token address");
        return;
      }
      
      if (!creator || !ethers.isAddress(creator)) {
        alert("Please enter a valid creator address");
        return;
      }
      
      if (!hashedSecret) {
        alert("Please enter the hashed secret");
        return;
      }
      
      setLoading(true);
      console.log("Submitting decline transaction with parameters:", {
        tokenAddress,
        creator,
        hashedSecret,
        timeout: Number(timeout)
      });
      
      await decline(
        tokenAddress,
        creator,
        hashedSecret,
        Number(timeout)
      );
    } catch (error) {
      console.error("Error in decline transaction:", error);
      alert(`Transaction failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Decline</CardTitle>
        <CardDescription>
          Decline a swap offer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tokenAddress">Token Address</Label>
            <Input
              id="tokenAddress"
              placeholder="0x..."
              value={tokenAddress}
              onChange={handleTokenAddressChange}
              required
            />
            {balanceLoading ? (
              <p className="text-xs text-gray-500">Loading balance...</p>
            ) : tokenBalance ? (
              <p className="text-xs text-gray-500">
                Balance: {tokenBalance.formatted} {tokenBalance.symbol}
              </p>
            ) : (
              <p className="text-xs text-gray-500">Enter token address to see balance</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="creator">Creator Address</Label>
            <Input
              id="creator"
              placeholder="0x..."
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hashedSecret">Hashed Secret</Label>
            <Input
              id="hashedSecret"
              placeholder="0x..."
              value={hashedSecret}
              onChange={(e) => setHashedSecret(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeout">Timeout (seconds)</Label>
            <Input
              id="timeout"
              type="number"
              min="60"
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading || !isConnected}>
            {loading ? "Processing..." : "Decline"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Decline; 