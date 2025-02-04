import createHttpError from 'http-errors';

//services
import { getAllContacts } from '../services/contacts/getAllContacts.js';
import { getContactById } from '../services/contacts/getContactById.js';
import { createContact } from '../services/contacts/createContact.js';
import { deleteContact } from '../services/contacts/deleteContact.js';
import { updateContact } from '../services/contacts/updateContact.js';

//utils for GET
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

//utils for POST
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

//! GET
export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

//! GET by ID
export const getContactByIdController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { id } = req.params;
  const contact = await getContactById(userId, id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};

//! POST
export const createContactController = async (req, res) => {
  const { _id: userId } = req.user;

  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = await createContact(userId, {
    ...req.body,
    photo: photoUrl,
  });

  res.json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

//! PATCH
export const patchContactController = async (req, res, next) => {
  const { id } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    photoUrl = await saveFileToUploadDir(photo);
  }

  const result = await updateContact(id, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

//! DELETE
export const deleteContactController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { id } = req.params;

  const contact = await deleteContact(userId, id);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
