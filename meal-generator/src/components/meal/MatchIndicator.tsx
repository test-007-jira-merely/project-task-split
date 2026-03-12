interface MatchIndicatorProps {
  percentage: number;
  matchedCount: number;
  totalCount: number;
}

export const MatchIndicator = ({ percentage, matchedCount, totalCount }: MatchIndicatorProps) => {
  const getColor = () => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          {matchedCount} of {totalCount} ingredients
        </span>
        <span className="font-bold text-gray-900 dark:text-white">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
