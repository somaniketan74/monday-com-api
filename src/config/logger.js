/* eslint-disable no-console */
function isDebugEnabled() {
  return true;
}

function log(level, msg, params) {
  if (level === 'DEBUG' && !isDebugEnabled()) {
    return;
  }
  const logMsg = {
    level,
    message: msg,
    params,
  };
  console.log(JSON.stringify(logMsg));
}
function performance(level, params) {
  if (level === 'PERFORMANCE_START') {
    console.time(params);
  } else {
    console.timeEnd(params);
  }
}

const debug = (msg, params) => log('DEBUG', msg, params);
const warn = (msg, params) => log('WARN', msg, params);
const info = (msg, params) => log('INFO', msg, params);
const error = (msg, params) => log('ERROR', msg, params);
const performanceStart = (params) => performance('PERFORMANCE_START', params);
const performanceEnd = (params) => performance('PERFORMANCE_END', params);

const logger = { debug, warn, info, error, performanceStart, performanceEnd };
export default logger;
