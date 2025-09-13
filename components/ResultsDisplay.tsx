import React, { useState } from 'react';
import type { HsCodePrediction } from '../types';
import type { translations, Language } from '../translations';
import { Info } from 'lucide-react';
import { MarkdownDisplay } from './MarkdownDisplay';
import { CardActions } from './CardActions';

interface ResultsDisplayProps {
  predictions: HsCodePrediction[];
  t: (typeof translations)['en'];
  language: Language;
}

const PredictionCard: React.FC<{
  prediction: HsCodePrediction;
  isTopSuggestion: boolean;
  t: (typeof translations)['en'];
  language: Language;
}> = ({ prediction, isTopSuggestion, t, language }) => {
  const [cardNode, setCardNode] = useState<HTMLDivElement | null>(null);
  
  const cardClasses = `relative w-full text-left bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-8 transition-all duration-300 ease-in-out ${
    isTopSuggestion
      ? 'border-indigo-500'
      : 'border-gray-300 dark:border-gray-600'
  }`;

  return (
    <div
      ref={setCardNode}
      className={cardClasses}
    >
      <CardActions cardElement={cardNode} prediction={prediction} t={t} />
      {isTopSuggestion && (
          <div className="absolute -top-3 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-md">
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
        {prediction.tariff && (
            <div className="flex-shrink-0 md:ml-6 md:text-left">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t.tariffLabel}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md inline-block">{prediction.tariff}</p>
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
  );
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ predictions, t, language }) => {
  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-gray-900/50">
      {language === 'id' && (
        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg flex items-center justify-center text-sm text-blue-800 dark:text-blue-200">
            <Info size={16} className="mr-2 flex-shrink-0" />
            <span>{t.btkiInfo}</span>
        </div>
      )}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">{t.resultsTitle}</h2>
      
      <div className="space-y-6">
        {predictions.map((prediction, index) => (
            <PredictionCard
              key={index}
              prediction={prediction}
              isTopSuggestion={index === 0}
              t={t}
              language={language}
            />
          )
        )}
      </div>
    </div>
  );
};