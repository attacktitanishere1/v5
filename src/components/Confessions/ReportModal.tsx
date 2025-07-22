import React, { useState } from 'react';
import { X, Flag, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'confession' | 'comment' | 'message' | 'user';
  contentId: string;
  reportedUserId?: string;
}

const reportCategories = [
  { id: 'scam', label: 'Scam/Fraud', description: 'Suspicious financial requests or fake offers' },
  { id: 'personal_info', label: 'Personal Information', description: 'Sharing private details like names, addresses, phone numbers' },
  { id: 'harassment', label: 'Harassment', description: 'Bullying, threats, or unwanted contact' },
  { id: 'inappropriate', label: 'Inappropriate Content', description: 'Sexual, violent, or offensive material' },
  { id: 'spam', label: 'Spam', description: 'Repetitive or promotional content' },
  { id: 'hate_speech', label: 'Hate Speech', description: 'Discriminatory or hateful language' },
  { id: 'other', label: 'Other', description: 'Any other safety concern' },
];

export default function ReportModal({ isOpen, onClose, contentType, contentId, reportedUserId }: ReportModalProps) {
  const { submitReport, userPreferences } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    setIsSubmitting(true);
    
    const success = await submitReport({
      contentType,
      contentId,
      reportedUserId,
      category: selectedCategory,
      additionalInfo: additionalInfo.trim(),
    });

    if (success) {
      onClose();
      setSelectedCategory('');
      setAdditionalInfo('');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${
        userPreferences.theme.isDark ? 'bg-gray-800' : 'bg-white'
      } rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto transition-colors duration-200`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold flex items-center space-x-2 ${
            userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <Flag className="text-red-500" size={24} />
            <span>Report Content</span>
          </h2>
          <button
            onClick={onClose}
            className={`${userPreferences.theme.isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Why are you reporting this {contentType}?
            </label>
            <div className="space-y-2">
              {reportCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'border-red-500 bg-red-50'
                      : userPreferences.theme.isDark
                      ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                      : 'border-gray-300 hover:border-gray-400 bg-white'
                  }`}
                >
                  <div className={`font-medium ${
                    userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category.label}
                  </div>
                  <div className={`text-sm mt-1 ${
                    userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {category.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Additional Information (Optional)
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 ${
                userPreferences.theme.isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Provide any additional context that might help our moderation team..."
              rows={3}
              maxLength={500}
            />
            <p className={`text-xs mt-1 ${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {additionalInfo.length}/500 characters
            </p>
          </div>

          <div className={`p-3 rounded-lg ${
            userPreferences.theme.isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-800'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle size={16} />
              <span className="font-medium">Report Rewards</span>
            </div>
            <p className="text-sm">
              If your report helps keep our community safe, you'll receive 10-50 credits as a thank you!
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={!selectedCategory || isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-200 ${
                userPreferences.theme.isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}