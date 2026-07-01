import type { PlayerRepository } from '../../domain/player.repository';
import { type RawPlayer, toPlayer } from './player.mapper';
import headToHead from './data/headtohead.json';

const rawPlayers = headToHead.players as RawPlayer[];

const inMemoryPlayerRepository: PlayerRepository = {
  findAll: async () => rawPlayers.map(toPlayer),
};

export { inMemoryPlayerRepository };
