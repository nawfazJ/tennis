import type { Player } from './player';

type PlayersStats = Readonly<{
  bestWinRatioCountry: string | undefined;
  averageBMI: number;
  medianHeight: number;
}>;

const round = (value: number, decimals = 2): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const bestWinRatioCountry = (players: Player[]): string | undefined => {
  const totalsByCountry = new Map<string, { wins: number; matches: number }>();

  for (const player of players) {
    const code = player.country.code;
    const current = totalsByCountry.get(code) ?? { wins: 0, matches: 0 };
    const wins = player.stats.last.filter((result) => result === 1).length;

    totalsByCountry.set(code, {
      wins: current.wins + wins,
      matches: current.matches + player.stats.last.length,
    });
  }

  const ratios = [...totalsByCountry.entries()]
    .filter(([, totals]) => totals.matches > 0)
    .map(([code, totals]) => ({ code, ratio: totals.wins / totals.matches }));

  if (ratios.length === 0) return undefined;

  const best = ratios.reduce((top, current) => (current.ratio > top.ratio ? current : top));

  return best.code;
};

const bmi = (player: Player): number => {
  const weightKg = player.stats.weight / 1000;
  const heightM = player.stats.height / 100;
  return weightKg / (heightM * heightM);
};

const averageBMI = (players: Player[]): number => {
  const average = players.reduce((sum, player) => sum + bmi(player), 0) / players.length;
  return round(average);
};

const medianHeight = (players: Player[]): number => {
  const heights = [...players].map((player) => player.stats.height).sort((a, b) => a - b);
  const mid = Math.floor(heights.length / 2);

  return heights.length % 2 === 0
    ? ((heights[mid - 1] as number) + (heights[mid] as number)) / 2
    : (heights[mid] as number);
};

export { bestWinRatioCountry, averageBMI, medianHeight };
export type { PlayersStats };
