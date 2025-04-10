import { useBlockchain } from '@/lib/blockchain-context';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Copy, CheckCircle2, Unlock as UnlockIcon, X as XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const EventsList = () => {
  const { events, account, isConnected, refreshEvents, unlock, decline } = useBlockchain();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [unlockingEvent, setUnlockingEvent] = useState(null);
  const [unlockSecret, setUnlockSecret] = useState('');
  const [unlockStatus, setUnlockStatus] = useState(null);
  const [decliningEvent, setDecliningEvent] = useState(null);
  const [declineStatus, setDeclineStatus] = useState(null);

  // Filter events to only show where the recipient is the logged-in account
  const recipientEvents = events.filter(event => 
    event.recipient && event.recipient.toLowerCase() === account?.toLowerCase()
    
  );

  // Refresh when account changes
  useEffect(() => {
    if (isConnected && account) {
      handleRefresh();
    }
  }, [account, isConnected]);

  // Add debugging info
  useEffect(() => {
    console.log('EventsList - All events:', events.length);
    console.log('EventsList - Recipient events:', recipientEvents.length);
    console.log('EventsList - Current account:', account);
  }, [events, recipientEvents, account]);
  
  // Function to handle manual refresh
  const handleRefresh = async () => {
    if (!isConnected) {
      console.log("Cannot refresh events - not connected");
      return;
    }
    
    setIsRefreshing(true);
    try {
      console.log("Refreshing events");
      await refreshEvents();
      console.log("Events refreshed");
    } catch (error) {
      console.error("Error refreshing events:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = async (text, fieldId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Format address for display only (full value stored for copying)
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format hash values like addresses
  const formatHash = (hash) => {
    if (!hash) return '';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  // Format value by dividing by 1000000
  const formatValue = (value) => {
    if (!value) return '0';
    try {
      const numValue = BigInt(value);
      // Format with 6 decimal places
      const intPart = numValue / BigInt(1000000);
      const fracPart = numValue % BigInt(1000000);
      // Pad with leading zeros
      const fracString = fracPart.toString().padStart(6, '0');
      return `${intPart}.${fracString}`;
    } catch (error) {
      console.error("Error formatting value:", error);
      return value;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get event color by type
  const getEventColor = (type) => {
    switch (type) {
      case 'LockBuy':
        return 'bg-blue-50 border-blue-200';
      case 'LockSell':
        return 'bg-green-50 border-green-200';
      case 'Unlock':
        return 'bg-purple-50 border-purple-200';
      case 'Retrieve':
        return 'bg-yellow-50 border-yellow-200';
      case 'Decline':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Handle unlock event
  const handleUnlock = async (event) => {
    if (!event || !isConnected) return;
    
    setUnlockingEvent(event);
    setUnlockSecret('');
    setUnlockStatus(null);
  };

  // Execute the unlock function
  const executeUnlock = async () => {
    if (!unlockingEvent || !unlockSecret || !isConnected) return;
    
    try {
      setUnlockStatus('processing');
      
      // Convert the secret from hex if it has a 0x prefix
      let secretBytes32;
      if (unlockSecret.startsWith('0x')) {
        secretBytes32 = unlockSecret;
      } else {
        // Convert text to bytes32
        const encoder = new TextEncoder();
        const encoded = encoder.encode(unlockSecret);
        const buffer = Buffer.from(encoded);
        secretBytes32 = '0x' + buffer.toString('hex').padEnd(64, '0');
      }
      
      console.log("Unlocking with:", {
        token: unlockingEvent.token,
        creator: unlockingEvent.creator,
        secret: secretBytes32,
        timeout: unlockingEvent.timeout
      });
      
      await unlock(
        unlockingEvent.token,
        unlockingEvent.creator,
        secretBytes32,
        unlockingEvent.timeout
      );
      
      setUnlockStatus('success');
      setTimeout(() => {
        setUnlockingEvent(null);
        setUnlockStatus(null);
        handleRefresh();
      }, 2000);
    } catch (error) {
      console.error("Unlock error:", error);
      setUnlockStatus('error');
    }
  };

  // Handle decline event
  const handleDecline = async (event) => {
    if (!event || !isConnected) return;
    
    setDecliningEvent(event);
    setDeclineStatus(null);
  };

  // Execute the decline function
  const executeDecline = async () => {
    if (!decliningEvent || !isConnected) return;
    
    try {
      setDeclineStatus('processing');
      
      console.log("Declining with:", {
        token: decliningEvent.token,
        creator: decliningEvent.creator,
        hashedSecret: decliningEvent.hashedSecret,
        timeout: decliningEvent.timeout
      });
      
      await decline(
        decliningEvent.token,
        decliningEvent.creator,
        decliningEvent.hashedSecret,
        decliningEvent.timeout
      );
      
      setDeclineStatus('success');
      setTimeout(() => {
        setDecliningEvent(null);
        setDeclineStatus(null);
        handleRefresh();
      }, 2000);
    } catch (error) {
      console.error("Decline error:", error);
      setDeclineStatus('error');
    }
  };

  // Create copy button component
  const CopyButton = ({ text, fieldId }) => (
    <button
      onClick={() => copyToClipboard(text, fieldId)}
      className="ml-2 inline-flex items-center justify-center rounded-md p-1 hover:bg-gray-100"
      title="Copy to clipboard"
    >
      {copiedField === fieldId ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-gray-500" />
      )}
    </button>
  );

  // Render a data field with copy button
  const DataField = ({ label, value, displayValue, fieldId }) => {
    if (!value) return null;
      
    return (
      <div className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded">
        <span className="font-medium">{label}:</span>
        <div className="flex items-center">
          <span className="font-mono">{displayValue || value}</span>
          <CopyButton text={value} fieldId={`${fieldId}-${label}`} />
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Recipient Events</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isRefreshing || !isConnected}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isConnected ? (
            <p className="text-sm text-muted-foreground">Connect your wallet to see events</p>
          ) : recipientEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recipient events to display</p>
          ) : (
            <>
              {/* Unlock Dialog */}
              {unlockingEvent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-5 rounded-lg max-w-md w-full">
                    <h3 className="text-lg font-bold mb-4">Unlock Event</h3>
                    
                    <div className="mb-4">
                      <p className="text-sm mb-2">
                        <span className="font-medium">Event Type:</span> {unlockingEvent.type}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Token:</span> {formatHash(unlockingEvent.token)}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Creator:</span> {formatAddress(unlockingEvent.creator)}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Value:</span> {formatValue(unlockingEvent.value)}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1" htmlFor="secret">
                        Enter Secret
                      </label>
                      <input
                        type="text"
                        id="secret"
                        className="w-full p-2 border rounded"
                        value={unlockSecret}
                        onChange={(e) => setUnlockSecret(e.target.value)}
                        placeholder="Enter secret (raw text or 0x hex format)"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the secret provided by the creator to unlock this event
                      </p>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setUnlockingEvent(null)}
                        disabled={unlockStatus === 'processing'}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={executeUnlock}
                        disabled={!unlockSecret || unlockStatus === 'processing'}
                        className={`
                          ${unlockStatus === 'processing' ? 'bg-blue-400' : ''}
                          ${unlockStatus === 'success' ? 'bg-green-500' : ''}
                          ${unlockStatus === 'error' ? 'bg-red-500' : ''}
                        `}
                      >
                        {unlockStatus === 'processing' ? 'Processing...' : 
                         unlockStatus === 'success' ? 'Success!' : 
                         unlockStatus === 'error' ? 'Failed' : 'Unlock'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Decline Dialog */}
              {decliningEvent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-5 rounded-lg max-w-md w-full">
                    <h3 className="text-lg font-bold mb-4">Decline Event</h3>
                    
                    <div className="mb-4">
                      <p className="text-sm mb-2">
                        <span className="font-medium">Event Type:</span> {decliningEvent.type}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Token:</span> {formatHash(decliningEvent.token)}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Creator:</span> {formatAddress(decliningEvent.creator)}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Value:</span> {formatValue(decliningEvent.value)}
                      </p>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4">
                      Are you sure you want to decline this event? This will return the funds to the creator.
                    </p>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setDecliningEvent(null)}
                        disabled={declineStatus === 'processing'}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={executeDecline}
                        disabled={declineStatus === 'processing'}
                        variant="destructive"
                        className={`
                          ${declineStatus === 'processing' ? 'bg-red-400' : ''}
                          ${declineStatus === 'success' ? 'bg-green-500' : ''}
                          ${declineStatus === 'error' ? 'bg-red-700' : ''}
                        `}
                      >
                        {declineStatus === 'processing' ? 'Processing...' : 
                         declineStatus === 'success' ? 'Success!' : 
                         declineStatus === 'error' ? 'Failed' : 'Decline'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {recipientEvents.map((event, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-md border ${getEventColor(event.type)}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-lg">{event.type}</h4>
                    <span className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</span>
                  </div>
                  
                  <div className="space-y-1 text-sm divide-y">
                    <DataField 
                      label="Token" 
                      value={event.token} 
                      displayValue={formatHash(event.token)}
                      fieldId={`event-${index}`} 
                    />
                    
                    <DataField 
                      label="Creator" 
                      value={event.creator} 
                      displayValue={formatAddress(event.creator)}
                      fieldId={`event-${index}`}
                    />
                    
                    <DataField 
                      label="Recipient" 
                      value={event.recipient} 
                      displayValue={formatAddress(event.recipient)}
                      fieldId={`event-${index}`}
                    />
                    
                    <DataField 
                      label="Hashed Secret" 
                      value={event.hashedSecret} 
                      displayValue={formatHash(event.hashedSecret)}
                      fieldId={`event-${index}`}
                    />
                    
                    <DataField 
                      label="Timeout" 
                      value={event.timeout ? event.timeout.toString() : ''} 
                      fieldId={`event-${index}`}
                    />
                    
                    <DataField 
                      label="Value" 
                      value={event.value} 
                      displayValue={formatValue(event.value)}
                      fieldId={`event-${index}`}
                    />
                    
                    <DataField 
                      label="Lock ID" 
                      value={event.lockId} 
                      displayValue={formatHash(event.lockId)}
                      fieldId={`event-${index}`}
                    />
                    
                    <DataField 
                      label="Sell Asset ID" 
                      value={event.sellAssetId} 
                      displayValue={formatHash(event.sellAssetId)}
                      fieldId={`event-${index}`}
                    />
                    
                    <DataField 
                      label="Sell Price" 
                      value={event.sellPrice} 
                      displayValue={event.sellPrice ? formatValue(event.sellPrice) : ''}
                      fieldId={`event-${index}`}
                    />
                    
                    <DataField 
                      label="Buy Asset ID" 
                      value={event.buyAssetId} 
                      displayValue={formatHash(event.buyAssetId)}
                      fieldId={`event-${index}`}
                    />
                    
                    <DataField 
                      label="Buy Lock ID" 
                      value={event.buyLockId} 
                      displayValue={formatHash(event.buyLockId)}
                      fieldId={`event-${index}`}
                    />
                    
                    {/* LockBuy and LockSell events can be unlocked or declined */}
                    {(event.type === 'LockBuy' || event.type === 'LockSell') && (
                      <div className="pt-3 mt-2 flex space-x-2">
                        <Button 
                          onClick={() => handleUnlock(event)}
                          size="sm"
                          className="flex-1 flex items-center justify-center"
                        >
                          <UnlockIcon className="h-4 w-4 mr-2" />
                          Unlock
                        </Button>
                        <Button 
                          onClick={() => handleDecline(event)}
                          size="sm"
                          variant="destructive"
                          className="flex-1 flex items-center justify-center"
                        >
                          <XIcon className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
      {isConnected && recipientEvents.length > 0 && (
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Showing {recipientEvents.length} recipient event{recipientEvents.length !== 1 ? 's' : ''}
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default EventsList; 