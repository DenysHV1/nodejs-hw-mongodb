import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
  upsertContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createValidateScheme } from '../validation/contacts.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.get('/contacts/:id', isValidId, ctrlWrapper(getContactByIdController));

router.post('/contacts', validateBody(createValidateScheme), ctrlWrapper(createContactController));

router.delete('/contacts/:id', isValidId, ctrlWrapper(deleteContactController));

router.patch('/contacts/:id', isValidId, validateBody(createValidateScheme), ctrlWrapper(patchContactController));

router.put('/contacts/:id', isValidId, validateBody(createValidateScheme), ctrlWrapper(upsertContactController));

export default router;
