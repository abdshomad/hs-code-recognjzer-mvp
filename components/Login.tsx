import React from 'react';
import { Package, Users, UserCheck, Sun, Moon, Monitor } from 'lucide-react';
import type { translations, Language } from '../translations';
import type { Theme } from '../App';

interface LoginProps {
  onLogin: () => void;
  onContinueAsGuest: () => void;
  t: (typeof translations)['en'];
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onContinueAsGuest, t, language, onLanguageChange, theme, onThemeChange }) => {
  const langButtonClasses = (lang: Language) =>
    `px-3 py-1 rounded-md text-sm font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 ${
      language === lang
        ? 'bg-indigo-600 text-white'
        : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-300/80 dark:hover:bg-slate-600/80'
    }`;
  
  const themeButtonClasses = (buttonTheme: Theme) =>
    `p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 ${
      theme === buttonTheme
        ? 'bg-indigo-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400'
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-600'
    }`;


  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center bg-white/40 dark:bg-slate-800/40 backdrop-blur-2xl border border-slate-300/50 dark:border-slate-700/50 shadow-2xl rounded-2xl p-8 md:p-12 relative">
        <div className="absolute top-4 right-4 flex items-center space-x-4">
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

        <Package className="h-16 w-16 text-indigo-500 dark:text-indigo-400 mx-auto mb-4" strokeWidth={1.5} />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          {t.welcomeTitle}
        </h1>
        
        <div className="space-y-6">
            <div className="bg-slate-500/10 dark:bg-slate-500/20 p-4 rounded-lg text-left">
                <div className="flex items-center">
                    <Users className="h-6 w-6 text-slate-600 dark:text-slate-300 mr-3" />
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{t.guestLimitInfo}</p>
                </div>
            </div>
             <div className="bg-slate-500/10 dark:bg-slate-500/20 p-4 rounded-lg text-left">
                <div className="flex items-center">
                    <UserCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3" />
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{t.registeredLimitInfo}</p>
                </div>
            </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={onContinueAsGuest}
              className="w-full bg-slate-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-600 flex items-center justify-center gap-3"
            >
              {t.continueAsGuestButton}
            </button>
            <button
              onClick={onLogin}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 flex items-center justify-center gap-3"
            >
              {t.loginButton}
            </button>
        </div>
      </div>
    </div>
  );
};