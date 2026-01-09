import type { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '../components/ui/toaster';
import { AuthProvider } from '../contexts/AdminAuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { queryClient } from '../lib/queryClient';
import '../styles.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}