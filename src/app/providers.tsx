'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthInitializer } from '@/components/AuthInitializer';
import { HydrationProvider } from '@/providers/HydrationProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <HydrationProvider>
        <AuthInitializer />
        {children}
      </HydrationProvider>
    </Provider>
  );
}