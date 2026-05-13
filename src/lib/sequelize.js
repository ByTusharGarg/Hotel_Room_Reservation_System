import { Sequelize } from 'sequelize';
import fs from 'fs';

let sequelize;

if (!global.sequelize) {
  let sslOptions = false;
  
  const caCertStr = process.env.DATABASE_CA_CERT;
  const caCertPath = process.env.DATABASE_CA_CERT_PATH;
  let caConfig = null;

  if (caCertStr) {
    caConfig = caCertStr.replace(/\\n/g, '\n');
  } else if (caCertPath) {
    try {
      caConfig = fs.readFileSync(caCertPath).toString();
    } catch (e) {
      console.warn("Could not read CA certificate from path: ", caCertPath);
    }
  }

  // Use SSL if in production OR if a CA certificate was explicitly provided
  if (process.env.NODE_ENV === 'production' || caConfig || process.env.DATABASE_URL?.includes('sslmode=')) {
    sslOptions = {
      require: true,
      // Default to false for maximum compatibility with hosted databases (Render, Heroku, etc.)
      // Set DB_REJECT_UNAUTHORIZED="true" in .env if you need strict verification.
      rejectUnauthorized: process.env.DB_REJECT_UNAUTHORIZED === 'true'
    };
    
    if (caConfig) {
      sslOptions.ca = caConfig;
    }
  }
  let dbUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/hotel';
  try {
    const urlObj = new URL(dbUrl);
    urlObj.searchParams.delete('sslmode');
    urlObj.searchParams.delete('ssl');
    dbUrl = urlObj.toString();
  } catch (e) {
    // Ignore invalid URL errors here, Sequelize will handle it
  }

  // We use the cleaned dbUrl to connect to PostgreSQL.
  // Stripping sslmode from the URL ensures the pg driver respects our strict dialectOptions.
  sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: sslOptions
    },
    logging: false
  });
  global.sequelize = sequelize;
} else {
  sequelize = global.sequelize;
}

export default sequelize;
