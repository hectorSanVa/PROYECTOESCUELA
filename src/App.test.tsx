import { render, screen } from '@testing-library/react';
import App from './App';

test('renders loading screen', () => {
  render(<App />);
  const loadingElement = screen.getByText(/Cargando.../i);
  expect(loadingElement).toBeInTheDocument();
});