import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (imageBase64: string) => void;
  selectedImage?: string | null;
  onClear?: () => void;
}

export default function ImageUpload({ onImageSelect, selectedImage, onClear }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const base64Data = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix
      onImageSelect(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative">
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <img
            src={`data:image/jpeg;base64,${selectedImage}`}
            alt="Selected skin image"
            className="w-full h-64 object-cover"
          />
          {onClear && (
            <button
              onClick={onClear}
              className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md transition-all"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Image selected for analysis
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload Your Skin Image
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Take a clear photo of your face or skin area for analysis
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose File
          </button>
          
          <button
            onClick={() => {
              // In a real app, this would open camera
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
          >
            <Camera className="w-4 h-4 mr-2" />
            Take Photo
          </button>
        </div>
        
        <p className="text-xs text-gray-400">
          Drag and drop an image here, or click to select
        </p>
      </div>
    </div>
  );
}
