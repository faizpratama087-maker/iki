export type ViewType = 'home' | 'tools' | 'faq';

export interface VideoStats {
  totalProcessedCount: number;
  totalSavedStorageGB: number;
  averageProcessingTimeSec: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface VideoClipParams {
  startTime: number; // in seconds
  endTime: number; // in seconds
  quality: '720p' | '1080p';
  outputFormat: 'mp4' | 'webm' | 'mkv';
  volume: number; // 0 to 100
  keepAudio: boolean;
  watermark: boolean; // Must always support false (No Watermark)
}
