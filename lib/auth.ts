import crypto from 'crypto';

// ─── Rate limiting (in-memory, resets on hot-reload — acceptable for brute-force protection) ───
interface AttemptRecord { count: number; lockedUntil: number | null }
const loginAttempts = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS      = 5;
const LOCK_DURATION_MS  = 15 * 60 * 1000; // 15 min

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterMs?: number } {
  const now    = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };
  if (record.lockedUntil && now < record.lockedUntil)
    return { allowed: false, retryAfterMs: record.lockedUntil - now };
  if (record.lockedUntil && now >= record.lockedUntil) {
    loginAttempts.set(ip, { count: 0, lockedUntil: null });
    return { allowed: true };
  }
  return { allowed: true };
}

export function recordFailedAttempt(ip: string) {
  const record   = loginAttempts.get(ip) ?? { count: 0, lockedUntil: null };
  const newCount = record.count + 1;
  loginAttempts.set(ip, {
    count:       newCount,
    lockedUntil: newCount >= MAX_ATTEMPTS ? Date.now() + LOCK_DURATION_MS : null,
  });
}

export function resetAttempts(ip: string) { loginAttempts.delete(ip); }

// ─── Constant-time string comparison ───
export function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a.padEnd(128, '\0'));
  const bufB = Buffer.from(b.padEnd(128, '\0'));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// ─── Stateless HMAC-signed session cookie ───
// Format: "admin:<issuedAt>:<hmac>"
// Survives hot-reloads because verification is purely cryptographic — no server state.

const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 hours

function getSecret(): string {
  return process.env.SESSION_SECRET ?? 'techdoc-fallback-secret';
}

function hmac(payload: string): string {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
}

export function createSessionToken(): string {
  const issuedAt = Date.now().toString();
  const payload  = `admin:${issuedAt}`;
  return `${payload}:${hmac(payload)}`;
}

export function isValidSession(token: string): boolean {
  if (!token) return false;
  const parts = token.split(':');
  if (parts.length !== 3) return false;
  const [user, issuedAt, sig] = parts;

  if (user !== 'admin') return false;

  // Check expiry
  const age = Date.now() - parseInt(issuedAt, 10);
  if (isNaN(age) || age > SESSION_MAX_AGE_MS || age < 0) return false;

  // Constant-time signature check
  const expected = hmac(`${user}:${issuedAt}`);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(sig.padEnd(64, '0')),
      Buffer.from(expected.padEnd(64, '0')),
    );
  } catch {
    return false;
  }
}

// destroySession is a no-op for stateless tokens; logout is handled by deleting the cookie
export function destroySession(_token: string): void {}
