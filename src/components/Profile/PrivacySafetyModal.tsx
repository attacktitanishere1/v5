import React from 'react';
import { X, Shield, AlertTriangle, Eye, UserX, Flag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PrivacySafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacySafetyModal({ isOpen, onClose }: PrivacySafetyModalProps) {
  const { userPreferences } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${
        userPreferences.theme.isDark ? 'bg-gray-800' : 'bg-white'
      } rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors duration-200`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold flex items-center space-x-2 ${
            userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <Shield className="text-blue-500" size={24} />
            <span>Privacy & Safety</span>
          </h2>
          <button
            onClick={onClose}
            className={`${userPreferences.theme.isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Privacy Guidelines */}
          <div className={`p-4 rounded-lg border ${
            userPreferences.theme.isDark ? 'border-red-700 bg-red-900' : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="text-red-500" size={20} />
              <h3 className={`font-semibold ${
                userPreferences.theme.isDark ? 'text-red-200' : 'text-red-800'
              }`}>
                Important Privacy Guidelines
              </h3>
            </div>
            <ul className={`space-y-2 text-sm ${
              userPreferences.theme.isDark ? 'text-red-200' : 'text-red-700'
            }`}>
              <li>• <strong>Never share your real name</strong> - Use only your chosen username</li>
              <li>• <strong>Don't post personal information</strong> - No phone numbers, addresses, or email</li>
              <li>• <strong>Avoid identifying details</strong> - School names, workplace, or location specifics</li>
              <li>• <strong>No photos of yourself</strong> - Keep your identity anonymous</li>
              <li>• <strong>Be cautious with personal stories</strong> - Remove identifying details from confessions</li>
            </ul>
          </div>

          {/* Safety Tips */}
          <div className={`p-4 rounded-lg border ${
            userPreferences.theme.isDark ? 'border-blue-700 bg-blue-900' : 'border-blue-200 bg-blue-50'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="text-blue-500" size={20} />
              <h3 className={`font-semibold ${
                userPreferences.theme.isDark ? 'text-blue-200' : 'text-blue-800'
              }`}>
                Safety Tips
              </h3>
            </div>
            <ul className={`space-y-2 text-sm ${
              userPreferences.theme.isDark ? 'text-blue-200' : 'text-blue-700'
            }`}>
              <li>• Report inappropriate content immediately</li>
              <li>• Block users who make you uncomfortable</li>
              <li>• Don't arrange to meet people from the app</li>
              <li>• Trust your instincts - if something feels wrong, report it</li>
              <li>• Keep conversations within the app</li>
            </ul>
          </div>

          {/* Reporting System */}
          <div className={`p-4 rounded-lg border ${
            userPreferences.theme.isDark ? 'border-yellow-700 bg-yellow-900' : 'border-yellow-200 bg-yellow-50'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              <Flag className="text-yellow-500" size={20} />
              <h3 className={`font-semibold ${
                userPreferences.theme.isDark ? 'text-yellow-200' : 'text-yellow-800'
              }`}>
                How to Report
              </h3>
            </div>
            <div className={`text-sm ${
              userPreferences.theme.isDark ? 'text-yellow-200' : 'text-yellow-700'
            }`}>
              <p className="mb-3">When you report content, you can select from these categories:</p>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Scam/Fraud</strong> - Suspicious financial requests or fake offers</li>
                <li>• <strong>Personal Information</strong> - Someone sharing private details</li>
                <li>• <strong>Harassment</strong> - Bullying, threats, or unwanted contact</li>
                <li>• <strong>Inappropriate Content</strong> - Sexual, violent, or offensive material</li>
                <li>• <strong>Spam</strong> - Repetitive or promotional content</li>
                <li>• <strong>Hate Speech</strong> - Discriminatory or hateful language</li>
                <li>• <strong>Other</strong> - Any other safety concern</li>
              </ul>
              <p className="mt-3 font-medium">
                💰 You'll receive credits if your report helps keep the community safe!
              </p>
            </div>
          </div>

          {/* Privacy Controls */}
          <div className={`p-4 rounded-lg border ${
            userPreferences.theme.isDark ? 'border-green-700 bg-green-900' : 'border-green-200 bg-green-50'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              <Eye className="text-green-500" size={20} />
              <h3 className={`font-semibold ${
                userPreferences.theme.isDark ? 'text-green-200' : 'text-green-800'
              }`}>
                Your Privacy Controls
              </h3>
            </div>
            <ul className={`space-y-2 text-sm ${
              userPreferences.theme.isDark ? 'text-green-200' : 'text-green-700'
            }`}>
              <li>• Control who can see your online status</li>
              <li>• Choose who can send you friend requests</li>
              <li>• Hide your profile information from other users</li>
              <li>• Block users to prevent all contact</li>
              <li>• Report and block in one action</li>
            </ul>
          </div>

          {/* Emergency Contact */}
          <div className={`p-4 rounded-lg border ${
            userPreferences.theme.isDark ? 'border-purple-700 bg-purple-900' : 'border-purple-200 bg-purple-50'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              <UserX className="text-purple-500" size={20} />
              <h3 className={`font-semibold ${
                userPreferences.theme.isDark ? 'text-purple-200' : 'text-purple-800'
              }`}>
                Need Help?
              </h3>
            </div>
            <p className={`text-sm ${
              userPreferences.theme.isDark ? 'text-purple-200' : 'text-purple-700'
            }`}>
              If you're experiencing harassment, threats, or any safety concerns, please report immediately. 
              Our moderation team reviews all reports within 24 hours. For urgent safety issues, 
              contact local authorities.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}