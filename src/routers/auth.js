import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  authUserController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
} from '../controllers/auth.js';
import { createLoginSchema, createUserSchema } from '../validation/user.js';
import { validateBody } from '../middlewares/validateBody.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(createUserSchema),
  ctrlWrapper(authUserController),
);

authRouter.post(
  '/login',
  validateBody(createLoginSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post('/logout', ctrlWrapper(logoutUserController));

authRouter.post('/refresh-session', ctrlWrapper(refreshUserSessionController));

export default authRouter;
