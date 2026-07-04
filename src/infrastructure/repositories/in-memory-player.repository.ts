import type { PlayerRepository } from '../../domain/player.repository';
import { initialPlayers } from './data/initial-players';
import { Player } from '../../domain/player';

const players: Player[] = [...initialPlayers];

const inMemoryPlayerRepository: PlayerRepository = {
  findAll: async () => players,
  findById: async (id) => players.find((player) => player.id === id),
  add: async (player: Player) => {
    players.push(player);
  },
};

export { inMemoryPlayerRepository };
