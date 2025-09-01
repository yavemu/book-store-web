'use client';

import type { Metadata } from 'next';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import AuthProvider from '@/providers/AuthProvider';
import GlobalApiMonitor from '@/components/GlobalApiMonitor';
import { GlobalPaginationProvider } from '@/contexts/GlobalPaginationContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Provider store={store}>
          <GlobalPaginationProvider>
            <AuthProvider>
              <GlobalApiMonitor />
              {children}
            </AuthProvider>
          </GlobalPaginationProvider>
        </Provider>
      </body>
    </html>
  );
}