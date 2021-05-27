import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { cpf } from 'cpf-cnpj-validator';

export function IsCpf(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCpf',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return cpf.isValid(value);
        },
      },
    });
  };
}