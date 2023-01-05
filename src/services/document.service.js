import logger from '../config/logger';
import { DocumentModel } from '../models';

export const getDocuments = async (input, populate = null, selectedFields = {}, pagination = true) => {
  const { page, limit, userId } = input;
  const query = { userId };

  const options = {
    page: page || 1,
    limit: limit || 10,
    select: selectedFields,
    pagination,
    sort: { createdAt: -1 },
  };
  if (populate) {
    options.populate = populate;
  }
  const documents = await DocumentModel.paginate(query, options);
  return documents;
};

export const createDocument = async (data) => {
  logger.info('Setting model data: ', data);
  const document = await new DocumentModel(data).save();
  return document;
};
