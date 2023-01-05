import { S3 } from 'aws-sdk';
import { REGION, BUCKET_NAME } from '../config/config';
import logger from '../config/logger';

const s3 = new S3({
  region: REGION,
  signatureVersion: 'v4',
});

export const getSignedUrlForDownload = async (key, expiry = 300) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: expiry,
  };
  const url = await new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });

  return url;
};

export const getSignedUrlForUpload = async (key, contentType, acl = null) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: 300,
    ContentType: contentType,
  };
  logger.info('s3 params; ', params);
  if (acl) {
    params.ACL = acl;
  }

  const url = await new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });

  return url;
};

export const uplaodFile = async (file, fileKey, contentType = null) => {
  try {
    const params = {
      Body: file,
      Bucket: BUCKET_NAME,
      Key: fileKey,
    };
    if (contentType) params.ContentType = contentType;
    await s3.putObject(params).promise();
  } catch (err) {
    logger.error('uploading report file error', err);
  }
};
