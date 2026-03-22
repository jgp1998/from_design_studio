'use client';

import { use } from 'react';
import { ProviderOTDetail } from '../../../../../src/components/features/ProviderOTDetail';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <ProviderOTDetail orderId={id} />;
}
