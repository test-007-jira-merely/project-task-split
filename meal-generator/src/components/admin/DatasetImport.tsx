import { useState } from 'react';
import { Upload, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useImportMeals } from '@/hooks/useMeals';

export function DatasetImport() {
  const [isDragging, setIsDragging] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null);
  const { mutate: importMeals, isPending } = useImportMeals();

  const handleFileSelect = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.meals || !Array.isArray(data.meals)) {
        throw new Error('Invalid format: expected { meals: [...] }');
      }

      importMeals(data.meals, {
        onSuccess: (result) => {
          setImportResult(result);
        },
        onError: (error: any) => {
          alert(`Import failed: ${error.message}`);
        },
      });
    } catch (error: any) {
      alert(`Error parsing file: ${error.message}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      handleFileSelect(file);
    } else {
      alert('Please upload a JSON file');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <FileJson className="w-6 h-6 text-primary-600" />
        <div>
          <h3 className="font-semibold text-lg">Import Dataset</h3>
          <p className="text-sm text-foreground/60">Upload a JSON file with meals</p>
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          isDragging
            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
            : 'border-border hover:border-primary-400'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-foreground/40" />
        <p className="text-foreground/60 mb-4">
          Drag and drop your JSON file here, or click to browse
        </p>
        <input
          type="file"
          accept=".json"
          onChange={handleFileInput}
          className="hidden"
          id="file-input"
          disabled={isPending}
        />
        <label htmlFor="file-input">
          <Button variant="primary" disabled={isPending} as="span">
            {isPending ? 'Importing...' : 'Select File'}
          </Button>
        </label>
      </div>

      {importResult && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <p className="font-medium text-green-700 dark:text-green-400">Import Complete!</p>
          <p className="text-sm text-green-600 dark:text-green-500 mt-1">
            {importResult.imported} meals imported, {importResult.skipped} skipped (duplicates)
          </p>
        </div>
      )}

      <div className="p-4 bg-card rounded-xl text-sm text-foreground/60">
        <p className="font-medium mb-2">Expected JSON format:</p>
        <pre className="bg-background p-3 rounded-lg overflow-x-auto">
{`{
  "meals": [
    {
      "name": "Meal Name",
      "description": "Description",
      "imageUrl": "https://...",
      "ingredients": ["ingredient1", "ingredient2"],
      "instructions": ["step1", "step2"],
      "category": "lunch",
      "difficulty": "easy",
      "preparationTime": 30
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
}
