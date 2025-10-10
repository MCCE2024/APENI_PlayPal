
import { MatchRequest } from './types';

const API_URL = 'http://localhost:3005/matching';

export const getMatchRequests = async (): Promise<MatchRequest[]> => {
  const response = await fetch(`${API_URL}/requests`);
  if (!response.ok) {
    throw new Error('Failed to fetch match requests');
  }
  return response.json();
};

export const createMatchRequest = async (request: Omit<MatchRequest, '_id'>): Promise<MatchRequest> => {
  const response = await fetch(`${API_URL}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error('Failed to create match request');
  }
  return response.json();
};
