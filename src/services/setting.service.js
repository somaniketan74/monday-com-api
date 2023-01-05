import logger from '../config/logger';
import { SettingModel } from '../models';

export const createSetting = async (data) => {
  logger.info('SettingModel model data: ', data);
  const setting = await new SettingModel(data).save();
  return setting;
};

export const upsertSetting = async (query, data = {}) => {
  const setting = await SettingModel.findOneAndUpdate(query, { $set: data }, { upsert: true, new: true });
  return setting;
};

export const updateSettingById = async (_id, data) => {
  const setting = await SettingModel.findOneAndUpdate({ _id }, data, {
    new: true,
  });
  return setting;
};

export const getSettingByField = async (field, value, populate = null, selectedFields = {}) => {
  const options = {};
  if (populate) {
    options.populate = populate;
  }
  const setting = await SettingModel.findOne({ [field]: value }, selectedFields, options).lean();
  return setting;
};
