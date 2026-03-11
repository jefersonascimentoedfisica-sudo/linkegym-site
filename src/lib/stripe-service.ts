/**
 * Stripe Payment Service
 * Handles payment intent creation and webhook processing
 */

export interface StripeCheckoutSession {
  clientSecret: string;
  paymentIntentId: string;
  publishableKey: string;
}

/**
 * Create a Stripe payment intent
 * This should be called from the backend API route
 */
export async function createStripePaymentIntent(
  amount: number,
  bookingId: string,
  studentEmail: string,
  professionalId: string
): Promise<StripeCheckoutSession | null> {
  try {
    const response = await fetch('/api/payments/stripe/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        bookingId,
        studentEmail,
        professionalId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error creating payment intent:', err);
    return null;
  }
}

/**
 * Confirm payment
 */
export async function confirmPayment(paymentIntentId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/payments/stripe/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentIntentId,
      }),
    });

    return response.ok;
  } catch (err) {
    console.error('Error confirming payment:', err);
    return false;
  }
}

/**
 * Get payment status
 */
export async function getPaymentStatus(paymentIntentId: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/payments/stripe/status/${paymentIntentId}`);

    if (!response.ok) {
      throw new Error('Failed to get payment status');
    }

    const data = await response.json();
    return data.status;
  } catch (err) {
    console.error('Error getting payment status:', err);
    return null;
  }
}
