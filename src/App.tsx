import { useState, useEffect } from 'react';
import Wheel from './components/Wheel';
import NamesList from './components/NamesList';
import Settings from './components/Settings';
import ResultHistory from './components/ResultHistory';
import { useWheelStore } from './store/wheelStore';
import { Save, Download, Info, Maximize2, Minimize2, Moon, Sun, Github, CircleUser } from 'lucide-react';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const { names, config, history } = useWheelStore();
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);
  
  const saveConfiguration = () => {
    const wheelData = {
      names,
      config,
      history
    };
    localStorage.setItem('wheelConfig', JSON.stringify(wheelData));
    
    // Enhanced feedback with toast-like notification
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition-opacity duration-300 flex items-center`;
    toast.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg> Configuration saved successfully!';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  };
  
  const exportNames = () => {
    const namesList = names.map(name => name.text).join('\n');
    const blob = new Blob([namesList], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wheel-names.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Feedback toast for export
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition-opacity duration-300 flex items-center`;
    toast.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 001 1h12a1 1 0 001-1V9.293a1 1 0 00-.293-.707l-5.5-5.5A1 1 0 0010.5 3h-6a1 1 0 00-1 1v12zm10.75-11.5a.75.75 0 000 1.5h2.44l-5.47 5.47a.75.75 0 001.06 1.06l5.47-5.47v2.44a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5z" clip-rule="evenodd" /></svg> Names exported!';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  };
  
  useEffect(() => {
    const savedConfig = localStorage.getItem('wheelConfig');
    if (savedConfig) {
      try {
        const { names, config, history } = JSON.parse(savedConfig);
        if (names && names.length > 0) {
          useWheelStore.setState({ names });
        }
        if (config) {
          useWheelStore.getState().updateConfig(config);
        }
        if (history) {
          useWheelStore.setState({ history });
        }
      } catch (error) {
        console.error('Failed to load saved configuration:', error);
      }
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(mediaQuery.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 dark:text-white transition-background-color duration-300`}>
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 transition-colors duration-300">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CircleUser size={32} className="text-blue-600 dark:text-blue-400 transition-colors duration-300" />
            <div>
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">Wheel of Names</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">by @salah.dev</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <a
              href="https://github.com/yourusername/wheel-of-names"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <Github size={20} />
              <span className="hidden sm:inline">Star on GitHub</span>
            </a>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 transform hover:scale-110"
              title="Toggle theme"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? 
                <Sun size={20} className="transition-transform duration-300 transform rotate-0" /> : 
                <Moon size={20} className="transition-transform duration-300 transform rotate-0" />
              }
            </button>
            
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              title="Information"
            >
              <Info size={20} />
            </button>
            
            <button
              onClick={exportNames}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              title="Export Names"
            >
              <Download size={20} />
            </button>
            
            <button
              onClick={saveConfiguration}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              title="Save Configuration"
            >
              <Save size={20} />
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {showInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md transition-colors duration-300 transform scale-100 animate-scale-in">
              <h2 className="text-xl font-bold mb-4 dark:text-white transition-colors duration-300">About Wheel of Names</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
                This interactive app allows you to create a customizable spinning wheel for random selection.
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 mb-4 transition-colors duration-300">
                <li>Add names to the wheel</li>
                <li>Customize colors and spinning duration</li>
                <li>Track winner history</li>
                <li>Save your configuration for later use</li>
                <li>Export your name list</li>
              </ul>
              <button
                onClick={() => setShowInfo(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
            <Wheel />
            <ResultHistory />
          </div>
          
          <div className="flex flex-col space-y-4">
            <NamesList />
            
            <div className="lg:hidden">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 flex items-center justify-between transition-colors duration-300"
              >
                <span>Settings</span>
                {settingsOpen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              
              {settingsOpen && <Settings />}
            </div>
            
            <div className="hidden lg:block">
              <Settings />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-8 py-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          Wheel of Names &copy; {new Date().getFullYear()} | Created with ❤️
        </div>
      </footer>
      
      <style >{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;