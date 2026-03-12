// Placeholder Navbar component - will be implemented in Subtask 1
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';

const Navbar: React.FC = () => {
  const { user, logout } = useAppStore();

  return (
    <nav className="bg-card shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary-600">MealGen</Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <Link to="/ingredients" className="hover:text-primary-600">Ingredients</Link>
          {user && (
            <>
              <Link to="/favorites" className="hover:text-primary-600">Favorites</Link>
              <Link to="/history" className="hover:text-primary-600">History</Link>
              {user.is_admin && <Link to="/admin" className="hover:text-primary-600">Admin</Link>}
              <button onClick={logout} className="hover:text-primary-600">Logout</button>
            </>
          )}
          {!user && (
            <Link to="/auth/login" className="hover:text-primary-600">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
