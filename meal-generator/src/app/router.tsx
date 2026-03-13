import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@components/layout/AppLayout';
import { LoadingSkeleton } from '@components/ui/LoadingSkeleton';

const Home = lazy(() => import('@pages/Home').then(m => ({ default: m.Home })));
const Ingredients = lazy(() => import('@pages/Ingredients').then(m => ({ default: m.Ingredients })));
const Favorites = lazy(() => import('@pages/Favorites').then(m => ({ default: m.Favorites })));
const History = lazy(() => import('@pages/History').then(m => ({ default: m.History })));
const Admin = lazy(() => import('@pages/Admin').then(m => ({ default: m.Admin })));
const Login = lazy(() => import('@pages/Login').then(m => ({ default: m.Login })));

function LoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <LoadingSkeleton count={3} className="h-64 mb-6" />
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <Suspense fallback={<LoadingFallback />}>
            <Login />
          </Suspense>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<LoadingFallback />}>
            <Admin />
          </Suspense>
        } />
        <Route element={<AppLayout><Suspense fallback={<LoadingFallback />}><Home /></Suspense></AppLayout>} path="/" />
        <Route element={<AppLayout><Suspense fallback={<LoadingFallback />}><Ingredients /></Suspense></AppLayout>} path="/ingredients" />
        <Route element={<AppLayout><Suspense fallback={<LoadingFallback />}><Favorites /></Suspense></AppLayout>} path="/favorites" />
        <Route element={<AppLayout><Suspense fallback={<LoadingFallback />}><History /></Suspense></AppLayout>} path="/history" />
      </Routes>
    </BrowserRouter>
  );
}
