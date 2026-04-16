import { cookies } from 'next/headers';
import { isValidSession } from '@/lib/auth';
import Sidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth')?.value ?? '';
  const authenticated = token ? isValidSession(token) : false;

  return (
    <div className="flex min-h-screen bg-[#0A0E1A]">
      {authenticated && <Sidebar />}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
