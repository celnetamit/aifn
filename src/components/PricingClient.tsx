'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createSubscriptionOrder, verifyPayment } from '@/server/actions/payments';
import { useRouter } from '@/i18n/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface PricingClientProps {
  pkgId: string;
  locale: string;
}

export function PricingClient({ pkgId, locale }: PricingClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // 1. Create order on server
      const order = await createSubscriptionOrder(pkgId);

      // 2. Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        toast({ title: 'Payment Error', description: 'Razorpay SDK failed to load', variant: 'destructive' });
        setIsLoading(false);
        return;
      }

      // 3. Open Razorpay modal
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'AI for Nurses India',
        description: 'Monthly Subscription',
        order_id: order.orderId,
        handler: async function (response: any) {
          // 4. Verify payment on server
          const result = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (result.success) {
            toast({ title: 'Success!', description: 'Subscription activated successfully.' });
            router.push('/dashboard');
          } else {
            toast({ title: 'Payment Failed', description: result.error, variant: 'destructive' });
          }
        },
        prefill: {
          name: '', // Will be filled by user in modal or we can pass session name
          email: '',
          contact: ''
        },
        theme: {
          color: '#0f172a' // Slate 900
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={isLoading}
      className="w-full h-14 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black text-lg shadow-xl shadow-slate-200"
    >
      {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Get Started Now'}
    </Button>
  );
}
