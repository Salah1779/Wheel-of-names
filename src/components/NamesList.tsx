import React, { useState } from 'react';
import { useWheelStore } from '../store/wheelStore';
import { Edit, Trash, Plus, Upload, X, Save, RotateCcw } from 'lucide-react';

const NamesList: React.FC = () => {
  const { 
    names, 
    addName, 
    removeName, 
    updateName, 
    clearNames, 
    importNames 
  } = useWheelStore();
  
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [importMode, setImportMode] = useState(false);
  const [importText, setImportText] = useState('');
  
  const handleAddName = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      addName(newName);
      setNewName('');
    }
  };
  
  const handleStartEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };
  
  const handleSaveEdit = () => {
    if (editingId && editText.trim()) {
      updateName(editingId, editText);
    }
    setEditingId(null);
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
  };
  
  const handleImport = () => {
    importNames(importText);
    setImportMode(false);
    setImportText('');
  };
  
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-h-[500px] flex flex-col transition-colors duration-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Names</h2>
      
      {!importMode && (
        <form onSubmit={handleAddName} className="flex mb-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Add a name..."
            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            <Plus size={18} />
            <span className="ml-1 hidden sm:inline">Add</span>
          </button>
        </form>
      )}
      
      {importMode && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Import Names</h3>
            <button
              onClick={() => setImportMode(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Enter names, one per line..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          />
          <div className="flex justify-end mt-2 space-x-2">
            <button
              onClick={() => setImportMode(false)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Import
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-y-auto flex-grow border border-gray-200 dark:border-gray-700 rounded-lg">
        {names.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {names.map((name) => (
              <li key={name.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {editingId === name.id ? (
                  <div className="flex">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-grow px-3 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-500 text-white px-2 py-1 hover:bg-green-600 transition-colors"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-2 py-1 rounded-r hover:bg-gray-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 dark:text-gray-200">{name.text}</span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleStartEdit(name.id, name.text)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => removeName(name.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 transition-colors"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            No names added yet
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-3">
        <button
          onClick={() => setImportMode(true)}
          className={`text-sm px-3 py-1.5 rounded flex items-center 
            ${importMode ? 'hidden' : 'text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors'}`}
        >
          <Upload size={14} className="mr-1" />
          <span>Import</span>
        </button>
        
        <button
          onClick={clearNames}
          disabled={names.length === 0}
          className={`text-sm px-3 py-1.5 rounded flex items-center 
            ${names.length === 0 
              ? 'text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 cursor-not-allowed' 
              : 'text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900 transition-colors'}`}
        >
          <RotateCcw size={14} className="mr-1" />
          <span>Clear All</span>
        </button>
      </div>
    </div>
  );
};

export default NamesList;