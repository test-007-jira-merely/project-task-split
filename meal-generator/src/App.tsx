import { AppRouter } from './app/router';
import { AppProviders } from './app/providers';
import { useTheme } from '@hooks/useTheme';

function App() {
  useTheme();

  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
