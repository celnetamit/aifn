'use server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/auth';
import { getRazorpay, RAZORPAY_CURRENCY } from '@/lib/payments/razorpay';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

export async function createSubscriptionOrder(packageId: string) {
  const session = await requireSession();

  const pkg = await prisma.package.findUnique({
    where: { id: packageId }
  });

  if (!pkg) throw new Error('Package not found');

  const amountInPaise = Math.round(pkg.priceInr * 100);

  try {
    const order = await getRazorpay().orders.create({
      amount: amountInPaise,
      currency: RAZORPAY_CURRENCY,
      receipt: `receipt_${session.id}_${Date.now()}`,
      notes: {
        userId: session.id,
        packageId: pkg.id,
        type: 'subscription'
      }
    });

    // 1. Create a pending subscription
    const subscription = await prisma.subscription.create({
        data: {
            userId: session.id,
            packageId: pkg.id,
            expiresAt: new Date(Date.now() + (pkg.durationDays || 30) * 24 * 60 * 60 * 1000),
            paymentStatus: 'pending',
            isActive: false
        }
    });

    // 2. Create a pending payment record
    await prisma.payment.create({
        data: {
            subscriptionId: subscription.id,
            amountInr: pkg.priceInr,
            razorpayOrderId: order.id,
            status: 'pending'
        }
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    };
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    throw new Error('Failed to create payment order');
  }
}

export async function verifyPayment({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const session = await requireSession();

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    return { success: false, error: 'Invalid signature' };
  }

  try {
    const paymentRecord = await prisma.payment.findFirst({
      where: {
        razorpayOrderId: razorpay_order_id,
        subscription: {
          userId: session.id,
        },
      },
      select: {
        id: true,
        subscriptionId: true,
      },
    });

    if (!paymentRecord) {
      return { success: false, error: 'Payment record not found' };
    }

    // 1. Update Payment Record
    const payment = await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
            status: 'paid',
            razorpayPaymentId: razorpay_payment_id,
            invoiceMetadata: { signature: razorpay_signature }
        }
    });

    // 2. Update Subscription
    await prisma.subscription.update({
        where: { id: payment.subscriptionId },
        data: {
            paymentStatus: 'paid',
            isActive: true,
            startsAt: new Date()
        }
    });

    revalidatePath('/en/dashboard');
    revalidatePath('/hi/dashboard');
    return { success: true };

  } catch (error) {
    console.error('Payment Verification Error:', error);
    return { success: false, error: 'Database update failed' };
  }
}
