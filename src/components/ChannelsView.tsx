import React, { useState } from 'react';
import { Channel } from '../types';
import { Check, Plus, Radio, Search, ShieldCheck } from 'lucide-react';

interface ChannelsViewProps {
  channels: Channel[];
  onToggleFollow: (channelId: string) => void;
  isDarkMode: boolean;
}

export const ChannelsView: React.FC<ChannelsViewProps> = ({
  channels,
  onToggleFollow,
  isDarkMode,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(channels[0] || null);

  return (
    <div className={`flex-1 flex flex-col md:flex-row h-full ${
      isDarkMode ? 'bg-[#111b21] text-gray-100' : 'bg-white text-gray-800'
    }`}>
      {/* Left Channel List */}
      <div className={`w-full md:w-80 border-l border-gray-500/10 flex flex-col h-full ${
        isDarkMode ? 'bg-[#111b21]' : 'bg-white'
      }`}>
        <div className="p-4 border-b border-gray-500/10">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-500" />
            <span>قنوات واتساب (Channels)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            تابع مستجدات الأخبار والتكنولوجيا والرياضة من مصدرها
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-500/10 custom-scrollbar">
          {channels.map((ch) => {
            const isSelected = selectedChannel?.id === ch.id;
            return (
              <div
                key={ch.id}
                onClick={() => setSelectedChannel(ch)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                  isSelected
                    ? isDarkMode
                      ? 'bg-[#202c33]'
                      : 'bg-[#f0f2f5]'
                    : isDarkMode
                    ? 'hover:bg-[#182229]'
                    : 'hover:bg-[#f5f6f8]'
                }`}
              >
                <img
                  src={ch.avatar}
                  alt={ch.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold text-sm truncate">{ch.name}</h3>
                    {ch.verified && <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{ch.lastUpdate}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Channel Details View */}
      <div className={`flex-1 flex flex-col h-full ${
        isDarkMode ? 'bg-[#0b141a]' : 'bg-[#efeae2]'
      }`}>
        {selectedChannel ? (
          <div className="flex-1 flex flex-col h-full">
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between shadow-sm ${
              isDarkMode ? 'bg-[#202c33] border-gray-800' : 'bg-[#f0f2f5] border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <img
                  src={selectedChannel.avatar}
                  alt={selectedChannel.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-bold text-base flex items-center gap-1.5">
                    <span>{selectedChannel.name}</span>
                    {selectedChannel.verified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                  </h2>
                  <p className="text-xs text-gray-400">{selectedChannel.followersCount}</p>
                </div>
              </div>

              <button
                onClick={() => onToggleFollow(selectedChannel.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow ${
                  selectedChannel.isFollowing
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {selectedChannel.isFollowing ? 'تتابعها' : 'متابعة القناة'}
              </button>
            </div>

            {/* Posts / Updates List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <div className={`max-w-xl mx-auto rounded-2xl p-5 shadow border ${
                isDarkMode ? 'bg-[#202c33] border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={selectedChannel.avatar}
                    alt={selectedChannel.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm">{selectedChannel.name}</h4>
                    <p className="text-[11px] text-gray-400">منذ ساعتين</p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-3">
                  {selectedChannel.lastUpdate}
                </p>

                <p className="text-xs text-gray-400 leading-relaxed border-t pt-3 border-gray-500/10">
                  {selectedChannel.description}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            اختر قناة لعرض آخر المستجدات والتحديثات
          </div>
        )}
      </div>
    </div>
  );
};
