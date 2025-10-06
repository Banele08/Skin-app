import { SKIN_TYPES } from '@/shared/types';

interface UserInfo {
  email?: string;
  name?: string;
  age?: number;
  skin_type?: string;
}

interface UserInfoFormProps {
  userInfo: UserInfo;
  onUserInfoChange: (info: UserInfo) => void;
}

export default function UserInfoForm({ userInfo, onUserInfoChange }: UserInfoFormProps) {
  const updateField = (field: keyof UserInfo, value: string | number | undefined) => {
    onUserInfoChange({
      ...userInfo,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Personal Information (Optional)
        </h3>
        <p className="text-gray-500 text-sm">
          Help us provide more personalized recommendations
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={userInfo.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Your name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={userInfo.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            id="age"
            min="13"
            max="120"
            value={userInfo.age?.toString() || ''}
            onChange={(e) => updateField('age', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="25"
          />
        </div>
        
        <div>
          <label htmlFor="skin_type" className="block text-sm font-medium text-gray-700 mb-1">
            Skin Type
          </label>
          <select
            id="skin_type"
            value={userInfo.skin_type || ''}
            onChange={(e) => updateField('skin_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select skin type</option>
            {SKIN_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Privacy Note:</strong> Your information is used only to provide personalized 
          skincare recommendations and is stored securely.
        </p>
      </div>
    </div>
  );
}
