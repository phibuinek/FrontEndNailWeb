import { Suspense } from 'react';
import ShopView from '@/components/views/ShopView';

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
      <ShopView />
    </Suspense>
  );
}
