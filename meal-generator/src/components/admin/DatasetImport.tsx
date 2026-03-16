import { useState } from 'react';
import { Upload, FileJson, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { datasetService } from '../../services/datasetService';

interface DatasetImportProps {
  onImportComplete: () => void;
}

export const DatasetImport = ({ onImportComplete }: DatasetImportProps) => {
  const [jsonData, setJsonData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ successful: number; failed: number; total: number } | null>(null);
  const [error, setError] = useState('');

  const handleImport = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const importResult = await datasetService.importFromJSON(jsonData);
      setResult(importResult);
      setJsonData('');
      onImportComplete();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleStructure = () => {
    setJsonData(datasetService.getSampleJSONStructure());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <FileJson className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            JSON Format Instructions
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
            Upload a JSON array of meal objects. Each meal must include: name, imageUrl, description, ingredients (array), instructions (array), and category.
          </p>
          <Button variant="ghost" size="sm" onClick={loadSampleStructure}>
            Load Sample Structure
          </Button>
        </div>
      </div>

      <Textarea
        label="Paste JSON Data"
        value={jsonData}
        onChange={(e) => setJsonData(e.target.value)}
        placeholder="Paste your JSON array here..."
        rows={12}
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start space-x-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </motion.div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start space-x-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
        >
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-800 dark:text-green-200">
            <p className="font-semibold mb-1">Import Complete!</p>
            <p>
              Successfully imported {result.successful} of {result.total} meals
              {result.failed > 0 && ` (${result.failed} failed)`}
            </p>
          </div>
        </motion.div>
      )}

      <Button
        onClick={handleImport}
        variant="primary"
        size="lg"
        disabled={!jsonData.trim() || isLoading}
        className="w-full"
      >
        <Upload className="w-5 h-5 mr-2" />
        {isLoading ? 'Importing...' : 'Import Dataset'}
      </Button>
    </div>
  );
};
