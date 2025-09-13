import React from 'react';
import type { HsCodePrediction } from '../types';
import { CheckCircle2, Info } from 'lucide-react';
import type { translations, Language } from '../translations';
import { MarkdownDisplay } from './MarkdownDisplay';

interface RefinedResultDisplayProps {
  prediction: HsCodePrediction;
  userAnswer: string;
  t: (typeof translations)['en'];
  language: Language;
}

export const RefinedResultDisplay: React.FC<RefinedResultDisplayProps> = ({ prediction, userAnswer, t, language }) => {
  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-gray-900/50 border-t-2 border-dashed border-gray-300 dark:border-gray-700">
       {language === 'id' && (
        <div className="mb-6 max-w-2xl mx-auto p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg flex items-center justify-center text-sm text-blue-800 dark:text-blue-200">
            <Info size={16} className="mr-2 flex-shrink-0" />
            <span>{t.btkiInfo}</span>
        </div>
      )}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">{t.refinedTitle}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{t.refinedSubtitle.replace('{userAnswer}', userAnswer)}</p>
      </div>
      
      <div className="relative w-full max-w-2xl mx-auto text-left bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border-l-8 border-green-500">
        <div className="absolute -top-3 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-md flex items-center gap-1">
            <CheckCircle2 size={14} />
            {t.confirmedBadge}
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t.hsCodeLabel}</p>
            <p className="text-3xl font-mono font-bold text-green-600 dark:text-green-400">{prediction.hs_code}</p>
          </div>
          <div className="flex-grow md:ml-6">
             <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t.descriptionLabel}</p>
             <p className="text-lg font-semibold text-gray-900 dark:text-white">{prediction.description}</p>
          </div>
           {prediction.tariff && (
              <div className="flex-shrink-0 md:ml-6 md:text-left">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t.tariffLabel}</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-md inline-block">{prediction.tariff}</p>
              </div>
          )}
        </div>
         <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">{t.reasoningLabel}</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{prediction.reasoning}</p>
         </div>
         {language === 'id' && prediction.classification_steps && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">{t.classificationStepsLabel}</p>
              <MarkdownDisplay content={prediction.classification_steps} />
            </div>
         )}
      </div>
    </div>
  );
};