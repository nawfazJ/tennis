import type { Player } from '../../domain/player';

type RawPlayer = {
  id: number;
  firstname: string;
  lastname: string;
  shortname: string;
  sex: 'M' | 'F';
  country: { picture: string; code: string };
  picture: string;
  data: {
    rank: number;
    points: number;
    weight: number;
    height: number;
    age: number;
    last: (0 | 1)[];
  };
};

const toPlayer = (rawPlayer: RawPlayer): Player => ({
  id: rawPlayer.id,
  firstname: rawPlayer.firstname,
  lastname: rawPlayer.lastname,
  shortname: rawPlayer.shortname,
  sex: rawPlayer.sex,
  country: rawPlayer.country,
  picture: rawPlayer.picture,
  stats: rawPlayer.data,
});

export { toPlayer };
export type { RawPlayer };
