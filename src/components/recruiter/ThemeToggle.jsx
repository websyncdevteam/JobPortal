// frontend/src/components/recruiter/ThemeToggle.jsx
// THEME TOGGLE - PURE CSS THEME SWITCHING
// No backend changes, only CSS/JSX enhancements

import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette,
  Check
} from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  const [showPicker, setShowPicker] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Available themes
  const themes = [
    { id: 'light', name: 'Light', icon: Sun, color: 'bg-yellow-500' },
    { id: 'dark', name: 'Dark', icon: Moon, color: 'bg-gray-800' },
    { id: 'system', name: 'System', icon: Monitor, color: 'bg-indigo-500' },
    { id: 'blue', name: 'Blue', icon: Palette, color: 'bg-blue-500' },
    { id: 'green', name: 'Green', icon: Palette, color: 'bg-green-500' },
    { id: 'purple', name: 'Purple', icon: Palette, color: 'bg-purple-500' },
  ];

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('recruiter-theme');
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('system');
    }
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    if (!mounted) return;

    let themeToApply = theme;
    
    if (theme === 'system') {
      themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Remove all theme classes
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-blue', 'theme-green', 'theme-purple');
    
    // Add current theme class
    if (themeToApply !== 'light') {
      document.documentElement.classList.add(`theme-${themeToApply}`);
    }

    // Set data-theme attribute for CSS variables
    document.documentElement.setAttribute('data-theme', themeToApply);
    
    // Save to localStorage
    localStorage.setItem('recruiter-theme', theme);
  }, [theme, mounted]);

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setShowPicker(false);
  };

  // Get current theme icon
  const CurrentThemeIcon = themes.find(t => t.id === theme)?.icon || Sun;

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-gray-100 text-gray-400">
        <Sun size={20} />
      </button>
    );
  }

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="group flex items-center space-x-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        aria-label="Change theme"
      >
        <CurrentThemeIcon 
          size={20} 
          className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" 
        />
      </button>

      {/* Theme Picker Dropdown */}
      {showPicker && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
          />
          
          {/* Picker */}
          <div className="absolute right-0 mt-2 z-50 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Theme Settings</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Choose your preferred interface theme
              </p>
            </div>

            <div className="p-3">
              {/* Main Themes */}
              <div className="space-y-1">
                {themes.slice(0, 3).map(themeOption => {
                  const Icon = themeOption.icon;
                  return (
                    <button
                      key={themeOption.id}
                      onClick={() => handleThemeChange(themeOption.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        theme === themeOption.id
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-lg ${themeOption.color} flex items-center justify-center mr-3`}>
                          <Icon size={16} className="text-white" />
                        </div>
                        <span className="font-medium">{themeOption.name}</span>
                      </div>
                      {theme === themeOption.id && (
                        <Check size={18} className="text-indigo-600 dark:text-indigo-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Color Themes */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Color Variations
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {themes.slice(3).map(themeOption => (
                    <button
                      key={themeOption.id}
                      onClick={() => handleThemeChange(themeOption.id)}
                      className="flex flex-col items-center"
                    >
                      <div className={`w-12 h-12 rounded-lg ${themeOption.color} mb-2 flex items-center justify-center`}>
                        {theme === themeOption.id && (
                          <Check size={20} className="text-white" />
                        )}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {themeOption.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Preview
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500"></div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"></div>
                    <div className="h-8 bg-indigo-500 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={() => {
                  localStorage.removeItem('recruiter-theme');
                  setTheme('light');
                  setShowPicker(false);
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Reset to default
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Add CSS for theme switching (should be added to your main CSS file)
const ThemeStyles = () => (
  <style jsx global>{`
    :root {
      --color-primary: #4f46e5;
      --color-primary-light: #6366f1;
      --color-primary-dark: #4338ca;
      --color-background: #ffffff;
      --color-surface: #f9fafb;
      --color-text: #1f2937;
      --color-text-secondary: #6b7280;
      --color-border: #e5e7eb;
    }

    [data-theme="dark"] {
      --color-primary: #6366f1;
      --color-primary-light: #818cf8;
      --color-primary-dark: #4f46e5;
      --color-background: #111827;
      --color-surface: #1f2937;
      --color-text: #f9fafb;
      --color-text-secondary: #d1d5db;
      --color-border: #374151;
    }

    [data-theme="blue"] {
      --color-primary: #3b82f6;
      --color-primary-light: #60a5fa;
      --color-primary-dark: #2563eb;
      --color-background: #f0f9ff;
      --color-surface: #e0f2fe;
      --color-text: #0c4a6e;
      --color-text-secondary: #0369a1;
      --color-border: #bae6fd;
    }

    [data-theme="green"] {
      --color-primary: #10b981;
      --color-primary-light: #34d399;
      --color-primary-dark: #059669;
      --color-background: #f0fdf4;
      --color-surface: #dcfce7;
      --color-text: #064e3b;
      --color-text-secondary: #047857;
      --color-border: #bbf7d0;
    }

    [data-theme="purple"] {
      --color-primary: #8b5cf6;
      --color-primary-light: #a78bfa;
      --color-primary-dark: #7c3aed;
      --color-background: #faf5ff;
      --color-surface: #f3e8ff;
      --color-text: #581c87;
      --color-text-secondary: #7c3aed;
      --color-border: #e9d5ff;
    }

    .theme-dark {
      color-scheme: dark;
    }

    .theme-blue,
    .theme-green,
    .theme-purple {
      color-scheme: light;
    }

    /* Apply theme variables to Tailwind-like classes */
    .theme-bg-primary {
      background-color: var(--color-primary);
    }

    .theme-text-primary {
      color: var(--color-primary);
    }

    .theme-border {
      border-color: var(--color-border);
    }
  `}</style>
);

export default ThemeToggle;
export { ThemeStyles };