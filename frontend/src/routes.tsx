import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/pages/Dashboard';
import { StoreListPage } from '@/features/stores/pages/StoreListPage';
import { StoreDetailPage } from '@/features/stores/pages/StoreDetailPage';
import { StoreEditPage } from '@/features/stores/pages/StoreEditPage';
import { ProductListPage } from '@/features/products/pages/ProductListPage';
import { ProductDetail } from '@/features/products/pages/ProductDetail';
import { ProductForm } from '@/features/products/pages/ProductForm';
import { StoreNewPage } from './features/stores/pages/StoreNewPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
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
          { path: 'new', element: <ProductForm /> },
          { path: ':productId', element: <ProductDetail /> },
          { path: ':productId/edit', element: <ProductForm /> },
        ],
      },
    ],
  },
]);
