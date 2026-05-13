import { NextResponse } from 'next/server';
import { initDb } from '@/lib/initDb';
import Room from '@/models/Room';

export async function POST() {
  await initDb();
  const rooms = await Room.findAll();
  // Randomly occupy rooms (approx 60% occupancy for good distribution)
  for (let r of rooms) {
    const status = Math.random() > 0.4 ? 'occupied' : 'available';
    await Room.update({ status }, { where: { id: r.id } });
  }
  return NextResponse.json({ success: true });
}
