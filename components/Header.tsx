import React from 'react';
import { Package, LogOut, Sun, Moon, Monitor } from 'lucide-react';
import type { Language, translations } from '../translations';
import type { Theme } from '../App';

interface HeaderProps {
    language: Language;
    onLanguageChange: (lang: Language) => void;
    t: (typeof translations)['en'];
    isLoggedIn: boolean;
    onLogout: () => void;
    predictionsToday: number;
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, t, isLoggedIn, onLogout, predictionsToday, theme, onThemeChange }) => {
  const langButtonClasses = (lang: Language) =>
    `px-3 py-1 rounded-md text-sm font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 ${
      language === lang
        ? 'bg-indigo-600 text-white'
        : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-300/80 dark:hover:bg-slate-600/80'
    }`;
  
  const themeButtonClasses = (buttonTheme: Theme) =>
    `p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 ${
      theme === buttonTheme
        ? 'bg-indigo-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300'
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-700'
    }`;
  
  const MAX_PREDICTIONS = isLoggedIn ? 19 : 7;
  const predictionsLeft = MAX_PREDICTIONS - predictionsToday;

  return (
    <header className="sticky top-0 z-50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/30 dark:border-slate-800/50">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <Package className="h-9 w-9 text-indigo-500 dark:text-indigo-400" strokeWidth={2} />
        <h1 className="text-2xl md:text-3xl font-bold ml-3 text-slate-900 dark:text-slate-50">
          {t.headerTitle}
        </h1>
        <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center space-x-4">
               <div className="text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-200/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                   {t.predictionsLeft.replace('{count}', predictionsLeft.toString())}
               </div>
                {isLoggedIn && (
                    <button 
                       onClick={onLogout} 
                       className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                       aria-label={t.logoutButton}
                    >
                        <LogOut size={18} />
                        <span>{t.logoutButton}</span>
                    </button>
                )}
            </div>
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700"></div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-full">
                <button onClick={() => onThemeChange('light')} className={themeButtonClasses('light')} title={t.themeLight} aria-label={t.themeLight}>
                  <Sun size={18} />
                </button>
                <button onClick={() => onThemeChange('dark')} className={themeButtonClasses('dark')} title={t.themeDark} aria-label={t.themeDark}>
                  <Moon size={18} />
                </button>
                <button onClick={() => onThemeChange('system')} className={themeButtonClasses('system')} title={t.themeSystem} aria-label={t.themeSystem}>
                  <Monitor size={18} />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                  <button onClick={() => onLanguageChange('en')} className={langButtonClasses('en')}>
                      EN
                  </button>
                  <button onClick={() => onLanguageChange('id')} className={langButtonClasses('id')}>
                      ID
                  </button>
                  <button onClick={() => onLanguageChange('ja')} className={langButtonClasses('ja')}>
                      JP
                  </button>
              </div>
            </div>
        </div>
      </div>
    </header>
  );
};