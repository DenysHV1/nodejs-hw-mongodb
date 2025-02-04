import { Router } from 'express';

//validation
import { resetPasswordSchema } from '../validation/auth.js';
import { requestResetEmailSchema } from '../validation/auth.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';


//controllers
import { registerUserController } from '../controllers/auth.js';
import { loginUserController } from '../controllers/auth.js';
import { logoutUserController } from '../controllers/auth.js';
import { refreshUserSessionController } from '../controllers/auth.js';
import { resetPasswordController } from '../controllers/auth.js';
import { requestResetEmailController } from '../controllers/auth.js';


import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

const authRouter = Router();

authRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
authRouter.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));
authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));
authRouter.post('/send-reset-email',validateBody(requestResetEmailSchema),ctrlWrapper(requestResetEmailController));
authRouter.post('/reset-password',validateBody(resetPasswordSchema),ctrlWrapper(resetPasswordController));

export default authRouter;
