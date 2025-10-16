import React from 'react';
import { Language } from '../types';
import { t } from '../i18n';
import { QuestionMarkIcon } from './icons/QuestionMarkIcon';

interface HeaderProps {
    language: Language;
    onShowGuidelines: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, onShowGuidelines }) => {
  return (
    <header className="text-center relative">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white">
        {t('headerTitle', language)}
      </h1>
      <p className="mt-3 text-lg text-gray-400">
        {t('headerSubtitle', language)}
      </p>
       <button
          onClick={onShowGuidelines}
          className={`absolute top-0 ${language === Language.AR ? 'left-0' : 'right-0'} p-2 rounded-full text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500`}
          aria-label={t('tabGuidelines', language)}
      >
          <QuestionMarkIcon className="w-6 h-6" />
      </button>
    </header>
  );
};

export default Header;