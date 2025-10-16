import React, { useState, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { Language } from '../types';
import { t } from '../i18n';

interface ImageUploaderProps {
  onImageUpload: (file: File | null) => void;
  language: Language;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, language }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        alert("File is too large. Please upload an image under 4MB.");
        return;
      }
      onImageUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setImagePreview(null);
    onImageUpload(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };


  return (
    <div className="w-full">
      <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300 mb-2">
        {t('uploaderLabel', language)}
      </label>
      {imagePreview ? (
        <div className="relative group w-full h-64 border border-gray-600 rounded-lg flex justify-center items-center">
          <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleRemoveImage}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              {t('uploaderRemove', language)}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-64 border border-dashed border-gray-700 rounded-lg flex flex-col justify-center items-center text-center p-4 cursor-pointer hover:border-orange-500 hover:bg-gray-800/40 transition-all duration-300"
          onClick={() => fileInputRef.current?.click()}>
          <UploadIcon className="w-12 h-12 text-gray-500 mb-2" />
          <p className="text-gray-400">
            <span className="font-semibold text-orange-400">{t('uploaderText', language)}</span> {t('uploaderOr', language)}
          </p>
          <p className="text-xs text-gray-500 mt-1">{t('uploaderConstraints', language)}</p>
          <input
            id="image-upload"
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;