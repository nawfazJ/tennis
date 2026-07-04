import type { Player } from './player';

type PlayerRepository = {
  findAll: () => Promise<Player[]>;
  findById: (id: number) => Promise<Player | undefined>;
  add: (player: Player) => Promise<void>;
};

export { type PlayerRepository };
