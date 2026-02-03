import React, { useState } from 'react';
import { Link2, Download, Video, Music, Settings, Youtube, Instagram, AlertCircle, FileVideo, Check } from 'lucide-react';
import { Input } from './components/Input';
import { Select } from './components/Select';
import { ProgressBar } from './components/ProgressBar';
import { fetchVideoMetadata, simulateDownloadProcess } from './services/mockService';
import { Platform, FileFormat, VideoQuality, DownloadState, VideoMetadata } from './types';

function App() {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.YOUTUBE);
  const [format, setFormat] = useState<FileFormat>(FileFormat.MP4);
  const [quality, setQuality] = useState<VideoQuality>(VideoQuality.BEST);
  
  const [downloadState, setDownloadState] = useState<DownloadState>({
    isDownloading: false,
    progress: 0,
    status: 'idle'
  });
  
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);

  const validateUrl = (inputUrl: string, selectedPlatform: Platform): boolean => {
    if (!inputUrl) return false;
    try {
        const urlToCheck = inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`;
        const urlObj = new URL(urlToCheck);
        const hostname = urlObj.hostname.toLowerCase();
        
        if (selectedPlatform === Platform.YOUTUBE) {
            return hostname === 'youtube.com' || 
                   hostname === 'www.youtube.com' || 
                   hostname === 'm.youtube.com' || 
                   hostname === 'youtu.be' ||
                   hostname === 'www.youtu.be';
        }
        if (selectedPlatform === Platform.INSTAGRAM) {
            return hostname === 'instagram.com' || 
                   hostname === 'www.instagram.com';
        }
        return false;
    } catch (e) {
        return false;
    }
  };

  const handleDownload = async () => {
    if (downloadState.isDownloading) return;

    if (!validateUrl(url, platform)) {
      setDownloadState(prev => ({ ...prev, error: `Invalid ${platform} URL provided. Please check the format.` }));
      return;
    }

    setDownloadState({ isDownloading: true, progress: 0, status: 'fetching_info', error: undefined });
    setMetadata(null);

    try {
      // Step 1: Fetch Metadata (Simulated)
      const meta = await fetchVideoMetadata(url);
      setMetadata(meta);

      // Step 2: Start Download Process (Simulated)
      const downloadUrl = await simulateDownloadProcess((prog, stat) => {
        setDownloadState(prev => ({
          ...prev,
          progress: prog,
          status: stat
        }));
      });

      setDownloadState(prev => ({ ...prev, status: 'completed', downloadUrl }));
    } catch (err) {
      setDownloadState({
        isDownloading: false,
        progress: 0,
        status: 'error',
        error: (err as Error).message || "An unexpected error occurred."
      });
    }
  };

  const reset = () => {
    setDownloadState({ isDownloading: false, progress: 0, status: 'idle' });
    setMetadata(null);
    setUrl('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
      
      <main className="w-full max-w-2xl">
        
        {/* Header Section */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4 ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/5">
            <Download className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Stream<span className="text-blue-500">Saver</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Universal media downloader for your favorite platforms.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Decorative Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-6">
            
            {/* Input Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Select 
                  label="Platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  options={[
                    { label: 'YouTube', value: Platform.YOUTUBE },
                    { label: 'Instagram', value: Platform.INSTAGRAM },
                  ]}
                  disabled={downloadState.isDownloading}
                />
                 <Input 
                  label="Video URL"
                  placeholder={`Paste ${platform} link here...`}
                  icon={Link2}
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (downloadState.error) setDownloadState(prev => ({...prev, error: undefined}));
                  }}
                  error={downloadState.error}
                  disabled={downloadState.isDownloading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select 
                  label="File Format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as FileFormat)}
                  options={[
                    { label: 'MP4 (Video)', value: FileFormat.MP4 },
                    { label: 'MKV (High Quality)', value: FileFormat.MKV },
                    { label: 'MP3 (Audio Only)', value: FileFormat.MP3 },
                  ]}
                  disabled={downloadState.isDownloading}
                />
                <Select 
                  label="Quality"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as VideoQuality)}
                  options={Object.values(VideoQuality).map(v => ({ label: v, value: v }))}
                  disabled={downloadState.isDownloading}
                />
              </div>
            </div>

            {/* Action Area */}
            {downloadState.status === 'completed' ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center animate-in zoom-in duration-300">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 mb-2">
                      <Check className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Download Complete</h3>
                      <p className="text-slate-400 text-sm mt-1">Your file has been processed successfully.</p>
                    </div>
                    {metadata && (
                      <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg w-full max-w-sm border border-slate-700">
                        <img src={metadata.thumbnail} alt="Thumbnail" className="w-16 h-9 object-cover rounded" />
                        <div className="text-left overflow-hidden">
                          <p className="text-sm font-medium text-white truncate">{metadata.title}</p>
                          <p className="text-xs text-slate-400">{metadata.duration} • {format.toUpperCase()} • {quality}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Primary Action: Download Button */}
                    {downloadState.downloadUrl && (
                      <a 
                        href={downloadState.downloadUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full max-w-sm mt-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                      >
                        <Download size={20} />
                        Save Processed File
                      </a>
                    )}

                    {/* Secondary Action: Reset */}
                    <button 
                      onClick={reset}
                      className="px-6 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg font-medium transition-colors border border-transparent hover:border-slate-700"
                    >
                      Download Another
                    </button>
                 </div>
              </div>
            ) : (
              <div className="space-y-6">
                {downloadState.isDownloading && (
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    {metadata && (
                      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-700/50">
                         <img src={metadata.thumbnail} alt="Loading..." className="w-20 h-12 object-cover rounded bg-slate-700" />
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium text-white truncate">{metadata.title}</p>
                           <div className="flex gap-2 text-xs text-slate-400 mt-1">
                             <span className="flex items-center gap-1"><PlatformIcon platform={platform}/> {platform}</span>
                             <span>•</span>
                             <span>{quality}</span>
                           </div>
                         </div>
                      </div>
                    )}
                    <ProgressBar progress={downloadState.progress} status={downloadState.status} />
                  </div>
                )}

                {!downloadState.isDownloading && (
                  <button
                    onClick={handleDownload}
                    disabled={!url || downloadState.isDownloading}
                    className={`
                      w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3
                      transition-all duration-300 transform active:scale-[0.98]
                      ${!url || downloadState.isDownloading
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'
                      }
                    `}
                  >
                    <Download size={24} />
                    <span>Download Media</span>
                  </button>
                )}
              </div>
            )}
            
            {/* Footer / Requirements Note (Simulating the user request for reqs) */}
            <div className="pt-4 border-t border-slate-800/50 text-center">
              <div className="flex items-start justify-center gap-2 text-xs text-slate-500 max-w-md mx-auto">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <p>
                  This is a frontend demonstration. For actual downloads, a backend service running 
                  <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-400 mx-1">yt-dlp</code> 
                  and 
                  <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-400 mx-1">ffmpeg</code> 
                  is required.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

const PlatformIcon = ({ platform }: { platform: Platform }) => {
  if (platform === Platform.YOUTUBE) return <Youtube size={12} />;
  return <Instagram size={12} />;
};

export default App;