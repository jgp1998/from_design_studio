import { CreditCard } from 'lucide-react';

interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  total: number;
  onPlaceOrder: () => void;
}

export function OrderSummary({ subtotal, shippingCost, total, onPlaceOrder }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Order Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-slate-700">
          <span>Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-700">
          <span>Shipping (FDS)</span>
          <span className="font-semibold">${shippingCost.toFixed(2)}</span>
        </div>
        <div className="border-t border-slate-200 pt-3 flex justify-between">
          <span className="text-lg font-bold text-slate-900">Total</span>
          <span className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Button triggers the form submission if possible, or clicks programmatically */}
      <button
        onClick={() => {
           const form = document.getElementById('checkout-form') as HTMLFormElement;
           if (form) {
             if (form.requestSubmit) {
                form.requestSubmit();
             } else {
                form.submit();
             }
           } else {
             onPlaceOrder();
           }
        }}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-lg transition-all shadow-lg text-lg flex items-center justify-center space-x-2"
      >
        <CreditCard className="w-5 h-5" />
        <span>Place Order</span>
      </button>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-sm text-slate-600 leading-relaxed">
          All transactions are secure and encrypted. Your order will be processed within 24 hours.
        </p>
      </div>
    </div>
  );
}
