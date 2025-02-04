import { Router } from 'express';

//validation
import {
  createValidateScheme,
  updateValidateSchema,
} from '../validation/contacts.js';

//controllers
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
} from '../controllers/contacts.js';

//middlewares
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();
router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));
router.post('/', upload.single('photo'), validateBody(createValidateScheme), ctrlWrapper(createContactController));
router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));
router.patch('/:id', isValidId, upload.single('photo'), validateBody(updateValidateSchema), ctrlWrapper(patchContactController));

export default router;
