import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ClarificationPrompt } from './components/ClarificationPrompt';
import { RefinedResultDisplay } from './components/RefinedResultDisplay';
import { Loader } from './components/Loader';
import { predictHsCodeFromImage, getRefinedPrediction } from './services/geminiService';
import type { HsCodePrediction, Clarification } from './types';
import { Footer } from './components/Footer';
import { translations, Language } from './translations';
import { Login } from './components/Login';

type UserStatus = 'onboarding' | 'guest' | 'loggedIn';
export type Theme = 'light' | 'dark' | 'system';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('id');
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'system'
  );
  const t = translations[language];

  const [image, setImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [initialPredictions, setInitialPredictions] = useState<HsCodePrediction[]>([]);
  const [clarification, setClarification] = useState<Clarification | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [refinedPrediction, setRefinedPrediction] = useState<HsCodePrediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatus>('onboarding');
  const [predictionsToday, setPredictionsToday] = useState<number>(0);

  const isLoggedIn = userStatus === 'loggedIn';
  const MAX_PREDICTIONS = isLoggedIn ? 19 : 7;

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        root.classList.toggle('dark', e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('predictionCount');
      const today = new Date().toISOString().split('T')[0];
      if (storedData) {
        const { count, date } = JSON.parse(storedData);
        if (date === today) {
          setPredictionsToday(count);
        } else {
          localStorage.setItem('predictionCount', JSON.stringify({ count: 0, date: today }));
          setPredictionsToday(0);
        }
      } else {
        localStorage.setItem('predictionCount', JSON.stringify({ count: 0, date: today }));
      }
    } catch (e) {
      console.error("Failed to read from localStorage", e);
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('predictionCount', JSON.stringify({ count: 0, date: today }));
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };
  
  const handleLogin = () => setUserStatus('loggedIn');
  const handleContinueAsGuest = () => setUserStatus('guest');

  const handleLogout = () => {
    setUserStatus('onboarding');
    resetState();
  };

  const resetState = () => {
    setImage(null);
    setImageMimeType(null);
    setInitialPredictions([]);
    setClarification(null);
    setUserAnswer(null);
    setRefinedPrediction(null);
    setError(null);
    setIsLoading(false);
    setIsRefining(false);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resetState();
      const base64String = (reader.result as string).split(',')[1];
      setImage(base64String);
      setImageMimeType(file.type);
    };
    reader.onerror = () => {
      setError(t.errorReadingFile);
    };
    reader.readAsDataURL(file);
  };
  
  const handlePredict = useCallback(async () => {
    if (!image || !imageMimeType) return;
    
    if (predictionsToday >= MAX_PREDICTIONS) {
      setError(t.limitReachedError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setInitialPredictions([]);
    setClarification(null);
    setUserAnswer(null);
    setRefinedPrediction(null);

    try {
      const { predictions, clarification } = await predictHsCodeFromImage(image, imageMimeType, language);
      setInitialPredictions(predictions);

      const newCount = predictionsToday + 1;
      setPredictionsToday(newCount);
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('predictionCount', JSON.stringify({ count: newCount, date: today }));

      if (clarification) {
         setClarification(clarification);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : t.errorUnknown);
    } finally {
      setIsLoading(false);
    }
  }, [image, imageMimeType, t, language, predictionsToday, MAX_PREDICTIONS]);

  const handleSelectOption = useCallback(async (option: string) => {
    if (!image || !imageMimeType || !clarification || initialPredictions.length === 0) return;
    
    setIsRefining(true);
    setUserAnswer(option);
    setError(null);

    try {
        const result = await getRefinedPrediction(image, imageMimeType, initialPredictions, clarification, option, language);
        setRefinedPrediction(result);
    } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : t.errorRefinement);
    } finally {
        setIsRefining(false);
    }
  }, [image, imageMimeType, initialPredictions, clarification, t, language]);

  const handleReset = () => {
    resetState();
  };

  const background = (
    <div className="fixed inset-0 -z-10 h-full w-full">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-slate-100 dark:bg-slate-900"></div>
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-200 to-sky-200 dark:from-indigo-900/80 dark:to-sky-900/80 blur-3xl opacity-50 dark:opacity-40 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-20%] top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-pink-200 to-amber-200 dark:from-pink-900/80 dark:to-amber-900/80 blur-3xl opacity-50 dark:opacity-40 animate-pulse-slow animation-delay-4000"></div>
    </div>
  );

  if (userStatus === 'onboarding') {
    return (
      <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 font-sans">
        {background}
        <Login 
          onLogin={handleLogin} 
          onContinueAsGuest={handleContinueAsGuest} 
          t={t}
          language={language}
          onLanguageChange={handleLanguageChange}
          theme={theme}
          onThemeChange={setTheme}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 font-sans">
      {background}
      <Header 
        language={language} 
        onLanguageChange={handleLanguageChange} 
        t={t} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        predictionsToday={predictionsToday}
        theme={theme}
        onThemeChange={setTheme}
      />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-2xl border border-slate-300/50 dark:border-slate-700/50 shadow-2xl rounded-2xl overflow-hidden">
          {!image ? (
            <ImageUploader onImageUpload={handleImageUpload} t={t} />
          ) : (
            <div className="p-6 md:p-10">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2 flex flex-col items-center">
                  <h2 className="text-2xl font-bold mb-4 text-center text-slate-800 dark:text-slate-200">{t.uploadedImage}</h2>
                  <img src={`data:${imageMimeType};base64,${image}`} alt="Product" className="rounded-lg shadow-lg max-h-80 object-contain" />
                </div>
                <div className="md:w-1/2 flex flex-col justify-center items-center">
                  {isLoading ? (
                    <Loader message={t.loaderAnalyzing} t={t}/>
                  ) : (
                    <div className="flex flex-col gap-4 w-full">
                       {initialPredictions.length === 0 && !error && (
                         <button
                           onClick={handlePredict}
                           className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed disabled:scale-100"
                           disabled={isLoading || predictionsToday >= MAX_PREDICTIONS}
                         >
                           {t.predictButton}
                         </button>
                       )}
                       <button
                         onClick={handleReset}
                         className="w-full bg-slate-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-600"
                       >
                         {initialPredictions.length > 0 ? t.startOverButton : t.tryAnotherImageButton}
                       </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border-l-4 border-red-500 text-red-800 dark:text-red-200 p-4 m-6 rounded-md" role="alert">
              <p className="font-bold">{t.errorTitle}</p>
              <p>{error}</p>
            </div>
          )}
          
          <div className="flex flex-col">
            {initialPredictions.length > 0 && !isLoading && (
              <ResultsDisplay predictions={initialPredictions} t={t} language={language}/>
            )}

            {clarification && !refinedPrediction && !isRefining && (
              <ClarificationPrompt
                clarification={clarification}
                onSelectOption={handleSelectOption}
                t={t}
              />
            )}

            {isRefining && <Loader message={t.loaderRefining} t={t} />}

            {refinedPrediction && userAnswer && (
              <RefinedResultDisplay 
                prediction={refinedPrediction}
                userAnswer={userAnswer}
                t={t}
                language={language}
              />
            )}
          </div>
        </div>
      </main>
      <Footer t={t} />
    </div>
  );
};

export default App;