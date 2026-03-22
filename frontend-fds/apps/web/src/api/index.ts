import { AuthAPI } from './auth';
import { OrdersAPI } from './orders';
import { BiddingAPI } from './bidding';
import { CheckoutAPI } from './checkout';

export const API = {
  Auth: AuthAPI,
  Orders: OrdersAPI,
  Bidding: BiddingAPI,
  Checkout: CheckoutAPI,
};

// Export individual modules as well
export * from './client';
export * from './auth';
export * from './orders';
export * from './bidding';
export * from './checkout';
