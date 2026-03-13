import { QueryProvider } from './app/providers/QueryProvider';
import { AuthProvider } from './app/providers/AuthProvider';
import { Router } from './app/router/Router';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
