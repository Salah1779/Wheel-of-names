import React from 'react';
import { useWheelStore } from '../store/wheelStore';
import { COLOR_SCHEMES } from '../store/wheelStore';
import { Volume2, VolumeX, RotateCw, ThermometerSun } from 'lucide-react';

const Settings: React.FC = () => {
  const { config, updateConfig } = useWheelStore();
  
  const colorSchemePreview = (scheme: string) => {
    const colors = COLOR_SCHEMES[scheme as keyof typeof COLOR_SCHEMES] || [];
    
    return (
      <div className="flex space-x-1">
        {colors.slice(0, 5).map((color, index) => (
          <div
            key={index}
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Settings</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="spinDuration" className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
              <RotateCw size={18} className="mr-2 text-blue-500" />
              Spin Duration
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">{config.spinDuration / 1000}s</span>
          </div>
          <input
            id="spinDuration"
            type="range"
            min="2000"
            max="10000"
            step="500"
            value={config.spinDuration}
            onChange={(e) => updateConfig({ spinDuration: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
            <span>Faster</span>
            <span>Slower</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="wheelSize" className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
              <ThermometerSun size={18} className="mr-2 text-blue-500" />
              Wheel Size
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">{config.wheelSize}px</span>
          </div>
          <input
            id="wheelSize"
            type="range"
            min="300"
            max="600"
            step="50"
            value={config.wheelSize}
            onChange={(e) => updateConfig({ wheelSize: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
            <span>Smaller</span>
            <span>Larger</span>
          </div>
        </div>
        
        <div>
          <label className="text-gray-700 dark:text-gray-300 font-medium block mb-2">Color Scheme</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.keys(COLOR_SCHEMES).map((scheme) => (
              <button
                key={scheme}
                onClick={() => updateConfig({ colorScheme: scheme })}
                className={`flex items-center justify-between px-3 py-2 rounded border transition-colors duration-200
                  ${config.colorScheme === scheme 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400' 
                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <span className="capitalize text-sm text-gray-700 dark:text-gray-300">{scheme}</span>
                {colorSchemePreview(scheme)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
            {config.soundEnabled ? (
              <Volume2 size={18} className="mr-2 text-blue-500" />
            ) : (
              <VolumeX size={18} className="mr-2 text-gray-400" />
            )}
            Sound Effects
          </label>
          <button
            onClick={() => updateConfig({ soundEnabled: !config.soundEnabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
              ${config.soundEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${config.soundEnabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;