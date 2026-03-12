import { Toaster } from 'react-hot-toast';
import Providers from './app/providers';
import AppRouter from './app/router';
import './styles/globals.css';

function App() {
  return (
    <Providers>
      <AppRouter />
      <Toaster position="top-right" />
    </Providers>
  );
}

export default App;
