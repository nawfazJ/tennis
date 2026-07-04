import { DomainError, ValidationError } from './errors/error.base';
import { Result } from '../shared-kernel/fp/result-pattern/result';
import { playerAddingError } from './errors/player-adding.error';

type Country = Readonly<{
  code: string;
  picture: string;
}>;

type PlayerStats = Readonly<{
  rank: number;
  points: number;
  weight: number;
  height: number;
  age: number;
  last: ReadonlyArray<0 | 1>;
}>;

type Player = Readonly<{
  id: number;
  firstname: string;
  lastname: string;
  shortname: string;
  sex: 'M' | 'F';
  country: Country;
  picture: string;
  stats: PlayerStats;
}>;

type PlayerInput = Omit<Player, 'id'>;

type Rule = Readonly<{
  field: string;
  message: string;
  isValid: (stats: PlayerStats) => boolean;
}>;

const rankPlayersFromBestToWorst = (players: Player[]): Player[] =>
  [...players].sort((a, b) => a.stats.rank - b.stats.rank);

const hasPlayers = (players: Player[]): boolean => players.length > 0;

const businessRules: Rule[] = [
  { field: 'stats.rank', message: 'must be greater than 0', isValid: (s) => s.rank > 0 },
  { field: 'stats.points', message: 'must not be negative', isValid: (s) => s.points >= 0 },
  { field: 'stats.weight', message: 'must be greater than 0', isValid: (s) => s.weight > 0 },
  { field: 'stats.height', message: 'must be greater than 0', isValid: (s) => s.height > 0 },
  { field: 'stats.age', message: 'must be greater than 0', isValid: (s) => s.age > 0 },
];

const validateBusinessRules = (input: PlayerInput): ValidationError[] =>
  businessRules
    .filter((rule) => !rule.isValid(input.stats))
    .map(({ field, message }) => ({ field, message }));

const createPlayer = (input: PlayerInput, id: number): Result<DomainError, Player> => {
  const errors = validateBusinessRules(input);
  if (errors.length > 0) return Result.failure(playerAddingError(errors));

  return Result.success({ id, ...input });
};

export { type Player, type PlayerInput, rankPlayersFromBestToWorst, hasPlayers, createPlayer };
