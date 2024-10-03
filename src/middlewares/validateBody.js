import createHttpError from 'http-errors';

export const validateBody = validateSchema => async (req, res, next) => {
  const { body } = req;

  try {
    await validateSchema.validateAsync(body, {
      convert: false,
      abortEarly: false,
    });
    next();
  } catch (error) {
    console.log(error.details);
    const err = createHttpError(400, 'Bad request!', {
      error: error.details,
    });
    next(err);
  }
};
