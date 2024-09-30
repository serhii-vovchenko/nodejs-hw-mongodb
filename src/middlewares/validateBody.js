import createHttpError from 'http-errors';

export const validateBody = validateSchema => async (req, res, next) => {
  try {
    await validateSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const err = createHttpError(400, 'Bad request!', {
      error: error.details,
    });
    next(err);
  }
};
