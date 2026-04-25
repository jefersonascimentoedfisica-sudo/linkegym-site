import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api-auth';

/**
 * POST /api/payments/stripe/create-intent
 * Create a Stripe payment intent
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser(request);
    if (user instanceof NextResponse) return user;

    const { amount, bookingId, studentEmail, professionalId } = await request.json();

    // Validate input
    if (!amount || !bookingId || !studentEmail || !professionalId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (studentEmail?.toLowerCase() !== user.email?.toLowerCase()) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        error: 'Stripe payment processing is not configured. Refusing to create a mock payment intent.',
        required: ['STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOK_SECRET'],
        bookingId,
        professionalId,
        amount,
      },
      { status: 501 }
    );
  } catch (error: unknown) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
