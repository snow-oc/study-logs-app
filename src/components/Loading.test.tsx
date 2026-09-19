import { render, screen } from "@testing-library/react";
import { Loading } from './Loading';

test('Loadingコンポーネントが正しく表示されること', () => {
  render(<Loading />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});
