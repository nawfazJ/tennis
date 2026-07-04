type AddPlayerCommand = Readonly<{
  firstname: string;
  lastname: string;
  shortname: string;
  sex: 'M' | 'F';
  countryCode: string;
  countryPicture: string;
  picture: string;
  rank: number;
  points: number;
  weight: number;
  height: number;
  age: number;
  last: (0 | 1)[];
}>;

export type { AddPlayerCommand };
