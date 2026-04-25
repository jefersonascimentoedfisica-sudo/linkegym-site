import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api-auth';

/**
 * GET /api/payments/stripe/status/[paymentIntentId]
 * Get payment status from Stripe
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paymentIntentId: string }> }
) {
  try {
    const user = await requireApiUser(request);
    if (user instanceof NextResponse) return user;

    const { paymentIntentId } = await params;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Stripe payment status is not configured. Refusing to return a fake succeeded status.',
        paymentIntentId,
      },
      { status: 501 }
    );
  } catch (error: unknown) {
    console.error('Error getting payment status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get payment status' },
      { status: 500 }
    );
  }
}
