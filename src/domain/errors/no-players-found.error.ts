import type { DomainError } from './error.base';

const noPlayersFound = (): DomainError => ({ type: 'NoPlayersFound' });

export { noPlayersFound };
