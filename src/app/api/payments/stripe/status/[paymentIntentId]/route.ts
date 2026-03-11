import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/payments/stripe/status/[paymentIntentId]
 * Get payment status from Stripe
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paymentIntentId: string }> }
) {
  try {
    const { paymentIntentId } = await params;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would use the Stripe SDK
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Mock response for development
    return NextResponse.json({
      status: 'succeeded',
      paymentIntentId,
    });
  } catch (error: any) {
    console.error('Error getting payment status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get payment status' },
      { status: 500 }
    );
  }
}
