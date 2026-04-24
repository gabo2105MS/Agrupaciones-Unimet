import { resolveInitialRole } from '../roleResolver';

const prev = process.env.EXPO_PUBLIC_ADMIN_EMAILS;

describe('resolveInitialRole (CU-01: rol inicial)', () => {
  afterEach(() => {
    process.env.EXPO_PUBLIC_ADMIN_EMAILS = prev;
  });

  it('asigna student sin lista', () => {
    process.env.EXPO_PUBLIC_ADMIN_EMAILS = '';
    expect(resolveInitialRole('a@b.com')).toBe('student');
  });

  it('asigna admin si el email está en la lista', () => {
    process.env.EXPO_PUBLIC_ADMIN_EMAILS = 'x@y.com, admin@test.com';
    expect(resolveInitialRole('Admin@test.com')).toBe('admin');
  });
});
