import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Utensils, Heart, History, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { mealService } from '@/services/mealService';
import { useAuthStore } from '@/stores/useAuthStore';

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);

  const { data: meals = [] } = useQuery({
    queryKey: ['meals'],
    queryFn: mealService.getAllMeals,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => user ? mealService.getFavorites(user.id) : [],
    enabled: !!user,
  });

  const { data: history = [] } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => user ? mealService.getUserHistory(user.id) : [],
    enabled: !!user,
  });

  const stats = [
    { label: 'Total Meals', value: meals.length, icon: Utensils, color: 'text-blue-600' },
    { label: 'Favorites', value: favorites.length, icon: Heart, color: 'text-red-600' },
    { label: 'History', value: history.length, icon: History, color: 'text-green-600' },
    { label: 'Users', value: 1, icon: Users, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your meal management system</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-secondary ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
