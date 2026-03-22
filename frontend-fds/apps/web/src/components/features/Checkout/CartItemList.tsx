import { Trash2 } from 'lucide-react';
import type { CartItem } from '../../../types';

interface CartItemListProps {
  cartItems: CartItem[];
  onRemoveFromCart: (itemId: string) => void;
}

export function CartItemList({ cartItems, onRemoveFromCart }: CartItemListProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Cart Items</h2>
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{item.name}</h3>
              {item.configuration && (
                <p className="text-sm text-slate-600 mt-1">
                  {item.configuration.size && `Size: ${item.configuration.size} • `}
                  {item.configuration.color && `Color: ${item.configuration.color} • `}
                  {item.configuration.material && `Material: ${item.configuration.material}`}
                </p>
              )}
              <p className="text-sm text-slate-500 mt-1">Quantity: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <p className="text-sm text-slate-500">${item.price} each</p>
            </div>
            <button
              onClick={() => onRemoveFromCart(item.id)}
              className="text-red-600 hover:text-red-800 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
