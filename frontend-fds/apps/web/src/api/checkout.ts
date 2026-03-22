import { fetchClient } from './client';

export interface CheckoutResponse {
  payment_url: string;
}

export interface TransitionPayload {
  status: string; // FSM Status like 'PRINTING' or 'DISPATCHED'
  tracking_number?: string;
  courier?: string;
}

export const CheckoutAPI = {
  // Generate checkout preference/token
  generateCheckout: (orderId: string) =>
    fetchClient<CheckoutResponse>(`/orders/${orderId}/checkouts`, {
      method: 'POST',
    }),

  // Provide state transition (for providers to update order status)
  updateOrderStatus: (orderId: string, data: TransitionPayload) =>
    fetchClient<{ message: string; new_status: string }>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
