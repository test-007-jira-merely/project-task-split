import { useTheme } from './hooks/useTheme';

function App() {
  useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          MealGen - Intelligent Meal Discovery
        </h1>
        <div className="glass-card p-8 max-w-2xl mx-auto">
          <p className="text-lg text-center">
            Foundation and infrastructure ready. Application components will be implemented in subsequent subtasks.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
