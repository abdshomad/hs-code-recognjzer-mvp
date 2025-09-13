import React from 'react';
import { Package, LogOut } from 'lucide-react';
import type { Language, translations } from '../translations';

interface HeaderProps {
    language: Language;
    onLanguageChange: (lang: Language) => void;
    t: (typeof translations)['en'];
    isLoggedIn: boolean;
    onLogout: () => void;
    predictionsToday: number;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, t, isLoggedIn, onLogout, predictionsToday }) => {
  const buttonClasses = (lang: Language) =>
    `px-3 py-1 rounded-md text-sm font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 ${
      language === lang
        ? 'bg-indigo-600 text-white'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
    }`;
  
  const MAX_PREDICTIONS = isLoggedIn ? 19 : 7;
  const predictionsLeft = MAX_PREDICTIONS - predictionsToday;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <Package className="h-9 w-9 text-indigo-400" strokeWidth={2} />
        <h1 className="text-2xl md:text-3xl font-bold ml-3 text-gray-800 dark:text-white">
          {t.headerTitle}
        </h1>
        <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center space-x-4">
               <div className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                   {t.predictionsLeft.replace('{count}', predictionsLeft.toString())}
               </div>
                {isLoggedIn && (
                    <button 
                       onClick={onLogout} 
                       className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                       aria-label={t.logoutButton}
                    >
                        <LogOut size={18} />
                        <span>{t.logoutButton}</span>
                    </button>
                )}
            </div>
             <div className="flex items-center space-x-2">
                <button onClick={() => onLanguageChange('en')} className={buttonClasses('en')}>
                    EN
                </button>
                <button onClick={() => onLanguageChange('id')} className={buttonClasses('id')}>
                    ID
                </button>
                <button onClick={() => onLanguageChange('ja')} className={buttonClasses('ja')}>
                    JP
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};