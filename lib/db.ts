import fs from 'fs';
import path from 'path';
import { ServiceRequest, SiteContent } from './types';

const REQUESTS_FILE = path.join(process.cwd(), 'data', 'requests.json');
const CONTENT_FILE = path.join(process.cwd(), 'data', 'content.json');

export function getRequests(): ServiceRequest[] {
  const raw = fs.readFileSync(REQUESTS_FILE, 'utf-8');
  return JSON.parse(raw);
}

export function saveRequest(req: Omit<ServiceRequest, 'id' | 'status' | 'createdAt'>): ServiceRequest {
  const requests = getRequests();
  const newReq: ServiceRequest = {
    ...req,
    id: Date.now().toString(),
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  requests.push(newReq);
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2));
  return newReq;
}

export function updateRequestStatus(id: string, status: ServiceRequest['status']): ServiceRequest | null {
  const requests = getRequests();
  const idx = requests.findIndex(r => r.id === id);
  if (idx === -1) return null;
  requests[idx].status = status;
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2));
  return requests[idx];
}

export function getContent(): SiteContent {
  const raw = fs.readFileSync(CONTENT_FILE, 'utf-8');
  return JSON.parse(raw);
}

export function saveContent(content: SiteContent): void {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
}

export function getStats() {
  const requests = getRequests();
  const days: Record<string, { requests: number; completed: number; visits: number }> = {};

  // Generate 14 days of data
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    days[key] = { requests: 0, completed: 0, visits: Math.floor(Math.random() * 80) + 20 };
  }

  requests.forEach(r => {
    const key = r.createdAt.split('T')[0];
    if (days[key]) {
      days[key].requests += 1;
      if (r.status === 'completed') days[key].completed += 1;
    }
  });

  return Object.entries(days).map(([date, v]) => ({
    date: date.slice(5), // MM-DD
    ...v,
  }));
}
