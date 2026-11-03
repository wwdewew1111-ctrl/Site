import { adminLogin, adminLogout } from '@/lib/siteApi';

const SESSION_KEY = 'kab6anbl-admin-token';

export function getAdminToken(): string | null {
  return window.sessionStorage.getItem(SESSION_KEY);
}

export function isAdminAuthed(): boolean {
  return getAdminToken() !== null;
}

export async function loginAdmin(password: string): Promise<void> {
  const token = await adminLogin(password);
  window.sessionStorage.setItem(SESSION_KEY, token);
}

export async function logoutAdmin(): Promise<void> {
  const token = getAdminToken();
  window.sessionStorage.removeItem(SESSION_KEY);
  if (token) {
    await adminLogout(token).catch(() => undefined);
  }
}
