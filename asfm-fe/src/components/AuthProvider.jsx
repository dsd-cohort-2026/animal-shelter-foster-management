import { supabase } from '@/lib/supabaseClient';
import { useBoundStore } from '@/store';
import { useEffect } from 'react';

const AuthProvider = ({ children }) => {
  const setSession = useBoundStore((state) => state.setSession);
  const setLoading = useBoundStore((state) => state.setLoading);
  const clearSession = useBoundStore((state) => state.clearSession);
  const setUserRole = useBoundStore((state) => state.setUserRole);

  useEffect(() => {
    // check for existing session
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setUserRole();
      } else {
        clearSession();
      }
      setLoading(false);
    };

    initializeAuth();

    // automatically update session state
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      if (session) {
        setSession(session);
        setUserRole();
      } else {
        clearSession();
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
