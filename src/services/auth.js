import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { SessionsCollection } from '../db/models/session.js';
import {
  APP_DOMAIN,
  FIFTEEN_MINUTES,
  JWT,
  JWT_LIVE_TIME,
  SMTP,
  TEMPLATES_DIR,
  THIRTEEN_DAYS,
} from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

export const registerUser = async payload => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'User with this email already registered');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const createNewUser = await UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });

  return createNewUser;
};

const createSession = async id => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const newSession = await SessionsCollection.create({
    userId: id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTEEN_DAYS),
  });
  return newSession;
};

export const loginUser = async payload => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const arePasswordEqual = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!arePasswordEqual) {
    throw createHttpError(401, 'User email or password is incorrect');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const userSession = createSession(user._id);

  return userSession;
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession(session.userId);

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return newSession;
};

export const logoutUser = async sessionId => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async email => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(JWT.JWT_SECRET),
    { expiresIn: JWT_LIVE_TIME },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env(APP_DOMAIN)}/auth/reset-pwd?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async payload => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env(JWT.JWT_SECRET));
  } catch (error) {
    if (error instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw error;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await SessionsCollection.deleteOne({ userId: user._id });

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
