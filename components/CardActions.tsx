import React, { useState, useCallback } from 'react';
import { Copy, Check, Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { HsCodePrediction } from '../types';
import type { translations } from '../translations';

interface CardActionsProps {
  prediction: HsCodePrediction;
  cardElement: HTMLDivElement | null;
  t: (typeof translations)['en'];
}

const generateMarkdown = (prediction: HsCodePrediction, t: (typeof translations)['en']): string => {
  let md = `## ${t.hsCodeLabel}: ${prediction.hs_code}\n\n`;
  md += `**${t.descriptionLabel}:** ${prediction.description}\n\n`;
  if (prediction.tariff) {
    md += `**${t.tariffLabel}:** ${prediction.tariff}\n\n`;
  }
  md += `**${t.reasoningLabel}:**\n${prediction.reasoning}\n\n`;
  if (prediction.classification_steps) {
    // Clean up the classification steps for markdown
    const steps = String(prediction.classification_steps)
      .split(/(?=\s*\d+\.\s*)/)
      .map(s => s.trim().replace(/^\d+\.\s*/, ''))
      .filter(Boolean)
      .map((step, index) => `${index + 1}. ${step}`)
      .join('\n');
    md += `**${t.classificationStepsLabel}:**\n${steps}\n`;
  }
  return md.trim();
};


export const CardActions: React.FC<CardActionsProps> = ({ prediction, cardElement, t }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopy = useCallback(async () => {
    if (isCopied) return;
    const markdown = generateMarkdown(prediction, t);
    try {
      await navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, [prediction, t, isCopied]);

  const handleDownloadPdf = useCallback(async () => {
    if (!cardElement || isDownloading) return;
    
    setIsDownloading(true);

    try {
        const canvas = await html2canvas(cardElement, {
            scale: 2, // Improve quality
            useCORS: true,
            onclone: (document) => {
                const clonedCard = document.body.firstChild as HTMLElement;
                if(clonedCard) {
                    const actions = clonedCard.querySelector('.card-actions-container');
                    if (actions) {
                        (actions as HTMLElement).style.display = 'none';
                    }
                }
            },
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height],
            hotfixes: ['px_scaling'],
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`hs-code-${prediction.hs_code}.pdf`);
    } catch (err) {
        console.error('Failed to download PDF: ', err);
    } finally {
        setIsDownloading(false);
    }
  }, [cardElement, prediction.hs_code, isDownloading]);
  
  const buttonClass = "p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50";

  return (
    <div className="card-actions-container absolute top-4 right-4 flex items-center space-x-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-1 rounded-full shadow-md">
      <button onClick={handleCopy} className={buttonClass} title={t.copyMarkdownTooltip} aria-label={t.copyMarkdownTooltip} disabled={isCopied}>
        {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
      </button>
      <button onClick={handleDownloadPdf} className={buttonClass} title={t.downloadPdfTooltip} aria-label={t.downloadPdfTooltip} disabled={isDownloading || !cardElement}>
        {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
      </button>
    </div>
  );
};