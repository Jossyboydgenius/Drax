"use client"

import { useCallback, useEffect, useState } from "react";
import type { Hex } from "viem";
import { useAccount, useConnect, usePublicClient, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { cbWalletConnector } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { Avatar, Address } from "@coinbase/onchainkit/identity";
import { Copy, ExternalLink, Wallet, User } from "lucide-react";
import { toast } from "sonner";

export interface SmartWalletConnectionProps {
  className?: string;
  buttonLabel?: string;
}

const SmartWalletConnection: React.FC<SmartWalletConnectionProps> = ({ 
  className, 
  buttonLabel = "Connect Smart Wallet" 
}) => {
  const { connect } = useConnect({
    mutation: {
      onSuccess: (data) => {
        const address = data.accounts[0];
        const chainId = data.chainId;
        const m = new SiweMessage({
          domain: document.location.host,
          address,
          chainId,
          uri: document.location.origin,
          version: "1",
          statement: "DeGen Smart Wallet SIWE Authentication",
          nonce: "12345678",
        });
        setMessage(m);
        signMessage({ message: m.prepareMessage() });
      },
    },
  });
  
  const account = useAccount();
  const client = usePublicClient();
  const [signature, setSignature] = useState<Hex | undefined>(undefined);
  const { signMessage } = useSignMessage({
    mutation: { onSuccess: (sig) => setSignature(sig) },
  });
  const [message, setMessage] = useState<SiweMessage | undefined>(undefined);
  const [valid, setValid] = useState<boolean | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  const checkValid = useCallback(async () => {
    if (!signature || !account.address || !client || !message) return;

    client
      .verifyMessage({
        address: account.address,
        message: message.prepareMessage(),
        signature,
      })
      .then((v) => setValid(v));
  }, [signature, account, client, message]);

  useEffect(() => {
    checkValid();
  }, [checkValid]);

  // Format address for display
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return ""
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  // Copy address to clipboard
  const copyAddress = () => {
    if (account.address) {
      navigator.clipboard.writeText(account.address)
      setCopied(true)
      toast("Address copied", {
        description: "Smart Wallet address copied to clipboard",
        duration: 2000,
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Open block explorer
  const openExplorer = () => {
    if (account.address) {
      const chainId = account.chainId;
      const baseUrl = chainId === 8453 ? "https://basescan.org" : "https://sepolia.basescan.org";
      window.open(`${baseUrl}/address/${account.address}`, "_blank")
    }
  }

  // Custom styled connect button
  const CustomConnectButton = () => (
    <Button variant="default" className={`${className} flex items-center gap-2`}>
      <Wallet className="h-4 w-4" />
      {buttonLabel}
    </Button>
  )

  return (
    <div className={className}>
      {!account.isConnected ? (
        <Button 
          onClick={() => connect({ connector: cbWalletConnector })}
          className="flex items-center gap-2 bg-blue-800 dark:bg-blue-800 hover:bg-blue-900"
        >
          <User size={16} />
          {buttonLabel}
        </Button>
      ) : (
        <div className="flex items-center gap-2 text-white">
          <div className="h-6 w-6 overflow-hidden rounded-full">
            <Avatar address={account.address} className="h-full w-full bg-white dark:bg-blue-800" />
          </div>
          <span className="hidden sm:inline">{formatAddress(account.address)}</span>
          {valid && (
            <span className="text-xs bg-green-600 px-2 py-1 rounded">Verified</span>
          )}
        </div>
      )}

      {account.isConnected && (
        <div className="mt-4 p-4 border rounded-lg bg-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 overflow-hidden rounded-full">
              <Avatar address={account.address} className="h-full w-full" />
            </div>
            <div>
              <Address address={account.address} className="text-sm font-medium" />
              <div className="text-xs text-muted-foreground">
                Smart Wallet • {account.chainId === 8453 ? "Base" : "Base Sepolia"}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={copyAddress}>
              <Copy className="mr-1 h-3 w-3" />
              Copy
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={openExplorer}>
              <ExternalLink className="mr-1 h-3 w-3" />
              Explorer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SmartWalletConnection 

export { SmartWalletConnection }; 