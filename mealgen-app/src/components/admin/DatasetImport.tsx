import { useState } from 'react';
import { Upload, FileJson, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { importMealsFromJSON } from '@/services/importService';
import { useToast } from '@/components/ui/Toast';

export default function DatasetImport() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/json') {
        showToast('Please select a JSON file', 'error');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const importResult = await importMealsFromJSON(file);

      setResult({
        imported: importResult.imported,
        errors: importResult.errors,
      });

      if (importResult.success) {
        showToast(`Successfully imported ${importResult.imported} meals`, 'success');
      } else {
        showToast(
          `Imported ${importResult.imported} meals with ${importResult.errors.length} errors`,
          'error'
        );
      }
    } catch (error: any) {
      showToast(`Import failed: ${error.message}`, 'error');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          file
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:border-primary/50'
        }`}
      >
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          {file ? (
            <div className="space-y-3">
              <FileJson className="w-16 h-16 mx-auto text-primary" />
              <p className="text-lg font-medium text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="w-16 h-16 mx-auto text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">
                Drop your JSON file here or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                JSON files only
              </p>
            </div>
          )}
        </label>
      </div>

      {/* Actions */}
      {file && (
        <div className="flex gap-4">
          <Button onClick={handleImport} disabled={importing}>
            {importing ? 'Importing...' : 'Import Meals'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setFile(null);
              setResult(null);
            }}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                Successfully imported {result.imported} meals
              </p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="space-y-2 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-foreground mb-2">
                    {result.errors.length} error(s) occurred:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {result.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                    {result.errors.length > 5 && (
                      <li>• ... and {result.errors.length - 5} more errors</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="p-6 rounded-lg bg-muted">
        <h3 className="font-semibold text-foreground mb-3">JSON Format Example</h3>
        <pre className="text-sm bg-background p-4 rounded overflow-x-auto">
          {JSON.stringify(
            [
              {
                name: 'Meal Name',
                description: 'Meal description',
                imageUrl: 'https://example.com/image.jpg',
                category: 'lunch',
                ingredients: ['ingredient 1', 'ingredient 2'],
                instructions: ['step 1', 'step 2'],
                preparationTime: 30,
                difficulty: 'easy',
              },
            ],
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
