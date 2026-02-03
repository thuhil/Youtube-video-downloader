import { VideoMetadata } from '../types';

// This service mocks the backend behavior since we are running in a client-side environment.
// In a real application, this would communicate with a Python/Flask/FastAPI backend running yt-dlp.

export const fetchVideoMetadata = async (url: string): Promise<VideoMetadata> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        resolve({
          title: "Sample YouTube Video - Amazing Content",
          thumbnail: "https://picsum.photos/seed/yt/640/360",
          duration: "10:25",
        });
      } else if (url.includes('instagram.com')) {
        resolve({
          title: "Instagram Reel #Trending",
          thumbnail: "https://picsum.photos/seed/insta/640/640",
          duration: "00:45",
        });
      } else {
        reject(new Error("Invalid URL or unsupported platform"));
      }
    }, 1500);
  });
};

export const simulateDownloadProcess = (
  onProgress: (progress: number, status: string) => void
): Promise<string> => {
  return new Promise((resolve) => {
    let progress = 0;
    
    onProgress(0, 'fetching_info');

    const interval = setInterval(() => {
      progress += Math.random() * 5;
      
      if (progress < 20) {
         onProgress(progress, 'fetching_info');
      } else if (progress < 80) {
         onProgress(progress, 'downloading');
      } else if (progress < 95) {
         onProgress(progress, 'converting');
      } else {
        progress = 100;
        onProgress(100, 'completed');
        clearInterval(interval);
        resolve("https://example.com/download/video_file.mp4");
      }
    }, 200);
  });
};