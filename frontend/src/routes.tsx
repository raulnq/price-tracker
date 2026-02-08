import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/features/stats/pages/DashboardPage';
import { StoreListPage } from '@/features/stores/pages/StoreListPage';
import { StoreDetailPage } from '@/features/stores/pages/StoreDetailPage';
import { StoreEditPage } from '@/features/stores/pages/StoreEditPage';
import { ProductListPage } from '@/features/products/pages/ProductListPage';
import { ProductDetailPage } from '@/features/products/pages/ProductDetailPage';
import { ProductEditPage } from '@/features/products/pages/ProductEditPage';
import { ProductNewPage } from '@/features/products/pages/ProductNewPage';
import { StoreNewPage } from './features/stores/pages/StoreNewPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: 'stores',
        children: [
          { index: true, element: <StoreListPage /> },
          { path: 'new', element: <StoreNewPage /> },
          { path: ':storeId', element: <StoreDetailPage /> },
          { path: ':storeId/edit', element: <StoreEditPage /> },
        ],
      },
      {
        path: 'products',
        children: [
          { index: true, element: <ProductListPage /> },
          { path: 'new', element: <ProductNewPage /> },
          { path: ':productId', element: <ProductDetailPage /> },
          { path: ':productId/edit', element: <ProductEditPage /> },
        ],
      },
    ],
  },
]);
