import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { GenerationMode, Language } from '../types';
import { t } from '../i18n';

interface ImageDisplayProps {
  imageUrl: string;
  language: Language;
  prompt: string | null;
  mode: GenerationMode | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, language, prompt, mode }) => {
  const getLabel = () => {
    if (mode === GenerationMode.TEXT_TO_IMAGE) {
      return t('displayPromptLabel', language);
    }
    if (mode === GenerationMode.IMAGE_TO_IMAGE) {
      return t('displayDescriptionLabel', language);
    }
    return '';
  };

  return (
    <div className="bg-gray-900/50 p-2 rounded-2xl">
      <div className="relative group rounded-xl overflow-hidden">
        <img src={imageUrl} alt={t('displayTitle', language)} className="w-full h-auto object-contain rounded-xl" />
        <a
          href={imageUrl}
          download="artify-me-creation.jpg"
          className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
          aria-label={t('displayDownload', language)}
        >
          <DownloadIcon className="w-6 h-6" />
        </a>
      </div>
      {prompt && mode && prompt.trim() !== '' && (
        <div className="mt-4 p-4 bg-gray-800/60 rounded-lg animate-fadeIn">
          <p className="text-sm font-semibold text-orange-400 mb-1">{getLabel()}</p>
          <blockquote className="text-gray-300 italic border-l-2 border-orange-500 pl-3 rtl:border-l-0 rtl:border-r-2 rtl:pr-3">
            {prompt}
          </blockquote>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;