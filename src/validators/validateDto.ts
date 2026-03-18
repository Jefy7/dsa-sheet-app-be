import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const validateDto = async <T extends object>(cls: new () => T, payload: unknown): Promise<T> => {
  const dto = plainToInstance(cls, payload);
  const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });

  if (errors.length > 0) {
    const details = errors.map((error) => ({
      property: error.property,
      constraints: error.constraints,
    }));
    throw new Error(JSON.stringify(details));
  }

  return dto;
};
