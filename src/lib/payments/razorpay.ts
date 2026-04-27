import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const RAZORPAY_CURRENCY = 'INR';

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status: string;
}
