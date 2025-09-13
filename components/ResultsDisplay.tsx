import React from 'react';
import type { HsCodePrediction } from '../types';
import type { translations } from '../translations';

interface ResultsDisplayProps {
  predictions: HsCodePrediction[];
  t: (typeof translations)['en'];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ predictions, t }) => {
  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-gray-900/50">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">{t.resultsTitle}</h2>
      
      <div className="space-y-6">
        {predictions.map((prediction, index) => {
          const isTopSuggestion = index === 0;
          
          const cardClasses = `relative w-full text-left bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-8 transition-all duration-300 ease-in-out ${
            isTopSuggestion
              ? 'border-indigo-500'
              : 'border-gray-300 dark:border-gray-600'
          }`;

          return (
            <div
              key={index}
              className={cardClasses}
            >
              {isTopSuggestion && (
                  <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-md">
                      {t.topSuggestion}
                  </div>
              )}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t.hsCodeLabel}</p>
                  <p className="text-3xl font-mono font-bold text-indigo-600 dark:text-indigo-400">{prediction.hs_code}</p>
                </div>
                <div className="flex-grow md:ml-6">
                   <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t.descriptionLabel}</p>
                   <p className="text-lg font-semibold text-gray-900 dark:text-white">{prediction.description}</p>
                </div>
              </div>
               <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">{t.reasoningLabel}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{prediction.reasoning}</p>
               </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};
