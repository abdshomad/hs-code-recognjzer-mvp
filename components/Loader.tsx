import React, { useState, useEffect } from 'react';
import type { translations } from '../translations';

interface LoaderProps {
    message: string;
    t: (typeof translations)['en'];
}

export const Loader: React.FC<LoaderProps> = ({ message, t }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const isAnalyzing = message === t.loaderAnalyzing;
  const analysisSteps = t.loaderAnalyzingSteps || [];

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isAnalyzing && analysisSteps.length > 0) {
      interval = setInterval(() => {
        setCurrentStepIndex((prevIndex) => (prevIndex + 1) % analysisSteps.length);
      }, 1500); // Cycle through steps every 1.5 seconds
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAnalyzing, analysisSteps.length]);

  const displayMessage = isAnalyzing && analysisSteps.length > 0
    ? analysisSteps[currentStepIndex]
    : message;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600 dark:border-indigo-400"></div>
      <p className="mt-4 text-lg text-center font-semibold text-gray-700 dark:text-gray-300 h-6">
        {displayMessage}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.loaderMoment}</p>
    </div>
  );
};