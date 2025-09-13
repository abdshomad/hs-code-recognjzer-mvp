import React, { useState, useCallback } from 'react';
import { Copy, Check, Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import type { HsCodePrediction } from '../types';
import type { translations } from '../translations';

interface CardActionsProps {
  prediction: HsCodePrediction;
  allPredictions: HsCodePrediction[];
  t: (typeof translations)['en'];
}

const generateMarkdownForCopy = (prediction: HsCodePrediction, t: (typeof translations)['en']): string => {
  let md = `## ${t.hsCodeLabel}: ${prediction.hs_code}\n\n`;
  md += `**${t.descriptionLabel}:** ${prediction.description}\n\n`;
  if (prediction.tariff) {
    md += `**${t.tariffLabel}:** ${prediction.tariff}\n\n`;
  }
  md += `**${t.reasoningLabel}:**\n${prediction.reasoning}\n\n`;
  if (prediction.classification_steps) {
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


export const CardActions: React.FC<CardActionsProps> = ({ prediction, allPredictions, t }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopy = useCallback(async () => {
    if (isCopied) return;
    const markdown = generateMarkdownForCopy(prediction, t);
    try {
      await navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, [prediction, t, isCopied]);

  const handleDownloadPdf = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
        const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 40;
        const contentWidth = pageWidth - (margin * 2);

        // --- Style Constants ---
        const FONT_SIZES = { h1: 20, h2: 14, h3: 11, body: 10, label: 8, small: 7 };
        const COLORS = {
            textPrimary: '#1e293b',   // slate-800
            textSecondary: '#64748b', // slate-500
            indigo: '#4f46e5',
            green: '#16a34a',
            line: '#cbd5e1',         // slate-300
            bgLight: '#f1f5f9'      // slate-100
        };
        const SPACING = { xs: 5, sm: 10, md: 15, lg: 20, xl: 30 };
        let y = margin;
        
        const checkPageBreak = (neededHeight: number) => {
            if (y + neededHeight > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
        };
        
        // --- Report Header ---
        doc.setFontSize(FONT_SIZES.h1).setFont('helvetica', 'bold').setTextColor(COLORS.textPrimary);
        doc.text('HS Code Prediction Report', pageWidth / 2, y, { align: 'center' });
        y += FONT_SIZES.h1;

        const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        doc.setFontSize(FONT_SIZES.h3).setFont('helvetica', 'normal').setTextColor(COLORS.textSecondary);
        doc.text(`Generated on: ${date}`, pageWidth / 2, y, { align: 'center' });
        y += SPACING.lg;
        
        doc.setDrawColor(COLORS.line);
        doc.line(margin, y, pageWidth - margin, y);
        y += SPACING.xl;
        
        // --- Predictions Loop ---
        allPredictions.forEach((p, index) => {
            if (index > 0) {
                 checkPageBreak(SPACING.xl);
                 y += SPACING.lg;
                 doc.setDrawColor(COLORS.line);
                 doc.setLineDashPattern([3, 3], 0);
                 doc.line(margin, y, pageWidth - margin, y);
                 doc.setLineDashPattern([], 0);
                 y += SPACING.xl;
            }
            checkPageBreak(150); // Min height for a card

            // Card Header
            let cardHeader, headerColor, hsCodeColor;
            if (allPredictions.length > 1) {
                cardHeader = `Suggestion ${index + 1}${index === 0 ? ' (Top Suggestion)' : ''}`;
                headerColor = COLORS.textSecondary;
                hsCodeColor = COLORS.indigo;
            } else {
                cardHeader = 'Confirmed Prediction';
                headerColor = COLORS.green;
                hsCodeColor = COLORS.green;
            }
            doc.setFontSize(FONT_SIZES.h2).setFont('helvetica', 'bold').setTextColor(headerColor);
            doc.text(cardHeader, margin, y);
            y += FONT_SIZES.h2 * 1.5;

            // --- Key Info in a box ---
            doc.setFontSize(FONT_SIZES.h1);
            const hsCodeLines = doc.splitTextToSize(p.hs_code, contentWidth / 2);
            const boxHeight = (hsCodeLines.length * FONT_SIZES.h1) + SPACING.md * 2 + FONT_SIZES.label;
            checkPageBreak(boxHeight);
            
            doc.setFillColor(COLORS.bgLight);
            doc.rect(margin, y, contentWidth, boxHeight, 'F');
            
            const contentY = y + SPACING.md;
            doc.setFontSize(FONT_SIZES.label).setFont('helvetica', 'normal').setTextColor(COLORS.textSecondary);
            doc.text(t.hsCodeLabel.toUpperCase(), margin + SPACING.md, contentY);
            
            doc.setFontSize(FONT_SIZES.h1).setFont('helvetica', 'bold').setTextColor(hsCodeColor);
            doc.text(hsCodeLines, margin + SPACING.md, contentY + FONT_SIZES.label + SPACING.xs);
            
            if (p.tariff) {
                doc.setFontSize(FONT_SIZES.label).setFont('helvetica', 'normal').setTextColor(COLORS.textSecondary);
                doc.text(t.tariffLabel.toUpperCase(), pageWidth - margin - SPACING.md, contentY, { align: 'right' });
                doc.setFontSize(FONT_SIZES.h2).setFont('helvetica', 'bold').setTextColor(COLORS.textPrimary);
                doc.text(p.tariff, pageWidth - margin - SPACING.md, contentY + FONT_SIZES.label + SPACING.xs, { align: 'right' });
            }
            y += boxHeight + SPACING.lg;
            
            // --- Sections: Description, Reasoning, Steps ---
            const drawSection = (title: string, content: string, isList = false) => {
                 checkPageBreak(FONT_SIZES.h3 + SPACING.md * 2);
                 doc.setFontSize(FONT_SIZES.h3).setFont('helvetica', 'bold').setTextColor(COLORS.textPrimary);
                 doc.text(title, margin, y);
                 y += FONT_SIZES.h3 + SPACING.sm;

                 doc.setFontSize(FONT_SIZES.body).setFont('helvetica', 'normal').setTextColor(COLORS.textSecondary);
                 
                 if (isList) {
                     const stepsContent = String(content || '').replace(/(?<=[a-zA-Z])\s*[\n\r]\s*(?=\d)/g, ' ');
                     const steps = stepsContent.split(/(?=\s*\d+\.\s*)/).map(s => s.trim()).filter(Boolean);
                     steps.forEach((step) => {
                         const stepNumberMatch = step.match(/^\s*\d+\./);
                         const stepNumber = stepNumberMatch ? stepNumberMatch[0] : '•';
                         const stepText = step.replace(/^\s*\d+\.\s*/, '');
                         
                         const textLines = doc.splitTextToSize(stepText, contentWidth - 30);
                         const textHeight = textLines.length * FONT_SIZES.body * 1.15;
                         checkPageBreak(textHeight + SPACING.xs);

                         doc.text(stepNumber, margin + SPACING.sm, y);
                         doc.text(textLines, margin + SPACING.sm + 20, y, { lineHeightFactor: 1.15 });
                         y += textHeight + SPACING.sm;
                     });
                 } else {
                     const lines = doc.splitTextToSize(content, contentWidth);
                     const textHeight = lines.length * FONT_SIZES.body * 1.15;
                     checkPageBreak(textHeight);
                     doc.text(lines, margin, y, { lineHeightFactor: 1.15 });
                     y += textHeight;
                 }
                 y += SPACING.lg;
            };

            drawSection(t.descriptionLabel, p.description);
            drawSection(t.reasoningLabel, p.reasoning);

            if (p.classification_steps) {
                drawSection(t.classificationStepsLabel, p.classification_steps, true);
            }
        });
        
        // --- Page Footer on all pages ---
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(FONT_SIZES.label).setTextColor(COLORS.textSecondary);
            doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
            doc.setFontSize(FONT_SIZES.small).setTextColor(COLORS.textSecondary);
            doc.text(t.footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }

        const fileName = allPredictions.length === 1 
            ? `hs-code-${allPredictions[0].hs_code}.pdf`
            : 'hs-code-predictions.pdf';
        doc.save(fileName);

    } catch (err) {
        console.error('Failed to download PDF: ', err);
    } finally {
        setIsDownloading(false);
    }
  }, [isDownloading, allPredictions, t]);
  
  const buttonClass = "p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-colors disabled:opacity-50";

  return (
    <div className="card-actions-container absolute top-4 right-4 flex items-center space-x-1 bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-sm p-1 rounded-full shadow-md">
      <button onClick={handleCopy} className={buttonClass} title={t.copyMarkdownTooltip} aria-label={t.copyMarkdownTooltip} disabled={isCopied}>
        {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
      </button>
      <button onClick={handleDownloadPdf} className={buttonClass} title={t.downloadPdfTooltip} aria-label={t.downloadPdfTooltip} disabled={isDownloading}>
        {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
      </button>
    </div>
  );
};
