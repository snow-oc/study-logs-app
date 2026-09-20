import { render, screen } from "@testing-library/react";
import { Loading } from './Loading';
import { Provider } from "@/components/ui/provider";

test('Loadingコンポーネントが正しく表示されること', () => {
  render(
    <Provider>
      <Loading />
    </Provider>
);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});
