import { useState } from 'react';
import { Upload, FileJson, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { importSchema } from '@/schemas/mealSchema';
import { mealService } from '@/services/mealService';

export const ImportData = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setResult(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const validated = importSchema.parse(data);

      await mealService.importBulk(validated);

      setResult({
        success: true,
        message: `Successfully imported ${validated.length} meals`,
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Failed to import data',
      });
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  return (
    <Card glass>
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-100 dark:bg-primary-900/30">
          <Upload className="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Import Meals Dataset
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Upload a JSON file containing meal data
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl">
            <FileJson className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              disabled={isImporting}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button
                as="span"
                disabled={isImporting}
                isLoading={isImporting}
              >
                {isImporting ? 'Importing...' : 'Choose JSON File'}
              </Button>
            </label>
          </div>
        </div>

        {result && (
          <div
            className={`
              p-4 rounded-xl flex items-start gap-3
              ${result.success
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }
            `}
          >
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm ${
                result.success
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }`}
            >
              {result.message}
            </p>
          </div>
        )}

        <div className="text-left max-w-md mx-auto p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Expected Format:
          </h3>
          <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
{`[
  {
    "name": "Meal Name",
    "description": "Description...",
    "imageUrl": "https://...",
    "ingredients": ["..."],
    "instructions": ["..."],
    "category": "breakfast",
    "preparationTime": 30,
    "difficulty": "easy"
  }
]`}
          </pre>
        </div>
      </div>
    </Card>
  );
};
