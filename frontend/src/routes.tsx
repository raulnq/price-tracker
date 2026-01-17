import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/pages/Dashboard';
import { StoreList } from '@/features/stores/pages/StoreList';
import { StoreDetail } from '@/features/stores/pages/StoreDetail';
import { StoreForm } from '@/features/stores/pages/StoreForm';
import { ProductList } from '@/features/products/components/ProductList';
import { ProductDetail } from '@/features/products/pages/ProductDetail';
import { ProductForm } from '@/features/products/pages/ProductForm';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: 'stores',
        children: [
          { index: true, element: <StoreList /> },
          { path: 'new', element: <StoreForm /> },
          { path: ':storeId', element: <StoreDetail /> },
          { path: ':storeId/edit', element: <StoreForm /> },
        ],
      },
      {
        path: 'products',
        children: [
          { index: true, element: <ProductList /> },
          { path: 'new', element: <ProductForm /> },
          { path: ':productId', element: <ProductDetail /> },
          { path: ':productId/edit', element: <ProductForm /> },
        ],
      },
    ],
  },
]);
