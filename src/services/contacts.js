import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder,
  sortBy,
  filter,
  userId,
}) => {
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();

  if (filter.userId) {
    contactsQuery.where('userId').equals(filter.userId);
  }
  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  // ======================================================================================

  // const contactCount = await ContactsCollection.find()
  //   .merge(contactQuery)
  //   .countDocuments();

  // const contacts = await contactQuery
  //   .skip(skip)
  //   .limit(perPage)
  //   .sort({ [sortBy]: sortOrder })
  //   .exec();

  // Спрощення закоментованого коду

  const [contactCount, contacts] = await Promise.all([
    ContactsCollection.find(userId).merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  // ======================================================================================

  const paginationData = calculatePaginationData(contactCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  // const contact = await ContactsCollection.findById(contactId);

  const contact = await ContactsCollection.findOne({ _id: contactId, userId });

  return contact;
};

export const createContact = async payload => {
  const newContact = await ContactsCollection.create(payload);
  return newContact;
};

export const updateContact = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const contact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
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

export const deleteContact = async (contactId, userId) => {
  const delContact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return delContact;
};
