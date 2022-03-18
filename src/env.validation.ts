import { plainToClass } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  MAILAZY_KEY: string;

  @IsNotEmpty()
  MAILAZY_SECRET: string;

  @IsNotEmpty()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsNotEmpty()
  DB_USERNAME: string;

  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsNotEmpty()
  DB_NAME: string;

  @IsIn(['production', 'development'])
  NODE_ENV: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
