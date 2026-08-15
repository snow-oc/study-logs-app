import { render, screen } from '@testing-library/react';
import { App } from './App.jsx';

// Supabase の通信をまるごとダミーに差し替える
jest.mock('./supabaseClient.jsx', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

test('タイトルが表示されていること', () => {
  render(<App />);
  expect(screen.getByText('学習記録アプリ')).toBeInTheDocument();
});
