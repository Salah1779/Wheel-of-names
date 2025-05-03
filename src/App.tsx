import { useState, useEffect } from 'react';
import Wheel from './components/Wheel';
import NamesList from './components/NamesList';
import Settings from './components/Settings';
import ResultHistory from './components/ResultHistory';
import { useWheelStore } from './store/wheelStore';
import { Save, Download, Info, Maximize2, Minimize2, Moon, Sun, Github, Menu, X } from 'lucide-react';
import logo from '../public/assets/wheel_of_names.png';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu when screen size increases
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);
  
  const saveConfiguration = () => {
    const wheelData = {
      names,
      config,
      history
    };
    localStorage.setItem('wheelConfig', JSON.stringify(wheelData));
    
    showToast('Configuration saved!', 'green');
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
    
    showToast('Names exported!', 'blue');
  };

  const showToast = (message: string, color: string) => {
    const toast = document.createElement('div');
    const bgColor = color === 'green' ? 'bg-green-500' : 'bg-blue-500';
    const icon = color === 'green' 
      ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 001 1h12a1 1 0 001-1V9.293a1 1 0 00-.293-.707l-5.5-5.5A1 1 0 0010.5 3h-6a1 1 0 00-1 1v12zm10.75-11.5a.75.75 0 000 1.5h2.44l-5.47 5.47a.75.75 0 001.06 1.06l5.47-5.47v2.44a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5z" clip-rule="evenodd" /></svg>';
    
    toast.className = `fixed bottom-4 right-2 sm:right-4 ${bgColor} text-white px-3 py-1.5 rounded-lg shadow-lg transform transition-opacity duration-300 flex items-center max-w-[80vw] text-sm z-50`;
    toast.innerHTML = `${icon} ${message}`;
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
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(mediaQuery.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const headerActionButtons = [
    {
      icon: <Github className="w-5 h-5" />,
      title: "GitHub",
      onClick: () => window.open("https://github.com/Salah1779/Wheel-of-names", "_blank"),
      isLink: true,
      href: "https://github.com/Salah1779/Wheel-of-names"
    },
    {
      icon: darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />,
      title: darkMode ? "Switch to light mode" : "Switch to dark mode",
      onClick: () => setDarkMode(!darkMode)
    },
    {
      icon: <Info className="w-5 h-5" />,
      title: "Information",
      onClick: () => setShowInfo(!showInfo)
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: "Export Names",
      onClick: exportNames
    },
    {
      icon: <Save className="w-5 h-5" />,
      title: "Save Configuration",
      onClick: saveConfiguration
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      <header className="bg-white dark:bg-gray-800 shadow-sm py-3 transition-colors duration-300 sticky top-0 z-30">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center space-x-2">
              <img 
                src={logo}
                alt="Wheel of Names Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
              />
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">Wheel of Names</h1>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">by @salah.dev</p>
              </div>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden sm:flex items-center space-x-1 md:space-x-2">
              {headerActionButtons.map((button, index) => (
                button.isLink ? (
                  <a
                    key={index}
                    href={button.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                    title={button.title}
                  >
                    {button.icon}
                  </a>
                ) : (
                  <button
                    key={index}
                    onClick={button.onClick}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                    title={button.title}
                    aria-label={button.title}
                  >
                    {button.icon}
                  </button>
                )
              ))}
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="sm:hidden p-1 text-gray-600 dark:text-gray-300 focus:outline-none" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-2 py-2 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
              <div className="grid grid-cols-5 gap-2 justify-items-center">
                {headerActionButtons.map((button, index) => (
                  button.isLink ? (
                    <a
                      key={index}
                      href={button.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                    >
                      {button.icon}
                      <span className="text-xs mt-1">{button.title}</span>
                    </a>
                  ) : (
                    <button
                      key={index}
                      onClick={() => {
                        button.onClick();
                        setMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                      aria-label={button.title}
                    >
                      {button.icon}
                      <span className="text-xs mt-1">{button.title.replace("Switch to ", "")}</span>
                    </button>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {showInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 max-w-[92vw] sm:max-w-md transition-colors duration-300 transform scale-100 animate-scale-in">
              <h2 className="text-lg sm:text-xl font-bold mb-3 dark:text-white transition-colors duration-300">About Wheel of Names</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 transition-colors duration-300">
                This interactive app allows you to create a customizable spinning wheel for random selection.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-3 sm:mb-4 transition-colors duration-300">
                <li>Add names to the wheel</li>
                <li>Customize colors and spinning duration</li>
                <li>Track winner history</li>
                <li>Save your configuration for later use</li>
                <li>Export your name list</li>
              </ul>
              <button
                onClick={() => setShowInfo(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full transition-colors duration-200 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-4 md:p-6 transition-colors duration-300 w-full mx-auto max-w-full">
            <Wheel />
            <ResultHistory />
          </div>
          
          <div className="flex flex-col space-y-4 w-full">
            <NamesList />
            
            <div className="lg:hidden">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 flex items-center justify-between transition-colors duration-300 text-base"
              >
                <span>Settings</span>
                {settingsOpen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              
              {settingsOpen && <Settings />}
            </div>
            
            <div className="hidden lg:block">
              <Settings />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-6 py-2 sm:py-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="container mx-auto px-3 sm:px-4 text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          Wheel of Names © {new Date().getFullYear()} | Created with ❤️
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