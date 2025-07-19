import React, { useState } from 'react';
import { Compass, TrendingUp, Users, Star, Globe, Zap, Crown, Gift } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DiscoverItem {
  id: string;
  type: 'room' | 'user' | 'confession' | 'event';
  title: string;
  description: string;
  image?: string;
  stats: {
    members?: number;
    likes?: number;
    comments?: number;
    credits?: number;
  };
  badge?: string;
  trending?: boolean;
}

export default function Discover() {
  const { userPreferences } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'trending' | 'popular' | 'new'>('all');

  const discoverItems: DiscoverItem[] = [
    {
      id: '1',
      type: 'room',
      title: 'Midnight Confessions',
      description: 'Share your deepest thoughts when the world sleeps',
      stats: { members: 1247 },
      badge: 'Hot',
      trending: true,
    },
    {
      id: '2',
      type: 'user',
      title: 'MysteriousPoet',
      description: 'Known for beautiful confession poetry',
      stats: { credits: 2500 },
      badge: 'VIP Elite',
    },
    {
      id: '3',
      type: 'confession',
      title: 'The Day I Changed Everything',
      description: 'A life-changing decision that inspired thousands',
      stats: { likes: 892, comments: 156 },
      trending: true,
    },
    {
      id: '4',
      type: 'event',
      title: 'Weekly Confession Contest',
      description: 'Win 500 credits for the most inspiring confession',
      stats: { credits: 500 },
      badge: 'Event',
    },
  ];

  const filters = [
    { id: 'all', label: 'All', icon: Compass },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'popular', label: 'Popular', icon: Star },
    { id: 'new', label: 'New', icon: Zap },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'room':
        return <Users size={20} className="text-blue-500" />;
      case 'user':
        return <Crown size={20} className="text-yellow-500" />;
      case 'confession':
        return <Star size={20} className="text-purple-500" />;
      case 'event':
        return <Gift size={20} className="text-green-500" />;
      default:
        return <Globe size={20} className="text-gray-500" />;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Hot':
        return 'bg-red-100 text-red-800';
      case 'VIP Elite':
        return 'bg-yellow-100 text-yellow-800';
      case 'Event':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredItems = discoverItems.filter(item => {
    switch (activeFilter) {
      case 'trending':
        return item.trending;
      case 'popular':
        return (item.stats.likes || 0) > 100 || (item.stats.members || 0) > 500;
      case 'new':
        return !item.trending && !item.badge;
      default:
        return true;
    }
  });

  return (
    <div className={`h-full ${userPreferences.theme.isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Header */}
      <div className={`${userPreferences.theme.isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4`}>
        <div className="flex items-center space-x-3 mb-4">
          <Compass size={24} className="text-blue-500" />
          <h2 className={`text-xl font-bold ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
            Discover
          </h2>
        </div>
        <p className={`text-sm ${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Explore trending rooms, popular users, and amazing confessions
        </p>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mt-4 overflow-x-auto">
          {filters.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveFilter(id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeFilter === id
                  ? 'bg-blue-600 text-white'
                  : userPreferences.theme.isDark
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Discover Items */}
      <div className="overflow-y-auto h-full pb-20">
        <div className="space-y-4 p-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`${
                userPreferences.theme.isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border rounded-lg p-4 transition-all duration-200 hover:shadow-lg cursor-pointer transform hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    item.type === 'room' ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                    item.type === 'user' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    item.type === 'confession' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                    'bg-gradient-to-r from-green-500 to-blue-500'
                  } text-white`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-bold ${userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'}`}>
                        {item.title}
                      </h3>
                      {item.trending && (
                        <TrendingUp size={16} className="text-red-500" />
                      )}
                      {item.badge && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(item.badge)}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm">
                {item.stats.members && (
                  <div className="flex items-center space-x-1">
                    <Users size={14} />
                    <span className={userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {item.stats.members.toLocaleString()} members
                    </span>
                  </div>
                )}
                {item.stats.likes && (
                  <div className="flex items-center space-x-1">
                    <Star size={14} />
                    <span className={userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {item.stats.likes} likes
                    </span>
                  </div>
                )}
                {item.stats.comments && (
                  <div className="flex items-center space-x-1">
                    <Users size={14} />
                    <span className={userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {item.stats.comments} comments
                    </span>
                  </div>
                )}
                {item.stats.credits && (
                  <div className="flex items-center space-x-1">
                    <Gift size={14} />
                    <span className="text-yellow-500 font-medium">
                      {item.stats.credits} credits
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}