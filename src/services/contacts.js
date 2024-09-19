import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async contactId => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async payload => {
  const newContact = await ContactsCollection.create(payload);
  return newContact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const contact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      runValidators: true,
      ...options,
    },
  );

  if (!contact) return null;

  return contact;
};

export const deleteContact = async contactId => {
  const delContact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });

  return delContact;
};
