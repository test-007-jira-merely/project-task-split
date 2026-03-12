import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center text-muted text-sm">
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-accent" fill="currentColor" /> by MealMaster Team
          </p>
          <p className="mt-2">© {new Date().getFullYear()} MealMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
