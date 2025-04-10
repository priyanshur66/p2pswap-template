import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBlockchain } from '@/lib/blockchain-context';

const SecretGenerator = () => {
  const [secret, setSecret] = useState('');
  const [hashedSecret, setHashedSecret] = useState('');
  const [lockId, setLockId] = useState('');
  const [customToken, setCustomToken] = useState(''); // Default to USDT
  const [customTimeout, setCustomTimeout] = useState('3600');
  const [copiedStates, setCopiedStates] = useState({
    secret: false,
    hashedSecret: false,
    lockId: false
  });
  
  const { account, calculateLockId } = useBlockchain();

  const generateSecret = () => {
    try {
      // Generate a random secret
      const randomBytes = ethers.randomBytes(32);
      const secret = ethers.hexlify(randomBytes);
      setSecret(secret);
      
      // Hash the secret using the method from the script
      const hashedSecret = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(["bytes32"], [secret])
      );
      setHashedSecret(hashedSecret);
      
      // Calculate the lock ID using the real context function
      if (account && customToken) {
        const lockId = calculateLockId(
          customToken, 
          account, 
          hashedSecret,
          Number(customTimeout)
        );
        setLockId(lockId);
      }
      
      console.log("🔐 Lock ID:", lockId);
      console.log("🔑 Secret (save this safely):", secret);
      console.log("# Hashed Secret:", hashedSecret);
    } catch (error) {
      console.error("Error generating secret:", error);
    }
  };
  
  // Update lock ID when inputs change
  useEffect(() => {
    if (hashedSecret && account && customToken) {
      const newLockId = calculateLockId(
        customToken, 
        account, 
        hashedSecret,
        Number(customTimeout)
      );
      setLockId(newLockId);
    }
  }, [hashedSecret, account, customToken, customTimeout, calculateLockId]);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedStates(prev => ({ ...prev, [field]: true }));
        setTimeout(() => {
          setCopiedStates(prev => ({ ...prev, [field]: false }));
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Secret Generator</CardTitle>
        <CardDescription>
          Generate a random secret for P2P atomic swaps. Share the hashed secret with the counterparty, but keep the original secret safe until you want to unlock.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customToken">Token Address (for Lock ID calculation)</Label>
            <Input
              id="customToken"
              value={customToken}
              onChange={(e) => setCustomToken(e.target.value)}
              placeholder=""
            />
            <p className="text-xs text-gray-500">Default: USDT on Base Sepolia</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customTimeout">Timeout in Seconds</Label>
            <Input
              id="customTimeout"
              type="number"
              value={customTimeout}
              onChange={(e) => setCustomTimeout(e.target.value)}
              min="60"
            />
            <p className="text-xs text-gray-500">Recommended: 3600 (1 hour) for testing, longer for production use</p>
          </div>
          
          <Button onClick={generateSecret} className="w-full">
            Generate Random Secret
          </Button>
          
          {secret && (
            <>
              <div className="space-y-2">
                <Label htmlFor="secret" className="flex items-center justify-between">
                  <span>Secret (DO NOT SHARE YET)</span>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(secret, 'secret')}
                  >
                    {copiedStates.secret ? "Copied!" : "Copy"}
                  </Button>
                </Label>
                <Input id="secret" value={secret} readOnly className="font-mono text-xs" />
                <p className="text-xs text-red-500 font-semibold">Keep this value private until you want to unlock the tokens!</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hashedSecret" className="flex items-center justify-between">
                  <span>Hashed Secret (SHARE THIS)</span>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(hashedSecret, 'hashedSecret')}
                  >
                    {copiedStates.hashedSecret ? "Copied!" : "Copy"}
                  </Button>
                </Label>
                <Input id="hashedSecret" value={hashedSecret} readOnly className="font-mono text-xs" />
                <p className="text-xs text-green-500 font-semibold">Share this value with your counterparty for the lock</p>
              </div>
              
              {lockId && (
                <div className="space-y-2">
                  <Label htmlFor="lockId" className="flex items-center justify-between">
                    <span>Calculated Lock ID</span>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(lockId, 'lockId')}
                    >
                      {copiedStates.lockId ? "Copied!" : "Copy"}
                    </Button>
                  </Label>
                  <Input id="lockId" value={lockId} readOnly className="font-mono text-xs" />
                </div>
              )}
              
              <div className="bg-gray-100 p-3 rounded-md text-xs font-mono dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                <p className="font-bold mb-2">// Summary of Generated Values</p>
                <p>Secret: <span className="text-red-500">{secret.substring(0, 10)}...{secret.substring(secret.length - 8)}</span> (PRIVATE)</p>
                <p>Hashed Secret: <span className="text-green-500">{hashedSecret.substring(0, 10)}...{hashedSecret.substring(hashedSecret.length - 8)}</span> (PUBLIC)</p>
                {lockId && <p>Lock ID: {lockId.substring(0, 10)}...{lockId.substring(lockId.length - 8)}</p>}
                <p>Creator: {account || "Not connected"}</p>
                <p>Token: {customToken.substring(0, 10)}...{customToken.substring(customToken.length - 8)}</p>
                <p>Timeout: {customTimeout}s</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecretGenerator; 