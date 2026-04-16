import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  recordFailedAttempt,
  resetAttempts,
  safeCompare,
  createSessionToken,
  destroySession,
} from '@/lib/auth';
import { cookies } from 'next/headers';

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    const minutes = Math.ceil((rateCheck.retryAfterMs ?? 0) / 60000);
    return NextResponse.json(
      { error: `Слишком много попыток. Попробуйте через ${minutes} мин.` },
      { status: 429 },
    );
  }

  let body: { login?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Неверный формат запроса' }, { status: 400 });
  }

  const login    = (body.login    ?? '').trim();
  const password = (body.password ?? '').trim();

  if (!login || !password) {
    return NextResponse.json({ error: 'Введите логин и пароль' }, { status: 400 });
  }

  const loginOk    = safeCompare(login,    process.env.ADMIN_LOGIN    ?? '');
  const passwordOk = safeCompare(password, process.env.ADMIN_PASSWORD ?? '');

  if (!loginOk || !passwordOk) {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 });
  }

  resetAttempts(ip);
  const token = createSessionToken(); // HMAC-signed, stateless

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_auth', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   60 * 60 * 8,
    path:     '/',
  });
  return response;
}

export async function DELETE() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth')?.value;
  if (token) destroySession(token); // no-op for stateless tokens

  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_auth');
  return response;
}
