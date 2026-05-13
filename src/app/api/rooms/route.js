import { NextResponse } from 'next/server';
import { initDb } from '@/lib/initDb';
import Room from '@/models/Room';

export async function GET() {
  await initDb();
  const rooms = await Room.findAll({ order: [['floor', 'DESC'], ['roomIndex', 'ASC']] });
  return NextResponse.json({ rooms });
}
