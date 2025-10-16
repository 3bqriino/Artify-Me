import React from 'react';
import { Language } from '../types';
import { t } from '../i18n';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface PromptGuidelinesProps {
    language: Language;
    onBack: () => void;
}

const PromptGuidelines: React.FC<PromptGuidelinesProps> = ({ language, onBack }) => {
  return (
    <div className="mt-8 text-gray-300 bg-gray-900/50 p-6 rounded-xl">
        <button
            onClick={onBack}
            className="flex items-center text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors duration-200 mb-6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 rounded-md"
            aria-label={t('buttonBack', language)}
        >
            <ArrowLeftIcon className={`w-5 h-5 ${language === Language.AR ? 'ml-2 transform rotate-180' : 'mr-2'}`} />
            <span>{t('buttonBack', language)}</span>
        </button>

      <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
        <h3 className="text-xl font-semibold text-orange-400 !mt-0">{t('guidelinesTitle', language)}</h3>
        <p>
          {t('guidelinesIntro', language)}
        </p>

        <h4 className="font-semibold text-gray-200 mt-6">{t('guidelinesGeneralTitle', language)}</h4>
        <ul>
          <li dangerouslySetInnerHTML={{ __html: t('guidelinesTip1', language) }} />
          <li dangerouslySetInnerHTML={{ __html: t('guidelinesTip2', language) }} />
          <li dangerouslySetInnerHTML={{ __html: t('guidelinesTip3', language) }} />
        </ul>

        <h4 className="font-semibold text-gray-200 mt-6">{t('guidelinesCreateTitle', language)}</h4>
        <p>
          {t('guidelinesCreateIntro', language)}
        </p>
        <ul className="list-disc ltr:pl-5 rtl:pr-5">
            <li dangerouslySetInnerHTML={{ __html: t('guidelinesCreatePoint1', language) }} />
            <li dangerouslySetInnerHTML={{ __html: t('guidelinesCreatePoint2', language) }} />
            <li dangerouslySetInnerHTML={{ __html: t('guidelinesCreatePoint3', language) }} />
        </ul>
        <p className="mt-2 p-3 bg-gray-800/60 rounded-lg" dangerouslySetInnerHTML={{ __html: t('guidelinesCreateExample', language) }} />


        <h4 className="font-semibold text-gray-200 mt-6">{t('guidelinesTransformTitle', language)}</h4>
        <p dangerouslySetInnerHTML={{ __html: t('guidelinesTransformIntro', language) }} />

        <h4 className="font-semibold text-gray-200 mt-6">{t('guidelinesAvoidTitle', language)}</h4>
        <ul>
          <li dangerouslySetInnerHTML={{ __html: t('guidelinesAvoidPoint', language) }} />
        </ul>
      </div>
    </div>
  );
};

export default PromptGuidelines;
