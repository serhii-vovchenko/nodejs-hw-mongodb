import path from 'node:path';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const JWT = {
  JWT_SECRET: 'JWT_SECRET',
};

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'API_KEY',
  API_SECRET: 'API_SECRET',
  ENABLE_CLOUDINARY: 'ENABLE_CLOUDINARY',
};

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THIRTEEN_DAYS = 30 * 24 * 60 * 60 * 1000;
export const JWT_LIVE_TIME = 5 * 60;

export const APP_DOMAIN = 'APP_DOMAIN';

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
