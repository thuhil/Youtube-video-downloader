export enum Platform {
  YOUTUBE = 'YouTube',
  INSTAGRAM = 'Instagram',
}

export enum FileFormat {
  MP4 = 'mp4',
  MKV = 'mkv',
  MP3 = 'mp3',
}

export enum VideoQuality {
  BEST = 'Best Available',
  P1080 = '1080p',
  P720 = '720p',
  P480 = '480p',
  WORST = 'Worst/Low Data',
}

export type DownloadStatus = 'idle' | 'fetching_info' | 'downloading' | 'converting' | 'completed' | 'error';

export interface DownloadState {
  isDownloading: boolean;
  progress: number;
  status: DownloadStatus;
  error?: string;
  downloadUrl?: string;
}

export interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration: string;
}