'use client';

import ProductDetailView from '@/components/views/ProductDetailView';
import { useParams } from 'next/navigation';

export default function ProductPage() {
  const params = useParams();
  return <ProductDetailView id={params?.id} />;
}

