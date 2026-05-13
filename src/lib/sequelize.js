import { Sequelize } from 'sequelize';
import path from 'path';

let sequelize;

if (!global.sequelize) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(process.cwd(), 'hotel.sqlite'),
    logging: false
  });
  global.sequelize = sequelize;
} else {
  sequelize = global.sequelize;
}

export default sequelize;
