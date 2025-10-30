let API_BASE_URL: string;
let API_TIMEOUT: string;
let ENABLE_ANALYTICS: string;
let ENABLE_CRASH_REPORTING: string;

try {
  const env = require('@env');
  API_BASE_URL = env.API_BASE_URL;
  API_TIMEOUT = env.API_TIMEOUT;
  ENABLE_ANALYTICS = env.ENABLE_ANALYTICS;
  ENABLE_CRASH_REPORTING = env.ENABLE_CRASH_REPORTING;
} catch (error) {
  API_BASE_URL = 'https://bambi.kdz.asia';
  API_TIMEOUT = '30000';
  ENABLE_ANALYTICS = 'false';
  ENABLE_CRASH_REPORTING = 'false';
}

export const CONFIG = {
  APP_NAME: 'GroupProject',
  APP_VERSION: '1.0.0',
  
  API_BASE_URL: API_BASE_URL || 'https://bambi.kdz.asia',
  API_TIMEOUT: parseInt(API_TIMEOUT || '30000', 10),
  
  ENABLE_ANALYTICS: ENABLE_ANALYTICS === 'true',
  ENABLE_CRASH_REPORTING: ENABLE_CRASH_REPORTING === 'true',
  
  DEFAULT_PAGE_SIZE: 20,
  
  CACHE_DURATION: 5 * 60 * 1000,
} as const;

