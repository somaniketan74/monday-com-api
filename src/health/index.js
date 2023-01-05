import { initiateDBConnection, closeDBConnection } from '../config/db';
import logger from '../config/logger';
/* eslint-disable import/prefer-default-export */

export const handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  logger.info('Data', event.request);
  let db = 'Down';
  try {
    await initiateDBConnection();
    db = 'Up';
    await closeDBConnection();
  } catch (err) {
    logger.error('err', err.message);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Serverless is running',
      db,
    }),
  };

  callback(null, response);
};
