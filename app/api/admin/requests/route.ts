import { NextRequest, NextResponse } from 'next/server';
import { getRequests, updateRequestStatus } from '@/lib/db';
import { checkAuth } from '@/lib/checkAuth';

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }
  const requests = getRequests();
  return NextResponse.json(requests);
}

export async function PATCH(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }
  const { id, status } = await req.json();
  const updated = updateRequestStatus(id, status);
  if (!updated) return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
  return NextResponse.json(updated);
}
