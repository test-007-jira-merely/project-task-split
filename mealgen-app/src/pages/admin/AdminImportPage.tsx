import DatasetImport from '@/components/admin/DatasetImport';
import { useAdminCheck } from '@/hooks/useAdminCheck';

export default function AdminImportPage() {
  useAdminCheck();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Import Dataset</h1>
        <p className="text-muted-foreground">
          Bulk import meals from a JSON file
        </p>
      </div>

      <DatasetImport />
    </div>
  );
}
