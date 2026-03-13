import { RouterProvider } from 'react-router-dom';
import { Providers } from './app/providers';
import { router } from './app/router';
import { ToastContainer } from './components/ui/Toast';
import { OfflineBanner } from './components/ui/OfflineBanner';

function App() {
  return (
    <Providers>
      <OfflineBanner />
      <RouterProvider router={router} />
      <ToastContainer />
    </Providers>
  );
}

export default App;
