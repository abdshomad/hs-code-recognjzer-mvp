import React, { useState, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';
import type { translations } from '../translations';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  t: (typeof translations)['en'];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, t }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  return (
    <div className="p-8 md:p-12 text-center">
        <label
            htmlFor="image-upload"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-80 border-4 border-dashed rounded-xl cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-gray-700' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}
        >
            <UploadCloud size={60} strokeWidth={1} className="text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                <span className="text-indigo-600 dark:text-indigo-400">{t.uploaderTitle}</span> {t.uploaderTitleHighlight}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.uploaderSubtitle}</p>
            <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
            />
        </label>
    </div>
  );
};
