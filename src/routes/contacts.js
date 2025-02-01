import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
  // upsertContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createValidateScheme } from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();
router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

router.post('/', validateBody(createValidateScheme), ctrlWrapper(createContactController));

router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

router.patch('/:id', isValidId, validateBody(createValidateScheme), ctrlWrapper(patchContactController));

export default router;
