/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
export const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export const getResource = (req) => {
  let { originalUrl } = req;
  originalUrl = originalUrl.substr(0, originalUrl.indexOf('?') > -1 ? originalUrl.indexOf('?') : originalUrl.length);
  if (req.params && Object.keys(req.params).length) {
    /* eslint-disable*/
    for (const key in req.params) {
      originalUrl = originalUrl.replace(req.params[key], `:${key}`);
    }
    return `${originalUrl}_${req.method}`;
  }
  return `${originalUrl}_${req.method}`;
  // return `${req.baseUrl}_${req.method}`;
};