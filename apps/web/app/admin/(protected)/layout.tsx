'use client';

import { AuthGuard } from '@/components/providers/AuthGuard';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { ToastProvider } from '@/components/ui/Toast';

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ToastProvider>
        <AdminHeader />
        {children}
      </ToastProvider>
    </AuthGuard>
  );
}
