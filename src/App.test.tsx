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
    select: jest.fn(() => ({
      order: jest.fn().mockResolvedValue({ data: [], error: null}),
    }))
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
    select: jest.fn().mockReturnValueOnce({
      order: jest.fn().mockResolvedValueOnce({ data: [], error: null }),
    })
    .mockReturnValueOnce({
      order: jest.fn().mockResolvedValueOnce({ data: [{id: '1', title: 'テスト', time: '5'}], error: null }),
    }),
    insert: jest.fn().mockResolvedValue({ error: null}),
  });

  render(
    <Provider>
      <App />
    </Provider>
  );

  // モーダル起動
  await userEvent.click(screen.getByRole('button', {name: '新規登録' }));

  const detailField = await screen.findByLabelText('学習内容');
  const timeField = await screen.findByLabelText('学習時間 (時間)');
  const button = await screen.findByRole('button', { name: '登録' });

  await userEvent.type(detailField, 'テスト');
  await userEvent.type(timeField, '5');

  await userEvent.click(button);

  expect(await screen.findByText('テスト')).toBeInTheDocument();

});

test('削除ボタンを押すと学習記録が削除される', async () => {

  (supabase.from as jest.Mock).mockReturnValue({
    select: jest.fn().mockReturnValueOnce({
      order: jest.fn().mockResolvedValueOnce({ data: [{id: '1', title: 'テスト', time: '5'}], error: null }),
    })
    .mockReturnValueOnce({
      order: jest.fn().mockResolvedValueOnce({ data: [], error: null}),
    }),
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

test('更新ボタンを押すと学習記録が更新される', async () => {

  // モック
  (supabase.from as jest.Mock).mockReturnValue({
    select: jest.fn().mockReturnValueOnce({
      order: jest.fn().mockResolvedValueOnce({ data: [{id: '1', title: 'テスト', time: '5'}], error: null }),
    })
    .mockReturnValueOnce({
      order: jest.fn().mockResolvedValueOnce({ data: [{id: '1', title: 'テスト2', time: '8'}], error: null }),
    }),
    update: jest.fn(() => ({
      eq: jest.fn().mockResolvedValue({error: null}),
    })),

  });

  render(
    <Provider>
      <App />
    </Provider>
  );

  // 編集ボタンクリック
  const button = await screen.findByRole('button', { name: '編集' });
  await userEvent.click(button);

  // 学習内容編集
  const detailField = await screen.findByLabelText('学習内容');
  await userEvent.clear(detailField);
  await userEvent.type(detailField, 'テスト2');

  // 学習時間編集
  const timeField = await screen.findByLabelText('学習時間 (時間)');
  await userEvent.clear(timeField);
  await userEvent.type(timeField, '8');

  // 更新ボタンクリック
  const updateButton = await screen.findByRole('button', { name: '更新' });
  await userEvent.click(updateButton);

  expect(await screen.findByText('テスト2')).toBeInTheDocument();

});

test('入力をしないで登録を押すとエラーが表示されること', async () => {
  (supabase.from as jest.Mock).mockReturnValue({
    select: jest.fn(() => ({
      order: jest.fn().mockResolvedValue({ data: [], error: null}),
    }))
  });

  render(
    <Provider>
      <App />
    </Provider>
  );

  // モーダル起動
  await userEvent.click(screen.getByRole('button', {name: '新規登録' }));

  const button = await screen.findByRole('button', { name: '登録' });

  await userEvent.click(button);

  expect(await screen.findByText('内容の入力は必須です')).toBeInTheDocument();

})
