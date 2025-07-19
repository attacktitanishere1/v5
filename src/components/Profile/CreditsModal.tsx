import React, { useState } from 'react';
import { X, Play, UserPlus, Gift, Coins, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreditsModal({ isOpen, onClose }: CreditsModalProps) {
  const { currentUser, updateCredits, userPreferences, generateReferralLink } = useApp();
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adProgress, setAdProgress] = useState(0);

  if (!isOpen || !currentUser) return null;

  const watchAd = () => {
    setIsWatchingAd(true);
    setAdProgress(0);
    
    // Simulate ad watching
    const interval = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsWatchingAd(false);
          updateCredits(25);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleInviteFriend = () => {
    const link = generateReferralLink();
    if (navigator.share) {
      navigator.share({
        title: 'Join AnonChat',
        text: 'Join me on AnonChat and get 100 free credits!',
        url: link,
      });
    } else {
      navigator.clipboard.writeText(link);
      alert('Referral link copied to clipboard!');
    }
    onClose();
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
            <Coins className="text-yellow-500" size={24} />
            <span>Earn Credits</span>
          </h2>
          <button
            onClick={onClose}
            className={`${userPreferences.theme.isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Current Credits */}
        <div className={`p-4 rounded-lg mb-6 text-center ${
          userPreferences.theme.isDark ? 'bg-yellow-900 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className={`text-2xl font-bold ${
            userPreferences.theme.isDark ? 'text-yellow-200' : 'text-yellow-800'
          }`}>
            {currentUser.credits} Credits
          </div>
          <p className={`text-sm ${
            userPreferences.theme.isDark ? 'text-yellow-300' : 'text-yellow-700'
          }`}>
            Your current balance
          </p>
        </div>

        {/* Earning Options */}
        <div className="space-y-4">
          {/* Watch Ad */}
          <div className={`p-4 rounded-lg border ${
            userPreferences.theme.isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Play className="text-green-500" size={20} />
                <div>
                  <h3 className={`font-medium ${
                    userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Watch Advertisement
                  </h3>
                  <p className={`text-sm ${
                    userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Watch a 30-second ad
                  </p>
                </div>
              </div>
              <span className="text-green-500 font-bold">+25</span>
            </div>
            
            {isWatchingAd ? (
              <div className="space-y-2">
                <div className={`w-full bg-gray-200 rounded-full h-2 ${
                  userPreferences.theme.isDark ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${adProgress}%` }}
                  />
                </div>
                <p className={`text-sm text-center ${
                  userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {adProgress < 100 ? `Watching ad... ${Math.floor(adProgress)}%` : 'Credits earned! 🎉'}
                </p>
              </div>
            ) : (
              <button
                onClick={watchAd}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Watch Ad
              </button>
            )}
          </div>

          {/* Invite Friends */}
          <div className={`p-4 rounded-lg border ${
            userPreferences.theme.isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <UserPlus className="text-blue-500" size={20} />
                <div>
                  <h3 className={`font-medium ${
                    userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Invite Friends
                  </h3>
                  <p className={`text-sm ${
                    userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Share your referral link
                  </p>
                </div>
              </div>
              <span className="text-blue-500 font-bold">+250</span>
            </div>
            
            <button
              onClick={handleInviteFriend}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Send Invite
            </button>
          </div>

          {/* Daily Login */}
          <div className={`p-4 rounded-lg border ${
            userPreferences.theme.isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Clock className="text-purple-500" size={20} />
                <div>
                  <h3 className={`font-medium ${
                    userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Daily Login Bonus
                  </h3>
                  <p className={`text-sm ${
                    userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Already claimed today
                  </p>
                </div>
              </div>
              <span className="text-purple-500 font-bold">+10</span>
            </div>
            
            <button
              disabled
              className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed"
            >
              Come Back Tomorrow
            </button>
          </div>
        </div>

        {/* Info */}
        <div className={`mt-6 p-3 rounded-lg ${
          userPreferences.theme.isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-800'
        }`}>
          <p className="text-sm">
            💡 Credits are used to send messages in private chats and rooms. Earn more by watching ads or inviting friends!
          </p>
        </div>
      </div>
    </div>
  );
}