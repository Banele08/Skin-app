import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '@/react-app/components/Header';
import ImageUpload from '@/react-app/components/ImageUpload';
import SkinConcernSelector from '@/react-app/components/SkinConcernSelector';
import UserInfoForm from '@/react-app/components/UserInfoForm';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import { useSkinAnalysis } from '@/react-app/hooks/useSkinAnalysis';

interface UserInfo {
  email?: string;
  name?: string;
  age?: number;
  skin_type?: string;
}

export default function Analysis() {
  const navigate = useNavigate();
  const { analyzeImage, isLoading, error } = useSkinAnalysis();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({});

  const totalSteps = 3;

  const handleImageSelect = (imageBase64: string) => {
    setSelectedImage(imageBase64);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || skinConcerns.length === 0) {
      alert('Please upload an image and select at least one skin concern');
      return;
    }

    try {
      const result = await analyzeImage({
        image: selectedImage,
        skin_concerns: skinConcerns.join(', '),
        user_info: Object.keys(userInfo).length > 0 && userInfo.email ? userInfo as any : undefined,
      });

      if (result) {
        navigate(`/results/${result.id}`);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedImage !== null;
      case 2:
        return skinConcerns.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Upload Your Photo';
      case 2:
        return 'Describe Your Concerns';
      case 3:
        return 'Personal Information';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return 'Take or upload a clear photo of your face or the skin area you want analyzed';
      case 2:
        return 'Select the skin concerns that you\'d like help with';
      case 3:
        return 'Optional: Add your information for more personalized recommendations';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center py-16">
              <LoadingSpinner size="lg" text="Analyzing your skin with AI..." />
              <div className="mt-8 space-y-2">
                <p className="text-lg font-medium text-gray-900">This may take a few moments</p>
                <p className="text-gray-600">
                  Our AI is carefully analyzing your image and comparing it with 
                  dermatological data to provide the best recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Skin Analysis</h1>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getStepTitle()}
              </h2>
              <p className="text-gray-600">
                {getStepDescription()}
              </p>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
              {currentStep === 1 && (
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                  onClear={handleClearImage}
                />
              )}

              {currentStep === 2 && (
                <SkinConcernSelector
                  selectedConcerns={skinConcerns}
                  onConcernsChange={setSkinConcerns}
                />
              )}

              {currentStep === 3 && (
                <UserInfoForm
                  userInfo={userInfo}
                  onUserInfoChange={setUserInfo}
                />
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceedToNext()}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    canProceedToNext()
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleAnalyze}
                  disabled={!canProceedToNext()}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all ${
                    canProceedToNext()
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>Analyze My Skin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Having trouble? Make sure your photo is well-lit and shows your face clearly. 
            Our AI works best with natural lighting and a front-facing view.
          </p>
        </div>
      </div>
    </div>
  );
}
