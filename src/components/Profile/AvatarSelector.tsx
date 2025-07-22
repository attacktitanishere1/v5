import React, { useState } from 'react';
import { X, Crown, Zap, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AvatarSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const avatars = [
  { id: 'avatar1', emoji: '😀', name: 'Happy' },
  { id: 'avatar2', emoji: '😎', name: 'Cool' },
  { id: 'avatar3', emoji: '🤔', name: 'Thinking' },
  { id: 'avatar4', emoji: '😊', name: 'Smiling' },
  { id: 'avatar5', emoji: '🥳', name: 'Party' },
  { id: 'avatar6', emoji: '😇', name: 'Angel' },
  { id: 'avatar7', emoji: '🤓', name: 'Nerd' },
  { id: 'avatar8', emoji: '😴', name: 'Sleepy' },
  { id: 'avatar9', emoji: '🤗', name: 'Hugging' },
  { id: 'avatar10', emoji: '😋', name: 'Yummy' },
  { id: 'avatar11', emoji: '🥰', name: 'Love' },
  { id: 'avatar12', emoji: '😂', name: 'Laughing' },
  { id: 'avatar13', emoji: '🤩', name: 'Star Eyes' },
  { id: 'avatar14', emoji: '😌', name: 'Peaceful' },
  { id: 'avatar15', emoji: '🙃', name: 'Upside Down' },
  { id: 'avatar16', emoji: '😏', name: 'Smirk' },
  { id: 'avatar17', emoji: '🤨', name: 'Raised Eyebrow' },
  { id: 'avatar18', emoji: '😆', name: 'Grinning' },
  { id: 'avatar19', emoji: '🥺', name: 'Pleading' },
  { id: 'avatar20', emoji: '😁', name: 'Beaming' },
];

const animatedAvatars = [
  { id: 'animated1', emoji: '👑', name: 'Royal Crown', minCredits: 1000 },
  { id: 'animated2', emoji: '⚡', name: 'Lightning', minCredits: 1000 },
  { id: 'animated3', emoji: '🔥', name: 'Fire', minCredits: 1000 },
  { id: 'animated4', emoji: '✨', name: 'Sparkles', minCredits: 1000 },
  { id: 'animated5', emoji: '💎', name: 'Diamond', minCredits: 1500 },
  { id: 'animated6', emoji: '🌟', name: 'Glowing Star', minCredits: 1500 },
  { id: 'animated7', emoji: '🦄', name: 'Unicorn', minCredits: 2000 },
  { id: 'animated8', emoji: '🐉', name: 'Dragon', minCredits: 2000 },
];

export default function AvatarSelector({ isOpen, onClose }: AvatarSelectorProps) {
  const { currentUser, updateUserAvatar, userPreferences } = useApp();
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar || 'avatar1');

  if (!isOpen || !currentUser) return null;

  const handleSaveAvatar = () => {
    updateUserAvatar(selectedAvatar);
    onClose();
  };

  const canUseAnimated = (minCredits: number) => {
    return currentUser.credits >= minCredits;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${
        userPreferences.theme.isDark ? 'bg-gray-800' : 'bg-white'
      } rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors duration-200`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
            Choose Your Avatar
          </h2>
          <button
            onClick={onClose}
            className={`${userPreferences.theme.isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Regular Avatars */}
        <div className="mb-8">
          <h3 className={`text-lg font-semibold mb-4 ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
            Regular Avatars
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  selectedAvatar === avatar.id
                    ? 'border-blue-500 bg-blue-50'
                    : userPreferences.theme.isDark
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
              >
                <div className="text-3xl mb-2">{avatar.emoji}</div>
                <div className={`text-xs ${userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {avatar.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Animated Avatars */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2 ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
            <Crown className="text-yellow-500" size={20} />
            <span>VIP Animated Avatars</span>
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {animatedAvatars.map((avatar) => {
              const canUse = canUseAnimated(avatar.minCredits);
              return (
                <button
                  key={avatar.id}
                  onClick={() => canUse && setSelectedAvatar(avatar.id)}
                  disabled={!canUse}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 relative ${
                    selectedAvatar === avatar.id
                      ? 'border-yellow-500 bg-yellow-50'
                      : canUse
                      ? userPreferences.theme.isDark
                        ? 'border-gray-600 hover:border-yellow-500 bg-gray-700 hover:scale-105'
                        : 'border-gray-300 hover:border-yellow-400 bg-white hover:scale-105'
                      : 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className={`text-3xl mb-2 ${canUse ? 'animate-pulse' : ''}`}>
                    {avatar.emoji}
                  </div>
                  <div className={`text-xs ${userPreferences.theme.isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {avatar.name}
                  </div>
                  {!canUse && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                      <div className="text-white text-xs text-center">
                        <Crown size={16} className="mx-auto mb-1" />
                        {avatar.minCredits} credits
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Credit Requirements Info */}
        <div className={`p-4 rounded-lg mb-6 ${
          userPreferences.theme.isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-50 text-yellow-800'
        }`}>
          <h4 className="font-semibold mb-2 flex items-center space-x-2">
            <Star size={16} />
            <span>VIP Avatar Benefits</span>
          </h4>
          <ul className="text-sm space-y-1">
            <li>• 1000+ credits: Animated avatars with glowing effects</li>
            <li>• 1500+ credits: Premium animated avatars</li>
            <li>• 2000+ credits: Exclusive legendary avatars + verified badge</li>
          </ul>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleSaveAvatar}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Save Avatar
          </button>
          <button
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
      </div>
    </div>
  );
}