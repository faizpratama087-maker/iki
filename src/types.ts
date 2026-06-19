/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Coupon {
  id: string;
  title: string;
  description: string;
  emoji: string;
  isUsed: boolean;
  usedAt?: string;
  costDescription: string;
}

export interface AgreementRule {
  id: string;
  text: string;
  category: 'komunikasi' | 'kuliner' | 'emosi' | 'lainnya';
}

export interface LoveMilestone {
  id: string;
  title: string;
  date: string;
  description: string;
  category: 'kencan' | 'jadian' | 'pencapaian' | 'lainnya';
  loveRating: number; // 1-5 hearts
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    score: number;
    feedback: string;
  }[];
}

export interface ActiveSong {
  id: string;
  title: string;
  artist: string;
  duration: string;
}
