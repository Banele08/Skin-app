import { Link } from 'react-router';
import { Camera, Shield, Sparkles, Users, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '@/react-app/components/Header';

export default function Home() {
  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced computer vision analyzes your skin with dermatologist-level accuracy'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Personalized Recommendations',
      description: 'Get tailored product suggestions based on your unique skin profile'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Privacy First',
      description: 'Your skin data is processed securely and never shared without consent'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Expert Backed',
      description: 'Recommendations based on dermatological research and product databases'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Upload Your Photo',
      description: 'Take a clear photo of your face or skin area'
    },
    {
      number: 2,
      title: 'Describe Your Concerns',
      description: 'Tell us about your skin concerns and goals'
    },
    {
      number: 3,
      title: 'Get AI Analysis',
      description: 'Our AI analyzes your skin and identifies issues'
    },
    {
      number: 4,
      title: 'Receive Recommendations',
      description: 'Get personalized product suggestions for your skin'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Skin Analysis
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get personalized skincare recommendations powered by advanced AI. 
              Upload your photo and discover the perfect products for your unique skin needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/analysis"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Skin Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                to="/history"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300"
              >
                View Past Results
              </Link>
            </div>

            {/* Hero Image */}
            <div className="relative mx-auto max-w-3xl">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=500&fit=crop&crop=face"
                  alt="Skincare analysis preview"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Analysis Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 animate-bounce">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Skin Type: Combination</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 animate-pulse">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">95% Confidence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get professional skincare recommendations in just four simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                
                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-gray-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose DermaScanAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets skincare expertise to give you the best recommendations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Skincare Routine?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands who have discovered their perfect skincare products with AI analysis
          </p>
          
          <Link
            to="/analysis"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Camera className="w-5 h-5 mr-2" />
            Get Your Free Analysis
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
