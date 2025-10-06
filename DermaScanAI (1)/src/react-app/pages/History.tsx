import { useState } from 'react';
import { Link } from 'react-router';
import { Calendar, Camera, Eye, Mail, AlertCircle } from 'lucide-react';
import Header from '@/react-app/components/Header';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import { useSkinAnalysis } from '@/react-app/hooks/useSkinAnalysis';
import { SkinAnalysis } from '@/shared/types';

export default function History() {
  const { getUserAnalyses, isLoading, error } = useSkinAnalysis();
  const [analyses, setAnalyses] = useState<SkinAnalysis[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(true);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;

    const results = await getUserAnalyses(userEmail);
    setAnalyses(results);
    setShowEmailForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConfidenceColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (showEmailForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                View Your Analysis History
              </h1>
              <p className="text-gray-600">
                Enter your email to see your past skin analyses and recommendations
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'View My History'
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">
                <strong>Privacy Note:</strong> We only store your analyses if you provided 
                an email during the analysis process. Your data is kept secure and private.
              </p>
            </div>
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analysis History
            </h1>
            <p className="text-gray-600">
              Your past skin analyses and recommendations for {userEmail}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowEmailForm(true)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Change Email
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

        {isLoading ? (
          <div className="text-center py-16">
            <LoadingSpinner size="lg" text="Loading your analysis history..." />
          </div>
        ) : analyses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Analyses Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any previous analyses for this email address.
            </p>
            <Link
              to="/analysis"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start Your First Analysis
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-video bg-gray-50">
                  {analysis.image_url ? (
                    <img
                      src={analysis.image_url}
                      alt="Skin analysis"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(analysis.created_at || '')}</span>
                    </div>
                    
                    {analysis.confidence_score && (
                      <span className={`text-sm font-medium ${getConfidenceColor(analysis.confidence_score)}`}>
                        {Math.round(analysis.confidence_score * 100)}% confidence
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Skin Concerns
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {analysis.skin_concerns}
                    </p>
                  </div>

                  {analysis.ai_analysis && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">
                        AI Analysis Preview
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {analysis.ai_analysis}
                      </p>
                    </div>
                  )}

                  <Link
                    to={`/results/${analysis.id}`}
                    className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Results</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {analyses.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Skincare Journey
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {analyses.length}
                </div>
                <div className="text-sm text-gray-600">
                  Total Analyses
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {analyses.filter(a => a.confidence_score && a.confidence_score >= 0.8).length}
                </div>
                <div className="text-sm text-gray-600">
                  High Confidence Results
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {new Set(analyses.map(a => a.skin_concerns.split(',')[0]?.trim())).size}
                </div>
                <div className="text-sm text-gray-600">
                  Different Concerns Analyzed
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
