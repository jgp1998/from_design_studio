import { Clock, Package, Truck, Check, Eye } from 'lucide-react';
import type { WorkOrder } from '../../../types';

interface WorkOrderTableProps {
  workOrders: WorkOrder[];
  onSelectOrder: (order: WorkOrder) => void;
}

export function WorkOrderTable({ workOrders, onSelectOrder }: WorkOrderTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting_offers':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'in_production':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dispatched':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting_offers':
        return <Clock className="w-4 h-4" />;
      case 'in_production':
        return <Package className="w-4 h-4" />;
      case 'dispatched':
        return <Truck className="w-4 h-4" />;
      case 'completed':
        return <Check className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Order ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">File Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Material</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Offers</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {workOrders.map((wo) => (
              <tr key={wo.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-semibold text-slate-900">{wo.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{wo.fileName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {wo.material}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">{wo.quantity}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{wo.createdAt}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(wo.status)}`}>
                    {getStatusIcon(wo.status)}
                    <span>{formatStatus(wo.status)}</span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  {wo.offers.length > 0 ? (
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
                      {wo.offers.length}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onSelectOrder(wo)}
                    disabled={wo.offers.length === 0}
                    className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-medium text-sm disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
