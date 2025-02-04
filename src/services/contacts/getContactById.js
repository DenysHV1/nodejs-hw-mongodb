import ContactsCollection from '../../db/models/contacts.js';

export const getContactById = async (userId, contactId) => {
  const contact = await ContactsCollection.findOne({ userId, _id: contactId });

  return contact;
};
