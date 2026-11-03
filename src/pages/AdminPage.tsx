import { useState } from 'react';
import { useSite } from '@/context/siteStore';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { isAdminAuthed, logoutAdmin } from '@/lib/adminAuth';

export function AdminPage() {
  const [authed, setAuthed] = useState(isAdminAuthed);
  const { saveError } = useSite();

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <AdminLayout
      saveError={saveError}
      onLogout={async () => {
        await logoutAdmin();
        setAuthed(false);
      }}
    />
  );
}
