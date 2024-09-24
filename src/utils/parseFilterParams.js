const parseContactType = contactType => {
  const isString = typeof contactType === 'string';

  if (!isString) return;

  const contactTypeToLowerCase = contactType.toLowerCase();

  const isContactType = data =>
    ['work', 'home', 'personal'].includes(contactTypeToLowerCase);

  if (isContactType(contactType)) return contactTypeToLowerCase;
};

const parseBoolean = favourite => {
  const favouriteToLowerCase = favourite.toLowerCase();

  if (favouriteToLowerCase === 'true') return true;

  if (favouriteToLowerCase === 'false') return false;
};

export const parseFilterParams = query => {
  const { contactType, isFavourite } = query;

  const type = parseContactType(contactType);

  const favourite = parseBoolean(isFavourite);

  return {
    contactType: type,
    isFavourite: favourite,
  };
};
