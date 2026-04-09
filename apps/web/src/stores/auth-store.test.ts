import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { useAuthStore, User } from './auth-store';

// Helper to isolate store state per test
function createFreshStore() {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  return useAuthStore.getState();
}

describe('useAuthStore', () => {
  let initialState: ReturnType<typeof createFreshStore>;

  beforeEach(() => {
    initialState = createFreshStore();
  });

  afterEach(() => {
    createFreshStore();
  });

  describe('initial state', () => {
    it('has null user by default', () => {
      expect(initialState.user).toBeNull();
    });

    it('has null token by default', () => {
      expect(initialState.token).toBeNull();
    });

    it('is not authenticated by default', () => {
      expect(initialState.isAuthenticated).toBe(false);
    });
  });

  describe('login()', () => {
    it('sets user, token, and isAuthenticated to true', () => {
      const user: User = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
      };
      const token = 'jwt-token-abc123';

      useAuthStore.getState().login(user, token);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
      expect(state.token).toBe(token);
      expect(state.isAuthenticated).toBe(true);
    });

    it('overwrites previous user on repeated login', () => {
      const user1: User = { id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B', role: 'user' };
      const user2: User = { id: '2', email: 'c@d.com', firstName: 'C', lastName: 'D', role: 'admin' };

      useAuthStore.getState().login(user1, 'token-1');
      useAuthStore.getState().login(user2, 'token-2');

      const state = useAuthStore.getState();
      expect(state.user?.id).toBe('2');
      expect(state.token).toBe('token-2');
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('logout()', () => {
    it('clears user, token, and sets isAuthenticated to false', () => {
      const user: User = { id: '1', email: 'test@example.com', firstName: 'John', lastName: 'Doe', role: 'user' };
      useAuthStore.getState().login(user, 'token-abc');

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('is idempotent — calling logout twice does not throw', () => {
      useAuthStore.getState().logout();
      expect(() => useAuthStore.getState().logout()).not.toThrow();
    });
  });

  describe('updateUser()', () => {
    it('merges partial data into existing user', () => {
      const user: User = { id: '1', email: 'test@example.com', firstName: 'John', lastName: 'Doe', role: 'user' };
      useAuthStore.getState().login(user, 'token');

      useAuthStore.getState().updateUser({ headline: 'Software Engineer', linkedIn: 'https://linkedin.com/in/johndoe' });

      const state = useAuthStore.getState();
      expect(state.user?.headline).toBe('Software Engineer');
      expect(state.user?.linkedIn).toBe('https://linkedin.com/in/johndoe');
      expect(state.user?.email).toBe('test@example.com'); // unchanged
    });

    it('preserves all existing user fields', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        avatar: 'avatar.png',
        headline: 'SE',
        linkedIn: 'https://linkedin.com/in/john',
      };
      useAuthStore.getState().login(user, 'token');

      useAuthStore.getState().updateUser({ headline: 'Senior SE' });

      const state = useAuthStore.getState();
      expect(state.user?.email).toBe('test@example.com');
      expect(state.user?.firstName).toBe('John');
      expect(state.user?.avatar).toBe('avatar.png');
      expect(state.user?.headline).toBe('Senior SE');
    });

    it('does nothing when user is null', () => {
      // No user logged in
      useAuthStore.getState().updateUser({ email: 'should-not-set.com' });
      expect(useAuthStore.getState().user).toBeNull();
    });
  });
});
