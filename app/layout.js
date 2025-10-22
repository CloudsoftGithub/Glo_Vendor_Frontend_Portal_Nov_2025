import { Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';

import { GlobalSWRProvider } from '@/lib/swrConfig';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <AuthProvider>
          <GlobalSWRProvider>
            <div className="min-h-screen flex bg-gray-50">
              <main className="flex-1 p-6">
                <AuthProvider>{children}</AuthProvider>
                </main>
            </div>
          </GlobalSWRProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
