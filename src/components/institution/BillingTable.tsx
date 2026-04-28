'use client';

import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { exportInvoicesCsv } from '@/server/actions/institution-modules';

type PaymentItem = {
  id: string;
  amountInr: number;
  status: string;
  createdAt: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  userName: string;
  userEmail: string;
  packageName: string;
};

export function BillingTable({ payments }: { payments: PaymentItem[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const onExport = () => {
    startTransition(async () => {
      const csv = await exportInvoicesCsv();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoices-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ title: 'Invoices exported', description: 'CSV download started.' });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onExport}
          disabled={isPending}
          className="h-9 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white disabled:opacity-60"
        >
          Export Invoices CSV
        </button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Invoice</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Package</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Order/Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-xs font-bold text-slate-700">{`INV-${p.id.slice(0, 8).toUpperCase()}`}</td>
                <td className="px-4 py-3">
                  <p className="text-sm font-bold text-slate-900">{p.userName}</p>
                  <p className="text-xs text-slate-500">{p.userEmail}</p>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700">{p.packageName}</td>
                <td className="px-4 py-3 text-sm font-bold text-slate-900">Rs {p.amountInr.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 rounded font-black uppercase ${p.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : p.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[11px] text-slate-500">
                  <p>{p.razorpayOrderId ?? '-'}</p>
                  <p>{p.razorpayPaymentId ?? '-'}</p>
                </td>
              </tr>
            ))}
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                  No payment records found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

