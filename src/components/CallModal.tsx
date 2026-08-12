import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, Users } from 'lucide-react';
import { ActiveCall } from '../types';
import { startRingtoneSound, stopRingtoneSound } from '../utils/soundEffects';

interface CallModalProps {
  call: ActiveCall;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  call,
  onEndCall,
  onToggleMute,
  onToggleVideo,
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    startRingtoneSound();
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      stopRingtoneSound();
    };
  }, []);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-lg select-none">
      <div className="bg-[#111b21] border border-gray-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Animated Background Ring */}
        <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl animate-pulse pointer-events-none" />

        {/* Contact Avatar & Info */}
        <div className="relative space-y-3">
          <div className="relative inline-block">
            <img
              src={call.contact.avatar}
              alt={call.contact.name}
              className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-emerald-500/50 shadow-xl"
            />
            <span className="absolute bottom-1 right-1 bg-emerald-500 p-2 rounded-full text-white shadow">
              {call.type === 'video' ? <Video className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </span>
          </div>

          <h2 className="text-xl font-bold text-white">{call.contact.name}</h2>
          <p className="text-emerald-400 font-mono text-sm">
            {seconds < 3 ? 'جاري الاتصال...' : formatDuration(seconds)}
          </p>
        </div>

        {/* Video Preview Simulation if Video Call */}
        {call.type === 'video' && (
          <div className="w-full h-44 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center relative overflow-hidden">
            {!call.isVideoOff ? (
              <img
                src={call.contact.avatar}
                alt="Video stream"
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <p className="text-xs text-gray-500">الكاميرا متوقفة</p>
            )}
          </div>
        )}

        {/* Call Actions Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={onToggleMute}
            className={`p-4 rounded-full transition-all active:scale-95 shadow ${
              call.isMuted ? 'bg-rose-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
            }`}
            title={call.isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
          >
            {call.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {call.type === 'video' && (
            <button
              onClick={onToggleVideo}
              className={`p-4 rounded-full transition-all active:scale-95 shadow ${
                call.isVideoOff ? 'bg-rose-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
              }`}
              title={call.isVideoOff ? 'تشغيل الكاميرا' : 'إيقاف الكاميرا'}
            >
              {call.isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={() => {
              stopRingtoneSound();
              onEndCall();
            }}
            className="p-4 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-all active:scale-95 shadow-xl"
            title="إنهاء المكالمة"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
