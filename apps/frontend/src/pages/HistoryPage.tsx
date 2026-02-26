import { History } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export function HistoryPage() {
  const navigate = useNavigate();

  // This will be populated from the state store in the next subtask
  const history: any[] = [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Your History</h1>
        <p className="text-muted text-lg">
          Track your culinary journey and revisit past discoveries
        </p>
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon={History}
          title="No History Yet"
          description="Start exploring dishes and your viewing history will appear here"
          action={{
            label: 'Start Exploring',
            onClick: () => navigate('/'),
          }}
        />
      ) : (
        <div>
          {/* HistoryTimeline will be rendered here after API integration */}
        </div>
      )}
    </div>
  );
}
