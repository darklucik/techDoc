import { NextRequest, NextResponse } from 'next/server';
import { saveRequest } from '@/lib/db';

// Узбекские номера: +998 XX XXX XX XX
// Принимает форматы: +998901234567, +998 90 123 45 67, 998-90-123-45-67, 901234567
const UZ_PHONE_REGEX = /^(\+?998[-\s]?)?([0-9]{2})[-\s]?([0-9]{3})[-\s]?([0-9]{2})[-\s]?([0-9]{2})$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, device, phone, description } = body;

    if (!name || !device || !phone || !description) {
      return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 });
    }

    // Trim and strip all formatting to validate just the digits
    const cleanPhone = phone.trim();
    if (!UZ_PHONE_REGEX.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Введите корректный узбекский номер, например: +998 90 123 45 67' },
        { status: 400 }
      );
    }

    const newReq = saveRequest({
      name: name.trim(),
      device: device.trim(),
      phone: cleanPhone,
      description: description.trim(),
    });
    return NextResponse.json({ success: true, data: newReq }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/requests]', err);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
