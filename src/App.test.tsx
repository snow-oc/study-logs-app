import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from "@/components/ui/provider";
import { App } from './App';
import { supabase } from './supabaseClient';

// Supabase の通信をまるごとダミーに差し替える
jest.mock('./supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
  }
}));

test('タイトルが表示されていること', () => {

  (supabase.from as jest.Mock).mockReturnValue({
    select: jest.fn().mockResolvedValue({ data: [], error: null}),
  });

  render(
    <Provider>
      <App />
    </Provider>
  );

  expect(screen.getByText('学習記録アプリ')).toBeInTheDocument();
});

test('フォームに学習内容と時間を入力して登録ボタンを押すと新たに記録が追加されること', async () => {

  (supabase.from as jest.Mock).mockReturnValue({
    select: jest.fn().mockResolvedValueOnce({ data: [], error: null })
      .mockResolvedValueOnce({ data: [{id: '1', title: 'テスト', time: '5'}], error: null }),
    insert: jest.fn().mockResolvedValue({ error: null}),
  });

  render(
    <Provider>
      <App />
    </Provider>
  );

  const detailField = screen.getByLabelText('学習内容');
  const timeField = screen.getByLabelText('学習時間 (時間)');
  const button = screen.getByRole('button', { name: '登録' });

  await userEvent.type(detailField, 'テスト');
  await userEvent.type(timeField, '5');

  await userEvent.click(button);

  expect(await screen.findByText('テスト')).toBeInTheDocument();

});

test('削除ボタンを押すと学習記録が削除される', async () => {

  (supabase.from as jest.Mock).mockReturnValue({
    select: jest.fn().mockResolvedValueOnce({ data: [{id: '1', title: 'テスト', time: '5'}], error: null })
      .mockResolvedValueOnce({ data: [], error: null}),
    delete: jest.fn(() => ({
      eq: jest.fn().mockResolvedValue({ error: null}),
    })),
  });

  render(
    <Provider>
      <App />
    </Provider>
  );

  const button = await screen.findByRole('button', { name: '削除' });

  await userEvent.click(button);

  expect(screen.queryByText('テスト')).not.toBeInTheDocument();

});

test('入力をしないで登録を押すとエラーが表示されること', async () => {
  (supabase.from as jest.Mock).mockReturnValue({
    select: jest.fn().mockResolvedValue({ data: [], error: null}),
  });

  render(
    <Provider>
      <App />
    </Provider>
  );

  const button = screen.getByRole('button', { name: '登録' });

  await userEvent.click(button);

  expect(await screen.findByText('内容の入力は必須です')).toBeInTheDocument();

})
