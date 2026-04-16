import { cookies } from 'next/headers';
import { isValidSession } from './auth';

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth')?.value;
  if (!token) return false;
  return isValidSession(token);
}
