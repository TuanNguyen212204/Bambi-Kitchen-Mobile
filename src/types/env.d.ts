declare module '@env' {
  // API Configuration - Bambi API
  // Swagger: https://bambi.kdz.asia/swagger-ui/index.html#
  export const API_BASE_URL: string;
  export const API_TIMEOUT: string;
  
  // Environment
  export const NODE_ENV: string;
  
  // Feature Flags
  export const ENABLE_ANALYTICS: string;
  export const ENABLE_CRASH_REPORTING: string;
}

