import React from 'react';
import { Language } from '../types';

interface LanguageSwitcherProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, setLanguage }) => {
  const inactiveClass = "text-gray-400 hover:text-white";
  const activeClass = "text-orange-400 font-bold";

  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <button 
        onClick={() => setLanguage(Language.EN)}
        className={`transition ${language === Language.EN ? activeClass : inactiveClass}`}
      >
        English
      </button>
      <div className="w-px h-4 bg-gray-600"></div>
      <button 
        onClick={() => setLanguage(Language.AR)}
        className={`transition ${language === Language.AR ? activeClass : inactiveClass}`}
      >
        العربية
      </button>
    </div>
  );
};

export default LanguageSwitcher;