import { useState } from 'react';
import { HeroSection } from '@/components/hero/HeroSection';
import { AnimatedContainer } from '@/components/ui/AnimatedContainer';

export function HomePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateMeal = () => {
    setIsLoading(true);
    // This will be connected to the API in the next subtask
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to dish details or show modal
    }, 1000);
  };

  return (
    <div className="space-y-12">
      <HeroSection onGenerateMeal={handleGenerateMeal} isLoading={isLoading} />

      <AnimatedContainer delay={0.8}>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="card">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate Random Meals</h3>
              <p className="text-muted">
                Click the button to discover new recipes. Each click brings a unique dish to try.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Filter by Ingredients</h3>
              <p className="text-muted">
                Add ingredients you have and find dishes that match. Smart substitutions included.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Your Favorites</h3>
              <p className="text-muted">
                Heart the dishes you love and access them anytime from your favorites page.
              </p>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
}
