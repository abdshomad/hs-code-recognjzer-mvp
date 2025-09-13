import React from 'react';
import type { Clarification } from '../types';
import { HelpCircle } from 'lucide-react';
import type { translations } from '../translations';

interface ClarificationPromptProps {
  clarification: Clarification;
  onSelectOption: (option: string) => void;
  t: (typeof translations)['en'];
}

export const ClarificationPrompt: React.FC<ClarificationPromptProps> = ({ clarification, onSelectOption, t }) => {
  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-gray-900/50 border-t-2 border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">{t.clarificationTitle}</h3>
        <div className="mb-6 max-w-2xl mx-auto p-4 bg-indigo-50 dark:bg-gray-800 border-l-4 border-indigo-400 rounded-r-lg">
           <div className="flex items-start">
            <HelpCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0 mt-1" />
            <p className="text-gray-800 dark:text-gray-200 font-semibold">{clarification.question}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {clarification.options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => onSelectOption(option)}
                    className="bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 font-semibold py-2 px-5 rounded-lg border-2 border-indigo-300 dark:border-indigo-500 hover:bg-indigo-100 dark:hover:bg-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {option}
                </button>
            ))}
        </div>
    </div>
  );
};
