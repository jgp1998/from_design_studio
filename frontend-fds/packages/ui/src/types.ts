export type ViewType = 'landing' | 'client-new-bidding' | 'client-dashboard' | 'provider-dashboard' | 'provider-ot-detail' | 'store-catalog' | 'store-product-detail' | 'checkout' | 'login';
export type UserRole = 'guest' | 'client' | 'provider';
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type?: string;
  productId?: string;
  configuration?: {
    size?: string;
    color?: string;
    material?: string;
  };
}

export interface WorkOrder {
  id: string;
  clientId: string;
  fileName: string;
  material: string;
  color: string;
  tolerance: string;
  quantity: number;
  details: string;
  status: 'waiting_offers' | 'in_production' | 'dispatched';
  createdAt: string;
  offers: {
    id: string;
    providerId: string;
    providerName: string;
    price: number;
    deliveryTime: number;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
  }[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  imageUrl: string;
  materials: string[];
  sizes: string[];
  colors: string[];
}
