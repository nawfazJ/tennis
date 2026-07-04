import type { DomainError, ValidationError } from './error.base';

const playerAddingError = (errors: ValidationError[]): DomainError => ({
  type: 'PlayerAddingError',
  errors,
});

export { playerAddingError };
