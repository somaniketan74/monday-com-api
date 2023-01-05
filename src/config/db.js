import mongoose from 'mongoose';
import { MONGOURI } from './config';
import logger from './logger';

// mongoose.set('debug', true);
export const initiateDBConnection = async () => {
  try {
    await mongoose.connect(MONGOURI, { serverSelectionTimeoutMS: 4000 });
    logger.info('DB Connected Successfully');
  } catch (err) {
    logger.error('DB Connection error', err);
    throw err;
  }
};

export const closeDBConnection = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      logger.info('DB Disconnected Successfully');
    }
  } catch (err) {
    logger.error('DB Disconnection error', err);
  }
};
// mongoose.set('debug', true);
