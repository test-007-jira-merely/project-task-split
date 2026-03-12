import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPanel from './pages/admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Meal Planner App</h1>
        <p className="text-xl text-gray-600 mb-8">Welcome to your meal planning companion</p>
        <a
          href="/admin"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Admin Panel
        </a>
      </div>
    </div>
  );
}

export default App;
