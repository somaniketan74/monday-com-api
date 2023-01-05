import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { S3_CF_URL } from '../config/constants';
import logger from '../config/logger';
import { documentService, wordEditorService } from '../services';

export const getDocuments = async (req, res, next) => {
  logger.info('getDocuments controller');
  try {
    const { query } = req;
    const populate = [];
    const selectedFields = {};
    const companies = await documentService.getDocuments(query, populate, selectedFields);
    return res.status(httpStatus.OK).json(companies);
  } catch (err) {
    return next(err);
  }
};

export const createDocument = async (req, res, next) => {
  try {
    const { body } = req;
    const { userId, data } = body;
    const fileName = uuidv4();
    const fileKey = `monday/documents/${userId}-${fileName}.docx`;
    const url = `${S3_CF_URL}${fileKey}`;
    await wordEditorService.generateDocument(userId, `receipts/${fileKey}`, data);
    const document = await documentService.createDocument({ userId, url, fileName });
    return res.status(httpStatus.CREATED).json({ document });
  } catch (err) {
    return next(err);
  }
};
