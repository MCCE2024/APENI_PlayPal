
export enum Level {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  PRO = 'Professional',
}

export interface MatchRequest {
  sport: string;
  level: Level;
  location: string;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
}
