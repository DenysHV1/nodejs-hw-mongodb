import createHttpError from 'http-errors';

//services
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';

//utils
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

//* GET
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

//* GET by ID
export const getContactByIdController = async (req, res) => {
  const id = req.params.contactId;
  const userId = req.user._id;
  const contact = await getContactById(id, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with ${id}`,
    data: contact,
  });
};

//* POST
export const createContactController = async (req, res) => {
  const { body } = req;
  const userId = req.user._id;
  const contact = await createContact(body, userId);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

//* DELETE
export const deleteContactController = async (req, res) => {
  const id = req.params.contactId;
  const userId = req.user._id;
  const contact = await deleteContact(id, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};

//* PATCH
export const patchContactController = async (req, res) => {
  const id = req.params.contactId;
  const userId = req.user._id;
  const contact = await updateContact(id, req.body, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: contact,
  });
};
