import dotenv from 'dotenv';

dotenv.config();

export default {
  LOSSLESS_ADMIN: process.env.LOSSLESS_ADMIN,
  LOSSLESS_RECOVERY_ADMIN: process.env.LOSSLESS_RECOVERY_ADMIN,
  TIMELOCK_PERIOD: process.env.TIMELOCK_PERIOD,
  LOSSLESS_IMPLEMENTATION: process.env.LOSSLESS_IMPLEMENTATION,

};