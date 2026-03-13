import { useAuth } from './hooks/useAuth';

function App() {
  useAuth(); // Initialize auth listener

  return (
    <div className="min-h-screen">
      <h1 className="text-4xl font-bold text-center py-20">
        MealGen - Foundation Ready
      </h1>
    </div>
  );
}

export default App;
