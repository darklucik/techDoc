import { NextResponse } from 'next/server';
import { getStats, getRequests } from '@/lib/db';
import { checkAuth } from '@/lib/checkAuth';

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

  const stats = getStats();
  const requests = getRequests();

  const summary = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  return NextResponse.json({ stats, summary });
}
