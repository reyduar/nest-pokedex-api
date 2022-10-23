/**
 * This config set the rules and it allows to set default environmet variables
 *  if the .env file does not exist or it wasn't defined
 * All of this variables pass its value to env.config.ts
 */
import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.required(),
  PORT: Joi.number().default(3000),
  DEFAULT_LIMIT: Joi.number().default(5),
});
