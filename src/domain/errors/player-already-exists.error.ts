import type { DomainError } from './error.base';

const playerAlreadyExists = (firstname: string, lastname: string): DomainError => ({
  type: 'PlayerAlreadyExists',
  firstname,
  lastname,
});

export { playerAlreadyExists };
