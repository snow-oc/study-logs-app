import '@testing-library/jest-dom';

// JSDOM に存在しない window.matchMedia のダミー（モック）を定義
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // 互換性のため
    removeListener: jest.fn(), // 互換性のため
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
