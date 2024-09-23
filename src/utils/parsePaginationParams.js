const parseNumber = (data, defaultData) => {
  const isNumber = typeof data === 'string';
  if (!isNumber) return defaultData;

  const parsedNumber = parseInt(data);
  if (Number.isNaN(parsedNumber)) return defaultData;

  return parsedNumber;
};

export const parsePaginationParams = query => {
  const { page, perPage } = query;

  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
