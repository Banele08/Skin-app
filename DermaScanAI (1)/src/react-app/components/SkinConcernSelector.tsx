import { SKIN_CONCERNS } from '@/shared/types';

interface SkinConcernSelectorProps {
  selectedConcerns: string[];
  onConcernsChange: (concerns: string[]) => void;
}

const concernLabels: Record<string, string> = {
  acne: 'Acne & Breakouts',
  dryness: 'Dry Skin',
  oiliness: 'Oily Skin',
  dark_spots: 'Dark Spots',
  wrinkles: 'Fine Lines & Wrinkles',
  redness: 'Redness & Irritation',
  blackheads: 'Blackheads',
  large_pores: 'Large Pores',
  uneven_texture: 'Uneven Texture',
  sensitivity: 'Sensitive Skin',
  dullness: 'Dull Skin',
  hyperpigmentation: 'Hyperpigmentation',
};

export default function SkinConcernSelector({ selectedConcerns, onConcernsChange }: SkinConcernSelectorProps) {
  const toggleConcern = (concern: string) => {
    if (selectedConcerns.includes(concern)) {
      onConcernsChange(selectedConcerns.filter(c => c !== concern));
    } else {
      onConcernsChange([...selectedConcerns, concern]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          What are your main skin concerns?
        </h3>
        <p className="text-gray-500 text-sm">
          Select all that apply to help us provide better recommendations
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SKIN_CONCERNS.map((concern) => (
          <button
            key={concern}
            onClick={() => toggleConcern(concern)}
            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
              selectedConcerns.includes(concern)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            {concernLabels[concern] || concern}
          </button>
        ))}
      </div>
      
      {selectedConcerns.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>Selected concerns:</strong> {selectedConcerns.map(c => concernLabels[c]).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
