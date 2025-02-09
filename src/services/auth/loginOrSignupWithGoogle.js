import createHttpError from 'http-errors';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../../utils/googleOAuth2.js';
import { UsersCollection } from '../../db/models/user.js';
import bcrypt from 'bcrypt';
import { SessionsCollection } from '../../db/models/session.js';
import { createSession } from './refreshUsersSession.js';

export const loginOrSignupWithGoogle = async code => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401, 'Unauthorized');

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UsersCollection.create({
      name: getFullNameFromGoogleTokenPayload(payload),
      email: payload.email,
      password,
    });
  }

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};
