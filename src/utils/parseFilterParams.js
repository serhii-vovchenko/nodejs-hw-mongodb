const parseContactType = contactType => {
  const isString = typeof contactType === 'string';

  if (!isString) return;

  const contactTypeToLowerCase = contactType.toLowerCase();

  const isContactType = data =>
    ['work', 'home', 'personal'].includes(contactTypeToLowerCase);

  if (isContactType(contactType)) return contactTypeToLowerCase;
};

const parseBoolean = favourite => {
  if (favourite.toLowerCase() === 'true') return true;

  if (favourite.toLowerCase() === 'false') return false;
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
