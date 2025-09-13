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
    <div className="p-6 md:p-10 border-t-2 border-dashed border-slate-300/50 dark:border-slate-700/50">
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-center text-slate-800 dark:text-slate-200">{t.clarificationTitle}</h3>
        <div className="mb-6 max-w-2xl mx-auto p-4 bg-indigo-500/10 dark:bg-indigo-500/20 border-l-4 border-indigo-400 rounded-r-lg">
           <div className="flex items-start">
            <HelpCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-300 mr-3 flex-shrink-0 mt-1" />
            <p className="text-slate-800 dark:text-slate-200 font-semibold">{clarification.question}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {clarification.options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => onSelectOption(option)}
                    className="bg-white/50 dark:bg-slate-700/50 text-indigo-700 dark:text-indigo-300 font-semibold py-2 px-5 rounded-lg border-2 border-indigo-300 dark:border-indigo-500 hover:bg-indigo-100/70 dark:hover:bg-slate-600/70 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {option}
                </button>
            ))}
        </div>
    </div>
  );
};