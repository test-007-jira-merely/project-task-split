import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';

const HomePage = () => <div>Home Page (Placeholder)</div>;
const IngredientsPage = () => <div>Ingredients Page (Placeholder)</div>;
const FavoritesPage = () => <div>Favorites Page (Placeholder)</div>;
const HistoryPage = () => <div>History Page (Placeholder)</div>;
const AdminPage = () => <div>Admin Page (Placeholder)</div>;

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
        <Route path="/ingredients" element={<AppLayout><IngredientsPage /></AppLayout>} />

        <Route path="/favorites" element={
          <ProtectedRoute>
            <AppLayout><FavoritesPage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/history" element={
          <ProtectedRoute>
            <AppLayout><HistoryPage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AppLayout><AdminPage /></AppLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};
