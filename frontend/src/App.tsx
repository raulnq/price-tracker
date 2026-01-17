import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { router } from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SignedIn>
        <RouterProvider router={router} />
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center">
          <SignIn />
        </div>
      </SignedOut>
    </QueryClientProvider>
  );
}

export default App;
