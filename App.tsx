import React, { useState, useCallback, useEffect } from 'react';
import { GenerationMode, Language } from './types';
import { generateImageFromText, transformImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import Header from './components/Header';
import Tabs from './components/Tabs';
import ImageUploader from './components/ImageUploader';
import ImageDisplay from './components/ImageDisplay';
import Loader from './components/Loader';
import PromptGuidelines from './components/PromptGuidelines';
import LanguageSwitcher from './components/LanguageSwitcher';
import { t } from './i18n';

const App: React.FC = () => {
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.TEXT_TO_IMAGE);
  const [previousMode, setPreviousMode] = useState<GenerationMode>(GenerationMode.TEXT_TO_IMAGE);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [prompt, setPrompt] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [displayedPrompt, setDisplayedPrompt] = useState<string | null>(null);
  const [resultMode, setResultMode] = useState<GenerationMode | null>(null);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === Language.AR ? 'rtl' : 'ltr';
  }, [language]);
  
  const resetState = () => {
      setIsLoading(true);
      setError(null);
      setGeneratedImage(null);
      setDisplayedPrompt(null);
      setResultMode(null);
  }

  const handleShowGuidelines = () => {
    if (mode !== GenerationMode.GUIDELINES) {
      setPreviousMode(mode);
    }
    setMode(GenerationMode.GUIDELINES);
  };

  const handleBackFromGuidelines = () => {
    setMode(previousMode);
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError(t('errorPrompt', language));
      return;
    }
    resetState();
    try {
      const imageB64 = await generateImageFromText(prompt);
      setGeneratedImage(`data:image/jpeg;base64,${imageB64}`);
      setDisplayedPrompt(prompt);
      setResultMode(GenerationMode.TEXT_TO_IMAGE);
    } catch (e) {
      console.error(e);
      setError(`${t('errorGenerate', language)} ${(e as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, language]);
  
  const handleTransform = useCallback(async () => {
    if (!uploadedImage) {
      setError(t('errorUpload', language));
      return;
    }
    
    resetState();
    try {
      const { base64, mimeType } = await fileToBase64(uploadedImage);
      const imageB64 = await transformImage(base64, mimeType, prompt);
      setGeneratedImage(`data:image/png;base64,${imageB64}`);
      setDisplayedPrompt(prompt);
      setResultMode(GenerationMode.IMAGE_TO_IMAGE);
    } catch (e) {
      console.error(e);
      const errorMessage = (e as Error).message;
      if (errorMessage.includes('IMAGE_OTHER')) {
        setError(t('errorImageOther', language));
      } else {
        setError(`${t('errorTransform', language)} ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage, prompt, language]);

  const handleSubmit = () => {
    if (mode === GenerationMode.TEXT_TO_IMAGE) {
      handleGenerate();
    } else {
      handleTransform();
    }
  };
  
  const renderContent = () => {
    const flatButtonStyle = "w-full mt-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 ease-in-out flex items-center justify-center text-base";

    if (mode === GenerationMode.IMAGE_TO_IMAGE) {
      return (
        <div className="mt-8">
          <ImageUploader onImageUpload={setUploadedImage} language={language} />
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mt-6 mb-2">
            {t('promptLabelTransform', language)}
          </label>
          <textarea
            id="prompt"
            rows={2}
            className="w-full bg-gray-900/80 border border-gray-700 rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200"
            placeholder={t('promptPlaceholderTransform', language)}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !uploadedImage}
            className={flatButtonStyle}
          >
            {t('buttonTransform', language)}
          </button>
        </div>
      )
    }
    
    // TEXT_TO_IMAGE mode
    return (
      <div className="mt-8">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          {t('promptLabelCreate', language)}
        </label>
        <textarea
          id="prompt"
          rows={4}
          className="w-full bg-gray-900/80 border border-gray-700 rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200"
          placeholder={t('promptPlaceholderCreate', language)}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !prompt}
          className={flatButtonStyle}
        >
          {t('buttonGenerate', language)}
        </button>
      </div>
    );
  }

  const renderCanvas = () => {
    if (isLoading) {
        return <Loader language={language} />;
    }
    if (generatedImage) {
        return (
            <div className="animate-fadeInUp">
                <h3 className="text-xl font-semibold mb-4 text-center">{t('displayTitle', language)}</h3>
                <ImageDisplay
                    imageUrl={generatedImage}
                    language={language}
                    prompt={displayedPrompt}
                    mode={resultMode}
                />
            </div>
        );
    }
    // Placeholder for when there is no image or loading state
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] lg:min-h-full bg-gray-900/50 rounded-2xl border border-dashed border-gray-700">
            <div className="text-center p-8">
                <p className="text-2xl font-bold text-gray-300">Your Canvas</p>
                <p className="mt-2 text-gray-500">Your generated masterpiece will appear here.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-200 font-sans p-4 sm:p-6 lg:p-8 bg-[#121212]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
        
        {/* Left Column: Controls */}
        <div className="flex flex-col">
          <Header language={language} onShowGuidelines={handleShowGuidelines}/>
          <main className="mt-8">
            <Tabs mode={mode} setMode={setMode} language={language} />

            <div key={mode} className="animate-fadeIn">
              {mode === GenerationMode.GUIDELINES 
                ? <PromptGuidelines language={language} onBack={handleBackFromGuidelines} />
                : renderContent()
              }
            </div>

             {error && !isLoading && <div className="mt-6 text-red-300 bg-red-900/50 border border-red-500/50 p-3 rounded-lg animate-fadeIn">{error}</div>}
          
          </main>
           <footer className="w-full flex justify-between items-center text-gray-400 text-xs mt-12">
            <p>{t('footerText', language)}</p>
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
          </footer>
        </div>

        {/* Right Column: Canvas */}
        <div className="mt-12 lg:mt-0 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
          {renderCanvas()}
        </div>
      </div>
    </div>
  );
};

export default App;