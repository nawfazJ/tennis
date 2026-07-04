type DomainError =
  Readonly<{ type: 'NoPlayersFound' }> | Readonly<{ type: 'PlayerNotFound'; id: number }>;

export { type DomainError };
