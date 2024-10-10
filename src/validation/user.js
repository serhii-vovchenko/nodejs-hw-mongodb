import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().required().email().min(3).max(30),
  password: Joi.string().required(),
});

export const createLoginSchema = Joi.object({
  email: Joi.string().required().email().min(3).max(30),
  password: Joi.string().required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
