import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { UtensilsCrossed, Users, Heart, History } from 'lucide-react';
import { supabase } from '@/services/supabase';
import Card from '@/components/ui/Card';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  loading?: boolean;
}

function StatsCard({ icon, label, value, loading }: StatsCardProps) {
  if (loading) {
    return <LoadingSkeleton variant="card" />;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default function AdminStats() {
  const { data: mealsCount, isLoading: loadingMeals } = useQuery({
    queryKey: ['admin-stats-meals'],
    queryFn: async () => {
      const { count } = await supabase.from('meals').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: usersCount, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-stats-users'],
    queryFn: async () => {
      const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: favoritesCount, isLoading: loadingFavorites } = useQuery({
    queryKey: ['admin-stats-favorites'],
    queryFn: async () => {
      const { count } = await supabase.from('favorites').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: historyCount, isLoading: loadingHistory } = useQuery({
    queryKey: ['admin-stats-history'],
    queryFn: async () => {
      const { count } = await supabase.from('user_history').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const stats = [
    {
      icon: <UtensilsCrossed className="w-6 h-6" />,
      label: 'Total Meals',
      value: mealsCount || 0,
      loading: loadingMeals,
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Total Users',
      value: usersCount || 0,
      loading: loadingUsers,
    },
    {
      icon: <Heart className="w-6 h-6" />,
      label: 'Total Favorites',
      value: favoritesCount || 0,
      loading: loadingFavorites,
    },
    {
      icon: <History className="w-6 h-6" />,
      label: 'Generated Meals',
      value: historyCount || 0,
      loading: loadingHistory,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
