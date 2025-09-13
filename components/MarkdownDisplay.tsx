import React from 'react';

interface MarkdownDisplayProps {
  content: string;
}

/**
 * A simplified component to render a markdown list string.
 * It is not a full markdown parser and uses dangerouslySetInnerHTML with trusted content.
 * It can handle single-line numbered lists (e.g., "1. First... 2. Second...")
 * and multi-line lists.
 */
export const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ content }) => {
  const createMarkup = () => {
    let contentStr = String(content || ''); // Ensure content is a string
    
    // Pre-process the string to fix number formatting issues from the model.
    // This handles numbers split by newlines.
    // 1. Join digits separated by a newline (e.g., "2\n1" -> "21").
    contentStr = contentStr.replace(/(?<=\d)\s*[\n\r]\s*(?=\d)/g, '');
    // 2. Join a word and a number separated by a newline (e.g., "Pos\n2" -> "Pos 2").
    contentStr = contentStr.replace(/(?<=[a-zA-Z])\s*[\n\r]\s*(?=\d)/g, ' ');

    // Check if the content is a multi-line list or a single-line list with embedded numbers
    const lines = contentStr.includes('\n')
      ? contentStr.split('\n')
      // Split on the pattern "number." but keep the delimiter.
      // This handles cases like "First point. 2. Second point. 3. Third..."
      : contentStr.split(/(?=\s*\d+\.\s*)/);

    const listItems = lines
      .map(line => line.trim())
      .filter(line => line !== '')
      .map(line => {
        // Basic bold support
        const boldedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // The first item might not have a number, but subsequent ones will.
        // We still need to strip the numbers from the items that have them.
        const cleanLine = boldedLine.replace(/^\s*(\d+\.|[-*])\s*/, '');
        // Fix for numbers that are incorrectly spaced out (e.g., "0 4 1 0" becomes "0410")
        const fixedNumberLine = cleanLine.replace(/(\d)\s+(?=\d)/g, '$1');
        return `<li>${fixedNumberLine}</li>`;
      })
      .join('');
    
    // Determine if the list is ordered or unordered.
    // A list is considered ordered if it uses numbers (e.g., "1.", "2.").
    // Check the original string for a pattern like " 2." to catch single-line lists.
    const isNumbered = /^\s*\d+\./.test(contentStr.trim()) || /\s\d+\./.test(contentStr);
    const listTag = isNumbered ? 'ol' : 'ul';
    const listClass = isNumbered ? 'list-decimal' : 'list-disc';
    
    const html = `<${listTag} class="${listClass} list-inside space-y-1 text-gray-600 dark:text-gray-300 text-sm">${listItems}</${listTag}>`;

    return { __html: html };
  };

  return <div dangerouslySetInnerHTML={createMarkup()} />;
};
