import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

describe('App', () => {
  it('renders landing page by default', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
  });
});
