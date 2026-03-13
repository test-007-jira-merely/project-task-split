import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { Home } from '@/pages/home/Home';
import { Ingredients } from '@/pages/ingredients/Ingredients';
import { Favorites } from '@/pages/favorites/Favorites';
import { History } from '@/pages/history/History';

const AdminPage = () => <div>Admin Page (Placeholder for next subtask)</div>;

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<AppLayout><Home /></AppLayout>} />
        <Route path="/ingredients" element={<AppLayout><Ingredients /></AppLayout>} />

        <Route path="/favorites" element={
          <ProtectedRoute>
            <AppLayout><Favorites /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/history" element={
          <ProtectedRoute>
            <AppLayout><History /></AppLayout>
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
