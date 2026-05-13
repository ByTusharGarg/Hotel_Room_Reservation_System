import { NextResponse } from 'next/server';
import { initDb } from '@/lib/initDb';
import Room from '@/models/Room';

export async function POST() {
  await initDb();
  await Room.update({ status: 'available' }, { where: {} });
  return NextResponse.json({ success: true });
}
