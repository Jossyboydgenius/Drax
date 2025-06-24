'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster as SonnerToaster } from 'sonner';
import { OnchainKitProvider } from "@coinbase/onchainkit"
// import { base } from "wagmi/chains"
import { useCustomTheme, ThemeProviderCustom } from "@/lib/theme-context"
import { http, createConfig, WagmiProvider } from 'wagmi'
import { baseSepolia, base } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'
import { Toaster } from '@/components/ui/toaster';

const BASE_API_KEY = process.env.COINBASE_TOKEN
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || 'YOUR_PROJECT_ID'

// Add Coinbase Smart Wallet connector
export const cbWalletConnector = coinbaseWallet({
  appName: "DeGen Smart Wallet",
  preference: "smartWalletOnly", // This enables Smart Wallet mode
});

export const config = createConfig({
  chains: [baseSepolia, base],
  // turn off injected provider discovery for Smart Wallet
  multiInjectedProviderDiscovery: false,
  connectors: [cbWalletConnector],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
})

// This component can safely use the custom theme hook since it's inside ThemeProviderCustom
function OnchainKitProviderInner({ children }: { children: React.ReactNode }) {
  const { customTheme } = useCustomTheme()

  return (
    <OnchainKitProvider
      apiKey={BASE_API_KEY}
      projectId={PROJECT_ID}
      chain={baseSepolia}
      config={{
        appearance: {
          name: "DeGen",
          logo: "https://raw.githubusercontent.com/Jossyboydgenius/DeGen/refs/heads/main/frontend/public/degen2.png",
          mode: customTheme === "dark" ? "dark" : "light",
          theme: "base",
        },
        wallet: {
          display: "modal",
          termsUrl: "/terms",
          privacyUrl: "/privacy",
        },
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange      >
        {children}
        <SonnerToaster position="top-center" richColors />
        <Toaster />
      </ThemeProvider>
    </OnchainKitProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <ThemeProviderCustom>
        <OnchainKitProviderInner>
          {children}
        </OnchainKitProviderInner>
      </ThemeProviderCustom>
    </WagmiProvider>
  );
}