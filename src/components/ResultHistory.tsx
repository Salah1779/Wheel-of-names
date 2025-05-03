import React from 'react';
import { useWheelStore } from '../store/wheelStore';
import { formatTimestamp } from '../utils/wheelUtils';
import { History, Trash2 } from 'lucide-react';

const ResultHistory: React.FC = () => {
  const { history, clearHistory } = useWheelStore();
  
  if (history.length === 0) {
    return null;
  }
  
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-4 transition-colors duration-200">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
          <History size={20} className="mr-2 text-blue-500" />
          Recent Winners
        </h2>
        <button
          onClick={clearHistory}
          className="text-sm px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md flex items-center"
        >
          <Trash2 size={14} className="mr-1" />
          Clear
        </button>
      </div>
      
      <div className="max-h-32 overflow-y-auto">
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {history.map((result) => (
            <li key={result.id} className="py-2 flex justify-between items-center">
              <span className="font-medium text-gray-800 dark:text-gray-200">{result.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{formatTimestamp(result.timestamp)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultHistory;