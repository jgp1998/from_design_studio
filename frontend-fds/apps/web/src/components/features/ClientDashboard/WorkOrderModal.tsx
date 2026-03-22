import type { WorkOrder } from '../../../types';

interface WorkOrderModalProps {
  order: WorkOrder | null;
  onClose: () => void;
  onAcceptOffer: (offerId: string) => void;
}

export function WorkOrderModal({ order, onClose, onAcceptOffer }: WorkOrderModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 py-12" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Work Order {order.id}</h2>
            <p className="text-slate-600">{order.fileName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-8">
          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-slate-900 mb-4">Order Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Material</p>
                <p className="font-medium text-slate-900">{order.material}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Color</p>
                <p className="font-medium text-slate-900">{order.color}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Tolerance</p>
                <p className="font-medium text-slate-900">{order.tolerance}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Quantity</p>
                <p className="font-medium text-slate-900">{order.quantity} units</p>
              </div>
            </div>
            {order.details && (
              <div className="mt-4">
                <p className="text-sm text-slate-600 mb-1">Additional Details</p>
                <p className="text-slate-900">{order.details}</p>
              </div>
            )}
          </div>

          <h3 className="font-semibold text-slate-900 mb-4">Received Offers ({order.offers.length})</h3>
          <div className="space-y-4">
            {order.offers.map((offer) => (
              <div key={offer.id} className="border border-slate-200 rounded-lg p-6 hover:border-indigo-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">{offer.providerName}</h4>
                    <p className="text-sm text-slate-600">Submitted {offer.createdAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">${offer.price}</p>
                    <p className="text-sm text-slate-600">{offer.deliveryTime} days delivery</p>
                  </div>
                </div>
                <button 
                  onClick={() => onAcceptOffer(offer.id)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Accept Offer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
