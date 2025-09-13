import React from 'react';
import type { translations } from '../translations';

interface FooterProps {
    t: (typeof translations)['en'];
}

export const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="w-full text-center p-4 mt-8">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {t.footerText}
      </p>
    </footer>
  );
};