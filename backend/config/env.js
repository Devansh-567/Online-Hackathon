/**
 * Centralized environment configuration.
 * Validates required secrets in production and supplies safe defaults for local dev.
 */
import dotenv from 'dotenv';

dotenv.config();

const num = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: num(process.env.PORT, 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev-only-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  bcryptRounds: num(process.env.BCRYPT_ROUNDS, 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  aiEngineUrl: process.env.AI_ENGINE_URL || 'http://localhost:5001',
};

if (config.nodeEnv === 'production' && config.jwtSecret === 'dev-only-change-me') {
  // eslint-disable-next-line no-console
  console.warn('[config] WARNING: Using default JWT_SECRET in production is insecure.');
}
