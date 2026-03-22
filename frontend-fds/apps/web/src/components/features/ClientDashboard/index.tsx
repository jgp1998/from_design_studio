'use client';

import { useState, useEffect } from 'react';
import type { WorkOrder } from '../../../types';
import { API } from '../../../api';
import { WorkOrderTable } from './WorkOrderTable';
import { WorkOrderModal } from './WorkOrderModal';

export function ClientDashboard() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
     API.Orders.getOrders()
       .then((data: any[]) => {
          const mapped = data.map(o => ({
             id: o.id,
             clientId: o.client?.id || '',
             fileName: o.files?.[0]?.fileName || 'Unknown File',
             material: o.material || 'Unknown',
             color: o.color || 'Standard',
             tolerance: 'Standard',
             quantity: 1,
             details: 'Custom Order',
             status: o.status === 'open' ? 'waiting_offers' : o.status,
             createdAt: o.createdAt,
             offers: o.bids?.map((b: any) => ({
                id: b.id,
                providerId: b.provider?.id || '',
                providerName: b.provider?.companyName || 'Provider',
                price: Number(b.amount || 0),
                deliveryTime: b.estimatedDays || 0,
                status: b.status,
                createdAt: b.createdAt
             })) || []
          }));
          setWorkOrders(mapped as WorkOrder[]);
       })
       .catch(err => console.error("Error fetching real orders:", err));
  }, []);

  const handleAcceptOffer = async (offerId: string) => {
    if (!selectedWO) return;
    
    setIsProcessing(true);
    
    try {
      // 1. Accept Bid natively in Backend
      await API.Bidding.acceptBid(selectedWO.id, offerId);
      
      // 2. Generate actual Checkout URL Preference
      const checkoutRes = await API.Checkout.generateCheckout(selectedWO.id);

      if (checkoutRes && checkoutRes.payment_url) {
        // Redirect browser to actual external pasarela
        window.location.href = checkoutRes.payment_url;
      } else {
        alert("Success, but no payment URL was returned by the API.");
        // Refetch orders or update local state manually
        setSelectedWO(null);
      }
    } catch (error: any) {
      console.error("Error processing acceptance:", error);
      alert(error.message || "There was an error processing the payment gateway link.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
           <h1 className="text-3xl font-bold text-slate-900 mb-2">My Work Orders</h1>
           <p className="text-slate-600">Track your manufacturing requests and manage offers</p>
        </div>

        <WorkOrderTable 
           workOrders={workOrders} 
           onSelectOrder={(wo) => setSelectedWO(wo)} 
        />
      </div>

      <WorkOrderModal 
         order={selectedWO} 
         onClose={() => !isProcessing && setSelectedWO(null)} 
         onAcceptOffer={handleAcceptOffer}
      />
      {isProcessing && (
         <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
               <p className="text-slate-900 font-semibold">Processing Acceptance...</p>
               <p className="text-sm text-slate-500 mt-1">Generating payment link (MercadoPago / Webpay)</p>
            </div>
         </div>
      )}
    </div>
  );
}
