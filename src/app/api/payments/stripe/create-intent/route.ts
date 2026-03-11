import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/payments/stripe/create-intent
 * Create a Stripe payment intent
 */
export async function POST(request: NextRequest) {
  try {
    const { amount, bookingId, studentEmail, professionalId } = await request.json();

    // Validate input
    if (!amount || !bookingId || !studentEmail || !professionalId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real implementation, you would use the Stripe SDK
    // For now, we'll return a mock response
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount,
    //   currency: 'brl',
    //   metadata: {
    //     bookingId,
    //     studentEmail,
    //     professionalId,
    //   },
    // });

    // Mock response for development
    const mockPaymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      clientSecret: `${mockPaymentIntentId}_secret_mock`,
      paymentIntentId: mockPaymentIntentId,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock',
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
