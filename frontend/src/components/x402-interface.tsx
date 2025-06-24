"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useX402, X402RequestParams } from '@/hooks/useX402';
import { Loader2, ExternalLink, DollarSign, Info } from 'lucide-react';
import { toast } from 'sonner';

export function X402Interface() {
  const { makePaidRequest, fetchPaymentInfo, isLoading, error, isConnected } = useX402();
  
  const [requestParams, setRequestParams] = useState<X402RequestParams>({
    url: '',
    method: 'GET',
    headers: {},
    body: ''
  });
  
  const [response, setResponse] = useState<any>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  const handleInputChange = (field: keyof X402RequestParams, value: any) => {
    setRequestParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHeadersChange = (value: string) => {
    try {
      const headers = value ? JSON.parse(value) : {};
      setRequestParams(prev => ({ ...prev, headers }));
    } catch (e) {
      // Invalid JSON, keep as string
      setRequestParams(prev => ({ ...prev, headers: { 'Content-Type': value } }));
    }
  };

  const handleBodyChange = (value: string) => {
    try {
      const body = value ? JSON.parse(value) : null;
      setRequestParams(prev => ({ ...prev, body }));
    } catch (e) {
      // Invalid JSON, keep as string
      setRequestParams(prev => ({ ...prev, body: value }));
    }
  };

  const handlePaidRequest = async () => {
    if (!requestParams.url) {
      toast.error('Please enter a URL');
      return;
    }

    const result = await makePaidRequest(requestParams);
    setResponse(result);
    
    if (result.success) {
      toast.success('Paid request completed successfully');
    } else {
      toast.error(result.error || 'Request failed');
    }
  };

  const handleFetchPaymentInfo = async () => {
    if (!requestParams.url) {
      toast.error('Please enter a URL');
      return;
    }

    const result = await fetchPaymentInfo(requestParams);
    setPaymentInfo(result);
    
    if (result.success) {
      toast.success('Payment info fetched successfully');
    } else {
      toast.error(result.error || 'Failed to fetch payment info');
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">Wallet Connection Required</h3>
          <p className="text-muted-foreground text-sm">
            Connect your wallet to use x402 paid request functionality
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            x402 Paid Requests
          </CardTitle>
          <CardDescription>
            Make paid requests to x402-protected APIs and check payment requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">Make Request</TabsTrigger>
              <TabsTrigger value="payment-info">Payment Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="request" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    placeholder="https://api.example.com/endpoint"
                    value={requestParams.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Method</label>
                  <Select
                    value={requestParams.method}
                    onValueChange={(value) => handleInputChange('method', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Headers (JSON)</label>
                <Textarea
                  placeholder='{"Content-Type": "application/json"}'
                  value={JSON.stringify(requestParams.headers, null, 2)}
                  onChange={(e) => handleHeadersChange(e.target.value)}
                  rows={3}
                />
              </div>
              
              {requestParams.method !== 'GET' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Body (JSON)</label>
                  <Textarea
                    placeholder='{"key": "value"}'
                    value={typeof requestParams.body === 'string' ? requestParams.body : JSON.stringify(requestParams.body, null, 2)}
                    onChange={(e) => handleBodyChange(e.target.value)}
                    rows={4}
                  />
                </div>
              )}
              
              <Button 
                onClick={handlePaidRequest} 
                disabled={isLoading || !requestParams.url}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Make Paid Request
                  </>
                )}
              </Button>
              
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              
              {response && (
                <div className="space-y-2">
                  <h4 className="font-medium">Response:</h4>
                  <pre className="p-3 bg-muted rounded-md text-sm overflow-auto">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="payment-info" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">URL to Check</label>
                <Input
                  placeholder="https://api.example.com/endpoint"
                  value={requestParams.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Method</label>
                <Select
                  value={requestParams.method}
                  onValueChange={(value) => handleInputChange('method', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleFetchPaymentInfo} 
                disabled={isLoading || !requestParams.url}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Info className="mr-2 h-4 w-4" />
                    Check Payment Info
                  </>
                )}
              </Button>
              
              {paymentInfo && (
                <div className="space-y-2">
                  <h4 className="font-medium">Payment Information:</h4>
                  <pre className="p-3 bg-muted rounded-md text-sm overflow-auto">
                    {JSON.stringify(paymentInfo, null, 2)}
                  </pre>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 