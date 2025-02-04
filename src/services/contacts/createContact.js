import ContactsCollection from '../../db/models/contacts.js';

export const createContact = async (userId, payload) => {
  const contact = await ContactsCollection.create({ ...payload, userId });
  return contact;
};
