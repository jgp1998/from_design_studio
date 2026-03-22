import type { FormEvent } from 'react';

export interface ShippingData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CheckoutFormProps {
  shippingData: ShippingData;
  setShippingData: (data: ShippingData) => void;
  onSubmit: (e: FormEvent) => void;
}

export function CheckoutForm({ shippingData, setShippingData, onSubmit }: CheckoutFormProps) {
  const handleChange = (field: keyof ShippingData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingData({ ...shippingData, [field]: e.target.value });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Shipping & Billing Information</h2>
      <form onSubmit={onSubmit} className="space-y-4" id="checkout-form">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={shippingData.fullName}
              onChange={handleChange('fullName')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
            <input
              type="email"
              required
              value={shippingData.email}
              onChange={handleChange('email')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
          <input
            type="tel"
            required
            value={shippingData.phone}
            onChange={handleChange('phone')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Address *</label>
          <input
            type="text"
            required
            value={shippingData.address}
            onChange={handleChange('address')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">City *</label>
            <input
              type="text"
              required
              value={shippingData.city}
              onChange={handleChange('city')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">State/Province *</label>
            <input
              type="text"
              required
              value={shippingData.state}
              onChange={handleChange('state')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">ZIP/Postal Code *</label>
            <input
              type="text"
              required
              value={shippingData.zipCode}
              onChange={handleChange('zipCode')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Country *</label>
            <input
              type="text"
              required
              value={shippingData.country}
              onChange={handleChange('country')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-lg transition-all shadow-lg text-lg mt-6 hidden lg:block"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
