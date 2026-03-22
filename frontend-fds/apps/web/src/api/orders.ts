import { fetchClient } from './client';
import { WorkOrder } from '../types';

export interface InitUploadCADPayload {
  file_name: string;
  file_size: number;
}

export interface CreateDraftOrderPayload {
  file_id: string;
  material: string;
  color: string;
  infill: number;
}

export const OrdersAPI = {
  // Get all orders (with filters)
  getOrders: (params?: { status?: string, material?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return fetchClient<WorkOrder[]>(`/orders${query}`);
  },

  // 1. Initialize upload CAD to get presigned URL
  initUploadCAD: (data: InitUploadCADPayload) =>
    fetchClient<{ url: string; file_id: string }>('/orders/files/presigned-url', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 2. Client creates draft order after successful upload
  createDraftOrder: (data: CreateDraftOrderPayload) =>
    fetchClient<WorkOrder>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 3. Provider signs NDA to see file
  signNDA: (orderId: string) =>
    fetchClient<{ signatureId: string }>(`/orders/${orderId}/nda-signatures`, {
      method: 'POST',
    }),

  // 4. Download CAD (Provider)
  getDownloadUrl: (orderId: string) =>
    fetchClient<{ url: string }>(`/orders/${orderId}/files/presigned-download`),
};
