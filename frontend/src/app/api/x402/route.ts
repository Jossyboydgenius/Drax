import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { baseSepolia, base } from 'wagmi/chains';

// Create public client for x402 operations
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export async function POST(request: NextRequest) {
  try {
    const { action, url, method = 'GET', headers, body } = await request.json();

    if (action === 'paid_request') {
      // This would integrate with x402-axios for paid requests
      // For now, we'll return a mock response
      return NextResponse.json({
        success: true,
        message: 'x402 paid request endpoint - requires x402-axios integration',
        url,
        method,
        headers,
        body
      });
    }

    if (action === 'fetch_payment_info') {
      // This would fetch payment information from x402-protected endpoints
      return NextResponse.json({
        success: true,
        message: 'x402 payment info endpoint - requires x402-axios integration',
        url,
        method,
        headers
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'x402 API endpoint',
    availableActions: ['paid_request', 'fetch_payment_info']
  });
} 