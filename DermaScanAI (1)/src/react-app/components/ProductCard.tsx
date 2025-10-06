import { Star, ExternalLink } from 'lucide-react';
import { Product } from '@/shared/types';

interface ProductCardProps {
  product: Product;
  reason?: string;
  priority?: number;
}

export default function ProductCard({ product, reason, priority }: ProductCardProps) {
  const handleProductClick = () => {
    if (product.product_url) {
      window.open(product.product_url, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Priority Badge */}
      {priority && priority <= 3 && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            priority === 1 ? 'bg-yellow-100 text-yellow-800' :
            priority === 2 ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {priority === 1 ? 'Top Pick' : `#${priority}`}
          </span>
        </div>
      )}
      
      {/* Product Image */}
      <div className="relative h-48 bg-gray-50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{product.name}</h3>
          {product.brand && (
            <p className="text-sm text-gray-600">{product.brand}</p>
          )}
        </div>
        
        {/* Rating and Price */}
        <div className="flex items-center justify-between mb-3">
          {product.rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
          
          {product.price && (
            <span className="text-lg font-bold text-green-600">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Category */}
        {product.category && (
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-3">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>
        )}
        
        {/* Recommendation Reason */}
        {reason && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>Why recommended:</strong> {reason}
            </p>
          </div>
        )}
        
        {/* Ingredients */}
        {product.ingredients && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-1">Key Ingredients:</h4>
            <p className="text-sm text-gray-600">{product.ingredients}</p>
          </div>
        )}
        
        {/* Concerns Addressed */}
        {product.concerns_addressed && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-1">Addresses:</h4>
            <p className="text-sm text-gray-600">{product.concerns_addressed}</p>
          </div>
        )}
        
        {/* Action Button */}
        <button
          onClick={handleProductClick}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <span>View Product</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
