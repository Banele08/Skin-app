import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Camera, Share2, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '@/react-app/components/Header';
import ProductCard from '@/react-app/components/ProductCard';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import { useSkinAnalysis } from '@/react-app/hooks/useSkinAnalysis';

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentAnalysis, getAnalysis, isLoading, error } = useSkinAnalysis();
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  useEffect(() => {
    if (id && !currentAnalysis) {
      getAnalysis(parseInt(id));
    }
  }, [id, currentAnalysis, getAnalysis]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My DermaScanAI Results',
          text: 'Check out my personalized skincare recommendations from DermaScanAI!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getConfidenceIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="text-center py-16">
            <LoadingSpinner size="lg" text="Loading your analysis results..." />
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Analysis Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || 'The requested analysis could not be found.'}
            </p>
            <Link
              to="/analysis"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start New Analysis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            
            <Link
              to="/analysis"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>New Analysis</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image and Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="aspect-video bg-gray-50">
                <img
                  src={currentAnalysis.image_url}
                  alt="Analyzed skin"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Analysis Results
                  </h2>
                  
                  {/* Confidence Score */}
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getConfidenceColor(currentAnalysis.confidence_score)}`}>
                    {getConfidenceIcon(currentAnalysis.confidence_score)}
                    <span>
                      {Math.round(currentAnalysis.confidence_score * 100)}% Confidence
                    </span>
                  </div>
                </div>
                
                {/* Analysis Text */}
                <div className="prose prose-sm max-w-none">
                  <div className={`transition-all duration-300 ${showFullAnalysis ? '' : 'line-clamp-4'}`}>
                    {currentAnalysis.analysis.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-700 mb-3">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  {currentAnalysis.analysis.length > 300 && (
                    <button
                      onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      {showFullAnalysis ? 'Show Less' : 'Read Full Analysis'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recommendations */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Recommended Products
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Based on your skin analysis, here are personalized product recommendations
              </p>
              
              <div className="space-y-6">
                {currentAnalysis.recommendations.map((rec, index) => (
                  <ProductCard
                    key={index}
                    product={rec.product}
                    reason={rec.reason}
                    priority={rec.priority}
                  />
                ))}
              </div>
              
              {currentAnalysis.recommendations.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No specific product recommendations available at this time.
                  </p>
                </div>
              )}
            </div>

            {/* Additional Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-3">
                💡 Skincare Tips
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Always patch test new products before full application</li>
                <li>• Use sunscreen daily, even on cloudy days</li>
                <li>• Introduce new products gradually to avoid irritation</li>
                <li>• Consistency is key - give products 4-6 weeks to show results</li>
                <li>• Consider consulting a dermatologist for persistent concerns</li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-xs text-yellow-800">
                <strong>Disclaimer:</strong> This analysis is for informational purposes only 
                and should not replace professional medical advice. Always consult with a 
                dermatologist for serious skin concerns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
