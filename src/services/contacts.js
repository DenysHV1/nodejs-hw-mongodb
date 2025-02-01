import ContactsCollection from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { saveFile } from '../utils/saveFile.js';

//* GET
export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsFilter = ContactsCollection.find();

  if (filter.type) {
    contactsFilter.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite !== null) {
    contactsFilter.where('isFavourite').equals(filter.isFavourite);
  }

  contactsFilter.where('userId').equals(userId);

  const [count, data] = await Promise.all([
    ContactsCollection.find().merge(contactsFilter).countDocuments(),
    ContactsCollection.find()
      .merge(contactsFilter)
      .skip(skip)
      .limit(limit)
      .sort({
        [sortBy]: sortOrder,
      })
      .exec(),
  ]);

  const paginationInformation = calculatePaginationData(page, perPage, count);

  return { data, ...paginationInformation };
};

//* GET by ID
export const getContactById = async (id, userId) => {
  return await ContactsCollection.findOne({
    _id: id,
    userId,
  });
};

//* POST
export const createContact = async ({ photo, ...payload }, userId) => {
  let url = null;

  if (photo) {
    url = await saveFile(photo);
  }

  return await ContactsCollection.create({ ...payload, userId, photo: url });
};

//* PATCH
export const updateContact = async (
  contactId,
  { photo, ...payload },
  userId
) => {
  let updatedData = { ...payload };

  if (photo) {
    const url = await saveFile(photo);
    updatedData.photo = url;
  }

  return await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    updatedData,
    { new: true }
  );
};

//* DELETE
export const deleteContact = async (id, userId) => {
  return await ContactsCollection.findOneAndDelete({ _id: id, userId });
};
