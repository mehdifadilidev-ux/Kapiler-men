'use client';

import { AuthGuard } from '@/components/providers/AuthGuard';
import { AdminHeader } from '@/components/layout/AdminHeader';

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminHeader />
      {children}
    </AuthGuard>
  );
}
