import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder,
  sortBy,
  filter,
}) => {
  const skip = (page - 1) * perPage;

  const contactQuery = ContactsCollection.find();

  if (filter.contactType) {
    contactQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
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
    ContactsCollection.find().merge(contactQuery).countDocuments(),
    contactQuery
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
