import { DataTypes } from 'sequelize';
import sequelize from '@/lib/sequelize';

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  roomIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'available', // 'available' or 'occupied'
  }
}, {
  timestamps: false
});

export default Room;
