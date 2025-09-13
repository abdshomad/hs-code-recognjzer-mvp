import React from 'react';
import { Package, Users, UserCheck } from 'lucide-react';
import type { translations } from '../translations';

interface LoginProps {
  onLogin: () => void;
  onContinueAsGuest: () => void;
  t: (typeof translations)['en'];
}

export const Login: React.FC<LoginProps> = ({ onLogin, onContinueAsGuest, t }) => {
  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 md:p-12">
        <Package className="h-16 w-16 text-indigo-500 mx-auto mb-4" strokeWidth={1.5} />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          {t.welcomeTitle}
        </h1>
        
        <div className="space-y-6">
            <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg text-left">
                <div className="flex items-center">
                    <Users className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3" />
                    <p className="font-semibold text-gray-700 dark:text-gray-300">{t.guestLimitInfo}</p>
                </div>
            </div>
             <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg text-left">
                <div className="flex items-center">
                    <UserCheck className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mr-3" />
                    <p className="font-semibold text-gray-700 dark:text-gray-300">{t.registeredLimitInfo}</p>
                </div>
            </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={onContinueAsGuest}
              className="w-full bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 flex items-center justify-center gap-3"
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