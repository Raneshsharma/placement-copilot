import { describe, it, expect, beforeEach } from '@jest/globals';
import { useAuthStore } from './auth-store';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  describe('login', () => {
    it('sets user, token, and isAuthenticated on login', () => {
      const mockUser = { id: '1', email: 'test@example.com', firstName: 'John', lastName: 'Doe', role: 'user' };
      const mockToken = 'jwt-token-123';

      useAuthStore.getState().login(mockUser, mockToken);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('logout', () => {
    it('clears user, token, and isAuthenticated on logout', () => {
      const mockUser = { id: '1', email: 'test@example.com', firstName: 'John', lastName: 'Doe', role: 'user' };
      useAuthStore.setState({ user: mockUser, token: 'token', isAuthenticated: true });

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('partially updates user data', () => {
      const mockUser = { id: '1', email: 'test@example.com', firstName: 'John', lastName: 'Doe', role: 'user' };
      useAuthStore.setState({ user: mockUser, token: 'token', isAuthenticated: true });

      useAuthStore.getState().updateUser({ firstName: 'Jane', headline: 'Software Engineer' });

      const state = useAuthStore.getState();
      expect(state.user?.firstName).toBe('Jane');
      expect(state.user?.lastName).toBe('Doe');
      expect(state.user?.email).toBe('test@example.com');
      expect(state.user?.headline).toBe('Software Engineer');
    });

    it('does nothing when user is null', () => {
      useAuthStore.setState({ user: null, token: null, isAuthenticated: false });

      useAuthStore.getState().updateUser({ firstName: 'Jane' });

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
    });
  });

  describe('initial state', () => {
    it('has correct initial values after reset', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
