import httpStatus from 'http-status';
import { S3_CF_URL } from '../config/constants';
import logger from '../config/logger';
import { s3Service, settingService } from '../services';
import ApiError from '../utils/ApiError';

export const createSetting = async (req, res, next) => {
  try {
    const { body } = req;
    const { userId, file, fileName } = body;
    const fileKey = `monday/templates/${userId}-${fileName}`;
    logger.info('create setting controller', { file, fileName, userId, fileKey });
    const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    await s3Service.uplaodFile(buffer, `receipts/${fileKey}`, 'application/msword');
    logger.info('file uploaded to S3');
    const url = `${S3_CF_URL}${fileKey}`;
    const setting = await settingService.upsertSetting({ userId }, { url, fileName });
    return res.status(httpStatus.CREATED).json({ setting });
  } catch (err) {
    return next(err);
  }
};

export const updateSetting = async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const setting = await settingService.updateSettingById(id, body);
  if (!setting) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Setting not found'));
  }
  return res.status(httpStatus.OK).json({ message: 'setting updated successfully', _id: setting._id });
};

export const getSettingById = async (req, res, next) => {
  const { userId } = req.query;
  const setting = await settingService.getSettingByField('userId', userId);
  if (!setting) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Setting not found'));
  }
  return res.status(httpStatus.OK).json(setting);
};
