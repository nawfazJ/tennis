import type { PlayerRepository } from '../../domain/player.repository';
import { type RawPlayer, toPlayer } from './player.mapper';
import headToHead from './data/headTohead.json';

const rawPlayers = headToHead.players as RawPlayer[];
const players = rawPlayers.map(toPlayer);

const inMemoryPlayerRepository: PlayerRepository = {
  findAll: async () => players,
  findById: async (id) => players.find((player) => player.id === id),
};

export { inMemoryPlayerRepository };
