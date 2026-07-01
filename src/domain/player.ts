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

const rankPlayersFromBestToWorst = (players: Player[]): Player[] =>
  [...players].sort((a, b) => a.stats.rank - b.stats.rank);

const hasPlayers = (players: Player[]): boolean => players.length > 0;

export { type Player, rankPlayersFromBestToWorst, hasPlayers };
