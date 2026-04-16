import { NextRequest, NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/db';
import { checkAuth } from '@/lib/checkAuth';

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }
  return NextResponse.json(getContent());
}

export async function PUT(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }
  const body = await req.json();
  saveContent(body);
  return NextResponse.json({ success: true });
}
