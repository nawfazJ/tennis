import type { DomainError } from './error.base';

const playerNotFound = (id: number): DomainError => ({ type: 'PlayerNotFound', id });

export { playerNotFound };
