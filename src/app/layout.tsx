'use client';

import type { Metadata } from 'next';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import AuthProvider from '@/providers/AuthProvider';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <Provider store={store}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}