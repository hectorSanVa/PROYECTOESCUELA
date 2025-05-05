export const getAuthToken = () => localStorage.getItem('supabase_token');

export const setAuthToken = (token: string) => localStorage.setItem('supabase_token', token);

export const clearAuthToken = () => localStorage.removeItem('supabase_token');