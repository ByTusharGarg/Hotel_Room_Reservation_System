import Room from '@/models/Room';
import sequelize from '@/lib/sequelize';

export async function initDb() {
  await sequelize.sync();
  const count = await Room.count();
  if (count === 0) {
    const rooms = [];
    for (let f = 1; f <= 10; f++) {
      const numRooms = f === 10 ? 7 : 10;
      for (let i = 1; i <= numRooms; i++) {
        const id = f === 10 ? 1000 + i : f * 100 + i;
        rooms.push({
          id,
          floor: f,
          roomIndex: i,
          status: 'available'
        });
      }
    }
    await Room.bulkCreate(rooms);
  }
}
