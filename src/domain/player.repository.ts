import type { Player } from './player';

type PlayerRepository = {
  findAll(): Promise<Player[]>;
};

export { type PlayerRepository };
