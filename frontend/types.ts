
export enum Level {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  PRO = 'Professional',
}

export enum RequestStatus {
  PENDING = 'Pending',
  MATCHED = 'Matched',
  CANCELLED = 'Cancelled',
}

export interface MatchRequest {
  _id?: string;
  sport: string;
  level: Level;
  location: string;
  dateTimeStart: string;
  dateTimeEnd: string;
  status: RequestStatus;
}
