
import type { MatchRequest } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005';
const API_URL = `${API_BASE_URL}/matching`;

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
