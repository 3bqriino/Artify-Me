import React from 'react';
import { GenerationMode, Language } from '../types';
import { t } from '../i18n';

interface TabsProps {
  mode: GenerationMode;
  setMode: (mode: GenerationMode) => void;
  language: Language;
}

const Tabs: React.FC<TabsProps> = ({ mode, setMode, language }) => {
  const tabs = [
    { id: GenerationMode.TEXT_TO_IMAGE, label: t('tabCreate', language) },
    { id: GenerationMode.IMAGE_TO_IMAGE, label: t('tabTransform', language) },
  ];

  // Don't render tabs if guidelines are showing
  if (mode === GenerationMode.GUIDELINES) {
      return null;
  }

  return (
    <nav className="flex justify-center">
      <div className="flex p-1 bg-gray-800 rounded-xl space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={`relative py-2.5 px-6 sm:px-8 text-sm font-medium transition-colors duration-300 focus:outline-none rounded-lg
              ${mode === tab.id ? 'bg-orange-500 text-white shadow' : 'text-gray-300 hover:bg-gray-700/50'}`
            }
            aria-current={mode === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Tabs;