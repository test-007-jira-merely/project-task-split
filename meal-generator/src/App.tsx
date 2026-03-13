import { useEffect } from 'react';
import { AppRouter } from './app/router';
import { supabase } from './services/supabase';
import { useAppStore } from './stores/useAppStore';

function App() {
  const { setUser, setTheme, theme } = useAppStore();

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!theme) {
      setTheme(prefersDark ? 'dark' : 'light');
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setUser(data);
          });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setUser(data);
          });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setTheme, theme]);

  return <AppRouter />;
}

export default App;
