import React from 'react';
import { render } from '@testing-library/react';
import Page from '../src/app/page';

jest.mock('@lucidea/auth', () => ({
  useAuthContext: () => ({
    user: { username: 'testuser', isAnonymous: false, email: 'test@example.com' },
    loading: false,
    token: 'mock-token',
  }),
  useAuth: () => ({
    logout: jest.fn(),
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
