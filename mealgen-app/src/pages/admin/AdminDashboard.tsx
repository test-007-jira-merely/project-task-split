import { Link } from 'react-router-dom';
import { Plus, Upload, UtensilsCrossed } from 'lucide-react';
import Card from '@/components/ui/Card';
import AdminStats from '@/components/admin/AdminStats';
import { useAdminCheck } from '@/hooks/useAdminCheck';

export default function AdminDashboard() {
  useAdminCheck();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin panel</p>
      </div>

      <AdminStats />

      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/meals">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <UtensilsCrossed className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Manage Meals</h3>
              <p className="text-sm text-muted-foreground">
                View, edit, and delete existing meals
              </p>
            </Card>
          </Link>

          <Link to="/admin/meals?action=create">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Plus className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Create New Meal</h3>
              <p className="text-sm text-muted-foreground">
                Add a new meal to the database
              </p>
            </Card>
          </Link>

          <Link to="/admin/import">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Upload className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Import Dataset</h3>
              <p className="text-sm text-muted-foreground">
                Bulk import meals from JSON file
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
