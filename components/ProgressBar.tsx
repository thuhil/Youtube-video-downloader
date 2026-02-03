import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  status: string;
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'fetching_info': return 'Fetching metadata...';
    case 'downloading': return 'Downloading media stream...';
    case 'converting': return 'Processing with FFmpeg...';
    case 'completed': return 'Download ready!';
    default: return 'Processing...';
  }
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status }) => {
  return (
    <div className="w-full space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2 text-blue-200">
          {status === 'completed' ? (
            <CheckCircle2 size={16} className="text-green-400" />
          ) : (
            <Loader2 size={16} className="animate-spin text-blue-400" />
          )}
          <span className="font-medium">{getStatusText(status)}</span>
        </div>
        <span className="font-bold text-slate-300">{Math.round(progress)}%</span>
      </div>
      
      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
        <div 
          className={`h-full transition-all duration-300 ease-out rounded-full ${
            status === 'completed' 
              ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
              : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'
          }`}
          style={{ width: `${progress}%` }}
        >
          {/* Animated shine effect */}
          <div className="w-full h-full bg-white/20 animate-[shimmer_2s_infinite] skew-x-12 translate-x-[-100%]" />
        </div>
      </div>
    </div>
  );
};