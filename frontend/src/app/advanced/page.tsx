'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SmartWalletConnection from '@/components/smart-wallet-connection';
import { X402Interface } from '@/components/x402-interface';
import { Wallet, DollarSign, Shield, Zap, Cpu } from 'lucide-react';

export default function AdvancedPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Advanced Features</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore cutting-edge blockchain features including Smart Wallets, paid API access, and confidential computing.
        </p>
      </div>

      <Tabs defaultValue="smart-wallet" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="smart-wallet" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Smart Wallet
          </TabsTrigger>
          <TabsTrigger value="x402" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            x402 Paid APIs
          </TabsTrigger>
          <TabsTrigger value="confidential" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Confidential Computing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="smart-wallet" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Coinbase Smart Wallet
              </CardTitle>
              <CardDescription>
                Connect with a self-custodial Smart Wallet for enhanced security and gasless transactions on Base.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Self-custodial wallet</li>
                    <li>• Gasless transactions</li>
                    <li>• Multi-chain support</li>
                    <li>• Enhanced security</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">Benefits</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• No seed phrases needed</li>
                    <li>• Social recovery</li>
                    <li>• Batch transactions</li>
                    <li>• Paymaster support</li>
                  </ul>
                </div>
              </div>
              <SmartWalletConnection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="x402" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                x402 Paid API Access
              </CardTitle>
              <CardDescription>
                Access premium APIs and data services with micropayments using the x402 protocol.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <X402Interface />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confidential" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                iExec Confidential Computing
              </CardTitle>
              <CardDescription>
                Process sensitive data without exposing it using trusted execution environments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">Security Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• End-to-end encryption</li>
                    <li>• Trusted execution environments</li>
                    <li>• Zero-knowledge proofs</li>
                    <li>• Secure enclaves</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">Use Cases</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Private DeFi operations</li>
                    <li>• Secure data processing</li>
                    <li>• Confidential voting</li>
                    <li>• Privacy-preserving analytics</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Cpu className="h-8 w-8 text-purple-600" />
                  <div>
                    <h4 className="font-medium">Confidential Computing Ready</h4>
                    <p className="text-sm text-muted-foreground">
                      Your DeGen wallet is configured to work with iExec's confidential computing infrastructure.
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
