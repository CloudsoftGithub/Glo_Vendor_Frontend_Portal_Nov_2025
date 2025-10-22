'use client';

import { AuthProvider } from '@/components/AuthProvider';
import { GlobalSWRProvider } from '@/lib/swrConfig';
import Nav from '@/components/Nav';

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <GlobalSWRProvider>
        <div className="min-h-screen flex bg-gray-50">
          <Nav />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </GlobalSWRProvider>
    </AuthProvider>
  );
}
