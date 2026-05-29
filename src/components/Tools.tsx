import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Scissors, Play, Pause, RefreshCw, Volume2, VolumeX, 
  Download, Film, Sparkles, Youtube, CheckCircle2, ChevronRight, AlertCircle, AlertTriangle 
} from 'lucide-react';
import { VideoClipParams } from '../types';

export default function Tools() {
  // Video Source state
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);

  // States
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [successClip, setSuccessClip] = useState<{ url: string; size: number } | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Audio & resolution parameters
  const [clipParams, setClipParams] = useState<VideoClipParams>({
    startTime: 0,
    endTime: 10,
    quality: '1080p',
    outputFormat: 'mp4',
    volume: 100,
    keepAudio: true,
    watermark: false
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Quick Demo Streams
  const SampleStreams = [
    { name: 'Forest Torrent MP4', url: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4' },
    { name: 'Night Lake MP4', url: 'https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-over-a-calm-lake-43093-large.mp4' }
  ];

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setErrorMessage(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  // Upload video via Express API
  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setErrorMessage('Please select a valid video file (MP4, WebM, etc.)');
      return;
    }
    
    setErrorMessage(null);
    setIsUploading(true);
    setProgress(15);

    const formData = new FormData();
    formData.append('video', file);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 80 ? prev + Math.floor(Math.random() * 8) + 3 : prev));
    }, 250);

    fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
      .then((res) => {
        clearInterval(interval);
        if (!res.ok) throw new Error('Failed to upload video file to backend.');
        return res.json();
      })
      .then((data) => {
        setProgress(100);
        setTimeout(() => {
          setVideoUrl(data.path);
          setFilename(data.filename);
          setOriginalName(data.originalName);
          setFileSize(data.size);
          setIsUploading(false);
          setSuccessClip(null);
        }, 300);
      })
      .catch((err) => {
        clearInterval(interval);
        setIsUploading(false);
        setErrorMessage(err.message || 'Trouble uploading video. Please check your file format.');
      });
  };

  // Paste Link automatic importer
  const handleUrlImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;

    setErrorMessage(null);
    setIsImporting(true);
    setProgress(20);

    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + Math.floor(Math.random() * 5) + 2 : prev));
    }, 400);

    fetch('/api/import-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: youtubeUrl })
    })
      .then((res) => {
        clearInterval(progressTimer);
        if (!res.ok) throw new Error('Error importing streaming URL on server.');
        return res.json();
      })
      .then((data) => {
        setProgress(100);
        setTimeout(() => {
          setVideoUrl(data.path);
          setFilename(data.filename);
          setOriginalName(data.originalName);
          setFileSize(data.size);
          setIsImporting(false);
          setSuccessClip(null);
          setYoutubeUrl('');
          if (data.note) {
            setErrorMessage(`✨ Info: ${data.note}`);
          }
        }, 400);
      })
      .catch((err) => {
        clearInterval(progressTimer);
        setIsImporting(false);
        setErrorMessage('Failed to decode link. Make sure the media link is accessible or use a direct MP4 link.');
      });
  };

  // Quick select a demo video
  const loadDemo = (sampleUrl: string, sampleName: string) => {
    setYoutubeUrl(sampleUrl);
    setErrorMessage(null);
  };

  // Handle local video metadata load
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const vidDur = videoRef.current.duration;
      setDuration(vidDur);
      setClipParams((prev) => ({
        ...prev,
        startTime: 0,
        endTime: vidDur > 15 ? 15 : vidDur
      }));
    }
  };

  // Track playback time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      // Loop the preview exactly in the trim range
      if (time >= clipParams.endTime) {
        videoRef.current.currentTime = clipParams.startTime;
      }
    }
  };

  // Synchronise range slider updates
  const handleStartChange = (val: number) => {
    const safeStart = Math.min(Math.max(0, val), clipParams.endTime - 0.2);
    setClipParams(prev => ({ ...prev, startTime: safeStart }));
    if (videoRef.current) {
      videoRef.current.currentTime = safeStart;
    }
  };

  const handleEndChange = (val: number) => {
    const safeEnd = Math.max(Math.min(val, duration), clipParams.startTime + 0.2);
    setClipParams(prev => ({ ...prev, endTime: safeEnd }));
    if (videoRef.current && currentTime > safeEnd) {
      videoRef.current.currentTime = clipParams.startTime;
    }
  };

  // Instant play/pause selectors
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Format Helper bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Video clipping dispatcher
  const processClip = () => {
    if (!filename) return;

    setErrorMessage(null);
    setIsProcessing(true);
    setProgress(5);
    setSuccessClip(null);

    // Simulate standard transcode progress based on duration
    const clipLen = clipParams.endTime - clipParams.startTime;
    const ticks = Math.round(clipLen * 5); // Longer clips simulate longer rendering
    let simulatedProgress = 5;

    const renderTimer = setInterval(() => {
      simulatedProgress += Math.max(1, Math.floor(100 / (ticks + 3)));
      if (simulatedProgress > 95) simulatedProgress = 95;
      setProgress(simulatedProgress);
    }, 180);

    fetch('/api/clip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename,
        startTime: clipParams.startTime,
        endTime: clipParams.endTime,
        quality: clipParams.quality,
        outputFormat: clipParams.outputFormat,
        volume: clipParams.volume,
        keepAudio: clipParams.keepAudio
      })
    })
      .then((res) => {
        clearInterval(renderTimer);
        if (!res.ok) throw new Error('FFmpeg processing timeout or error.');
        return res.json();
      })
      .then((data) => {
        setProgress(100);
        setTimeout(() => {
          setIsProcessing(false);
          setSuccessClip({
            url: data.downloadUrl,
            size: data.sizeBytes || 1024 * 1024 * 3
          });
        }, 400);
      })
      .catch((err) => {
        clearInterval(renderTimer);
        setIsProcessing(false);
        setErrorMessage(err.message || 'Error processing video clipping. Make sure parameters are valid.');
      });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12" id="tools-container">
      {/* Visual Header */}
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-black tracking-tight text-white flex items-center justify-center sm:justify-start gap-2.5">
          <Film className="h-7 w-7 text-blue-500 animate-pulse" />
          <span>HD Clipping Room</span>
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Upload any MP4 file or paste public URL streams. Select boundaries with millisecond precision.
        </p>
      </div>

      {/* Progress indicators */}
      {(isUploading || isImporting || isProcessing) && (
        <div className="mb-8 rounded-2xl border border-blue-900/55 bg-gradient-to-r from-blue-950/40 to-black p-6 shadow-xl relative overflow-hidden animate-pulse">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-300" />
          <div className="flex items-center justify-between font-mono text-xs text-blue-400 mb-3">
            <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold">
              <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />
              {isUploading && 'Uploading high-definition media...'}
              {isImporting && 'Downloading streaming video payload...'}
              {isProcessing && 'Extracting sub-frame clusters with static FFmpeg...'}
            </span>
            <span className="text-sm font-bold">{Math.round(progress)}%</span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-blue-950/80 overflow-hidden p-0.5 border border-blue-900/30">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-300 shadow-md shadow-blue-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2.5 text-[11px] text-gray-400 text-center">
            {isProcessing 
              ? 'Our static FFmpeg core is transcoding in 1-pass ultrafast mode. No quality drops, no watermark added.' 
              : 'Streaming segment packet headers to backend container storage...'
            }
          </p>
        </div>
      )}

      {/* Notification Toast */}
      {errorMessage && (
        <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 text-sm ${
          errorMessage.includes('✨') 
            ? 'bg-blue-950/30 border-blue-800 text-blue-200' 
            : 'bg-red-950/20 border-red-900 text-red-300'
        }`} id="alarm-toast">
          {errorMessage.includes('✨') ? (
            <Sparkles className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* SUCCESS NOTIFICATION */}
      {successClip && (
        <div className="mb-8 rounded-2xl border-2 border-green-800 bg-gradient-to-r from-green-950/30 via-zinc-950/90 to-black p-6 shadow-2xl relative overflow-hidden" id="success-export-box">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <CheckCircle2 className="h-32 w-32 text-green-500" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-950/75 border border-green-700/60 text-green-400 shrink-0">
                <CheckCircle2 className="h-6 w-6 animate-bounce" />
              </div>
              <div>
                <span className="inline-flex items-center rounded-full bg-green-950/50 px-2.5 py-0.5 text-xs font-semibold text-green-400 border border-green-800/40 mb-1.5 font-mono">
                  RENDERED SUCCESS
                </span>
                <h3 className="text-xl font-black tracking-tight text-white">Clip Processed Dynamically!</h3>
                <p className="text-xs text-gray-300 mt-1 font-mono">
                  Saved Clip Scale: <span className="text-green-400 font-bold">{clipParams.quality}</span> • Size: <span className="text-green-400">{formatBytes(successClip.size)}</span>
                </p>
                <div className="mt-2 text-[11px] text-gray-400 bg-gray-900/50 px-2.5 py-1 rounded border border-gray-800 inline-block">
                  🛡️ Complete download inside 5 minutes. Autoclean sweeps directory.
                </div>
              </div>
            </div>

            <a
              href={successClip.url}
              download={successClip.url.split('/').pop()}
              id="raw-download-button"
              className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4.5 text-md font-extrabold text-white shadow-lg shadow-green-500/20 transition duration-300 hover:scale-[1.03] hover:from-green-500 hover:to-emerald-500"
            >
              <Download className="h-5 w-5" />
              <span>Download Raw HD Clip</span>
            </a>
          </div>
        </div>
      )}

      {/* Dynamic Uploader Mode UI */}
      {!videoUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="uploader-deck">
          {/* Main Drag-Drop */}
          <div className="lg:col-span-7">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative flex min-h-[380px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-400 bg-blue-950/20 shadow-blue-500/10 shadow-2xl scale-[1.01]' 
                  : 'border-zinc-800 bg-zinc-950/40 hover:border-blue-900 hover:bg-zinc-950/80 hover:shadow-xl hover:shadow-blue-500/[0.02]'
              }`}
              id="dragzone"
            >
              {/* Hot Glow behind upload icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-blue-500/5 blur-xl group-hover:bg-blue-600/10 transition-colors pointer-events-none" />

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-gray-400 group-hover:scale-110 group-hover:border-blue-500 group-hover:text-blue-400 transition-all duration-300">
                <Upload className="h-6 w-6" />
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">Drag & Drop Video Here</h3>
              <p className="mt-2 text-xs text-gray-400 max-w-sm leading-relaxed">
                Accepts MP4, MKV, WebM, and general video formats. Max filesize <span className="text-gray-200 font-bold font-mono">100MB</span> for optimal rapid transcode streams.
              </p>

              <div className="mt-6 rounded-lg bg-blue-950/30 px-4.5 py-2 text-xs font-semibold text-blue-400 border border-blue-900/40">
                Or Browse Device Files
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                className="hidden"
                id="hidden-file-input"
              />
            </div>
          </div>

          {/* Quick Paste URL Mode */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-zinc-900 bg-zinc-950/40 p-6 md:p-8" id="link-importer-box">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950/50 border border-blue-900/40 mb-5 text-blue-400">
                <Youtube className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Paste External Media Links</h3>
              <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
                Paste any direct <span className="text-gray-200">Video MP4 URL</span> or dynamic platform link (TikTok or YouTube metadata fallback). Our backend automatically converts and streams the video.
              </p>

              <form onSubmit={handleUrlImport} className="mt-6">
                <input
                  type="url"
                  placeholder="https://example.com/stream-source.mp4"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-black py-3.5 px-4 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                  id="link-import-input"
                />

                <button
                  type="submit"
                  disabled={!youtubeUrl}
                  id="link-import-submit"
                  className="mt-3.5 flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow shadow-blue-500/10 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Import Stream Video</span>
                </button>
              </form>
            </div>

            {/* Quick Demonstration Links */}
            <div className="mt-8 border-t border-zinc-900 pt-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 font-mono">
                🚀 Instant Test Streams:
              </span>
              <div className="mt-3.5 space-y-2.5">
                {SampleStreams.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => loadDemo(sample.url, sample.name)}
                    className="flex w-full items-center justify-between rounded-lg border border-zinc-900 bg-zinc-950/80 px-4 py-2 text-xs text-gray-400 hover:bg-zinc-900 hover:text-white transition duration-200 text-left"
                  >
                    <span className="truncate font-medium">{sample.name}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Loaded - Clipping Console */}
      {videoUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="clipping-deck">
          {/* Left Player + Range controller */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-3xl border border-zinc-900 bg-black overflow-hidden shadow-2xl" id="player-enclosure">
              <video
                ref={videoRef}
                src={videoUrl}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                className="w-full aspect-video rounded-3xl bg-black cursor-pointer object-contain"
                preload="auto"
                id="preview-video-tag"
              />

              {/* Status Header Indicator */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur border border-blue-900/40 text-[10px] text-blue-400 uppercase tracking-widest font-mono font-medium py-1 px-3.5 rounded-full select-none">
                Preview Looping Enabled
              </div>
            </div>

            {/* Micro playback controls */}
            <div className="flex items-center justify-between rounded-2xl bg-zinc-950 p-4 border border-zinc-900">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-950 text-blue-400 hover:bg-blue-900/60 transition duration-200"
                  id="playback-play-toggle"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </button>
                <div className="font-mono text-xs text-gray-400">
                  <span className="text-white font-semibold">{currentTime.toFixed(2)}s</span>
                  <span className="mx-1 text-zinc-700">/</span>
                  <span>{duration.toFixed(2)}s</span>
                </div>
              </div>

              {/* Quick Set buttons to lock slider exact values */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStartChange(currentTime)}
                  className="px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:text-white text-[10px] uppercase font-bold tracking-wider text-gray-400 transition"
                  id="lock-start-btn"
                >
                  Set Start [{currentTime.toFixed(1)}s]
                </button>
                <button
                  type="button"
                  onClick={() => handleEndChange(currentTime)}
                  className="px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:text-white text-[10px] uppercase font-bold tracking-wider text-gray-400 transition"
                  id="lock-end-btn"
                >
                  Set End [{currentTime.toFixed(1)}s]
                </button>
              </div>
            </div>

            {/* TIMELINE RANGE CONTROLS */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 space-y-6" id="timeline-controls-box">
              <span className="text-xs uppercase tracking-widest text-blue-400 font-mono font-bold block mb-1">
                Timeline Boundaries
              </span>

              {/* Custom Dual Sliders represented cleanly for mobile/desktop precision */}
              <div className="space-y-4">
                {/* Start Slider */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span className="flex items-center gap-1">🎬 Segment starts at:</span>
                    <span className="text-white font-mono font-medium">{clipParams.startTime.toFixed(2)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={clipParams.startTime}
                    onChange={(e) => handleStartChange(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer h-1.5 bg-zinc-900 rounded-lg"
                    id="startTime-slider"
                  />
                </div>

                {/* End Slider */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span className="flex items-center gap-1">🏁 Segment ends at:</span>
                    <span className="text-white font-mono font-medium">{clipParams.endTime.toFixed(2)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={clipParams.endTime}
                    onChange={(e) => handleEndChange(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-900 rounded-lg"
                    id="endTime-slider"
                  />
                </div>
              </div>

              {/* Manual numeric Millisecond Precision inputs */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">Start (Seconds)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={clipParams.endTime - 0.1}
                    value={parseFloat(clipParams.startTime.toFixed(2))}
                    onChange={(e) => handleStartChange(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-zinc-800 bg-black py-2.5 px-3.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    id="start-numeric-input"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">End (Seconds)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={clipParams.startTime + 0.1}
                    max={duration}
                    value={parseFloat(clipParams.endTime.toFixed(2))}
                    onChange={(e) => handleEndChange(parseFloat(e.target.value) || 10)}
                    className="w-full rounded-xl border border-zinc-800 bg-black py-2.5 px-3.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    id="end-numeric-input"
                  />
                </div>
              </div>

              {/* Selected Clip summary line */}
              <div className="text-xs text-gray-400 italic flex items-center justify-between border-t border-zinc-900 pt-4 font-mono">
                <span>Selected video slice:</span>
                <span className="text-blue-400 font-bold">{(clipParams.endTime - clipParams.startTime).toFixed(2)}s total duration</span>
              </div>
            </div>
          </div>

          {/* Right Parameters panel + Trim trigger btn */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 space-y-6" id="specifications-panel">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Scissors className="h-4.5 w-4.5 text-blue-500" />
                <span>Format & Compression</span>
              </h3>

              {/* Target Quality / Bitrate presets */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">HD Quality Presets</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setClipParams(p => ({ ...p, quality: '720p' }))}
                    className={`rounded-xl border p-3 text-center transition ${
                      clipParams.quality === '720p'
                        ? 'border-blue-500 bg-blue-950/25 text-white shadow-inner shadow-blue-500/10'
                        : 'border-zinc-800 bg-zinc-900/40 text-gray-400 hover:border-zinc-700 hover:text-white'
                    }`}
                    id="preset-720p"
                  >
                    <span className="block font-bold">720p HD</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">High Speed Rendering</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setClipParams(p => ({ ...p, quality: '1080p' }))}
                    className={`rounded-xl border p-3 text-center transition ${
                      clipParams.quality === '1080p'
                        ? 'border-blue-500 bg-blue-950/25 text-white shadow-inner shadow-blue-500/10'
                        : 'border-zinc-800 bg-zinc-900/40 text-gray-400 hover:border-zinc-700 hover:text-white'
                    }`}
                    id="preset-1080p"
                  >
                    <span className="block font-bold">1080p Full HD</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">Lossless Visual Presets</span>
                  </button>
                </div>
              </div>

              {/* Format Conversions */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Output Codec Containers</label>
                <div className="grid grid-cols-3 gap-2">
                  {['mp4', 'webm', 'mkv'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setClipParams(p => ({ ...p, outputFormat: fmt as any }))}
                      className={`rounded-lg border py-2 text-center text-xs font-bold uppercase tracking-wider transition ${
                        clipParams.outputFormat === fmt
                          ? 'border-blue-500 bg-blue-950/30 text-white'
                          : 'border-zinc-900 bg-zinc-900/30 text-gray-400 hover:text-white'
                      }`}
                      id={`format-${fmt}`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume & Audio features */}
              <div className="space-y-4 pt-1 border-t border-zinc-900">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                    {clipParams.keepAudio ? <Volume2 className="h-4 w-4 text-blue-400" /> : <VolumeX className="h-4 w-4 text-gray-500" />}
                    <span>Audio Tracks</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={clipParams.keepAudio}
                    onChange={(e) => setClipParams(p => ({ ...p, keepAudio: e.target.checked }))}
                    className="h-4.5 w-4.5 rounded border-zinc-800 accent-blue-500"
                    id="keep-audio-checkbox"
                  />
                </div>

                {clipParams.keepAudio && (
                  <div>
                    <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                      <span>Volume Multiplier:</span>
                      <span className="font-mono text-white font-semibold">{clipParams.volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={clipParams.volume}
                      onChange={(e) => setClipParams(p => ({ ...p, volume: parseInt(e.target.value) }))}
                      className="w-full h-1 bg-zinc-900 cursor-pointer accent-blue-500 rounded"
                      id="volume-multiplier-slider"
                    />
                  </div>
                )}
              </div>

              {/* Watermark Confirm Box - explicitly No Watermark */}
              <div className="rounded-xl border border-blue-950/40 bg-blue-950/15 p-3.5 text-xs flex items-start gap-2 text-blue-300">
                <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="font-extrabold text-[#70a5ff] uppercase block">No Watermark Added</span>
                  <span className="text-[11px] text-gray-400 leading-none">
                    Your generated file will play natively cleanly on any website or social app without branding overlays.
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={processClip}
                  disabled={isProcessing}
                  id="process-clip-btn"
                  className="w-full flex items-center justify-center space-x-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4.5 text-md font-extrabold text-white shadow-xl shadow-blue-500/20 hover:scale-[1.01] hover:from-blue-500 hover:to-indigo-500/90 active:scale-100 disabled:opacity-50 transition-all duration-300"
                >
                  <Scissors className="h-5 w-5 text-indigo-200" />
                  <span>Segment & Download In HD</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVideoUrl(null);
                    setFilename(null);
                    setSuccessClip(null);
                    setErrorMessage(null);
                  }}
                  id="reset-studio-btn"
                  className="w-full py-3 text-xs text-gray-500 font-semibold hover:text-white transition"
                >
                  Clear Video & Upload New File
                </button>
              </div>
            </div>

            {/* Selected File Details */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-4 font-mono text-[10px] text-gray-500 space-y-2">
              <span className="text-gray-400 uppercase tracking-wider font-bold block mb-1">Uploaded Metadata</span>
              <div className="flex justify-between">
                <span>Direct Name:</span>
                <span className="text-zinc-400 truncate max-w-[200px]">{originalName}</span>
              </div>
              <div className="flex justify-between">
                <span>Initial Size:</span>
                <span className="text-zinc-400">{formatBytes(fileSize)}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Cache:</span>
                <span className="text-zinc-400 truncate max-w-[200px]">{filename}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
