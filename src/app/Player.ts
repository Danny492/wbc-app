export interface Player {
  id: number;
  name: string;
  lastName: string;
  number: string;
  position: string;
  admissionDate: Date;
  imageUrl: string;
  bio: string;
  currentTeam?: {
    id: number;
    name: string;
  };
  currentAge?: number;
  height?: string;
  weight?: string;
  batSide?: {
    code: string;
  };
  pitchHand?: {
    code: string;
  };
  birthCity?: string;
  birthCountry?: string;
  mlbDebutDate?: Date;
}

