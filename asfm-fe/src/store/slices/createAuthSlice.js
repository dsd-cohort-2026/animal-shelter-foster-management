import { supabase } from '@/lib/supabaseClient';

export const createAuthSlice = (set, get) => ({
  user: null,
  session: null,
  // for initial session check on mount
  loading: true,
  userRole: null,

  setUserRole: async () => {
    const state = get();
    const { data: User, error } = await supabase
      .from('User')
      .select('role')
      .eq('id', state.user.id)
      .single();

    if (error) {
      console.error(error);
      return error;
    }

    set({ userRole: User?.role || null });

    return null;
  },

  setSession: (session) => {
    set({ session, user: session?.user || null });
  },

  clearSession: () => {
    set({ session: null, user: null });
  },

  setLoading: (isLoading) => set({ loading: isLoading }),

  signIn: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error(error.message);
      set({ loading: false });
      return error;
    }

    // state is handled in AuthProvider though listener
    return null;
  },

  signOut: async () => {
    set({ loading: true });
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error.message);
      set({ loading: false });
      return error;
    }

    // state is handled in AuthProvider though listener
    return null;
  },
});
