import { fetchClient } from './client';

export interface Bid {
  id: string;
  orderId: string;
  providerId: string;
  providerName: string; // Anonymous name
  price: number;
  deliveryTime: number; // in days
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
}

export interface CreateBidPayload {
  price_clp: number;
  estimated_days: number;
}

export const BiddingAPI = {
  // Provider lists open boards (already covered in orders getOrders?status=OPEN)
  
  // Provider places a bid
  createBid: (orderId: string, data: CreateBidPayload) =>
    fetchClient<Bid>(`/orders/${orderId}/bids`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Client lists bids for their order
  getBidsForOrder: (orderId: string) =>
    fetchClient<Bid[]>(`/orders/${orderId}/bids`),

  // Client accepts a bid
  acceptBid: (orderId: string, bidId: string) =>
    fetchClient<{ message: string }>(`/orders/${orderId}/bids/${bidId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'ACCEPTED' }),
    }),
};
