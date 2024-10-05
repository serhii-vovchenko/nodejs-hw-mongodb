import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, THIRTEEN_DAYS } from '../constants/index.js';

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
