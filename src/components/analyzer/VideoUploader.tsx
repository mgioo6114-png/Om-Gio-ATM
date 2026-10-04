import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileVideo,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Sliders,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { VideoMetadata, Project, RecreationMode, IdentityLockStrength } from '../../types';
import { extractVideoMetadata } from '../../utils/videoProcessor';

interface VideoUploaderProps {
  project: Project;
  onVideoSelected: (file: File, metadata: VideoMetadata, objectUrl: string) => void;
  onStartAnalysis: () => void;
  onUpdateProject: (updated: Partial<Project>) => void;
  onLoadPreset: (presetType: 'tech' | 'vlog' | 'quick') => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  project,
  onVideoSelected,
  onStartAnalysis,
  onUpdateProject,
  onLoadPreset,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file) return;
    setIsLoadingMetadata(true);
    try {
      const { metadata, objectUrl } = await extractVideoMetadata(file);
      onVideoSelected(file, metadata, objectUrl);
    } catch (err: any) {
      alert(err.message || 'Failed to analyze video');
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const togglePlay = () => {
    if (!videoPlayerRef.current) return;
    if (isPlaying) {
      videoPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      videoPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoPlayerRef.current) {
      setCurrentTime(videoPlayerRef.current.currentTime);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0c1322] via-[#09101d] to-[#060b14] border border-cyan-500/20 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              PIPELINE ENTRY
            </span>
            <span className="text-xs text-slate-400">Step 1 of 4</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Source Video Ingestion & Audio Extraction</h2>
          <p className="text-sm text-slate-400 mt-1">
            Upload your source video. The AI will extract frames, detect cuts, diarize speakers, and map exact speech to Om Gio.
          </p>
        </div>

        {/* Quick Sample Presets Button */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-medium">Or try demo preset:</span>
          <button
            onClick={() => onLoadPreset('tech')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
          >
            Tech Review (Indonesian)
          </button>
          <button
            onClick={() => onLoadPreset('vlog')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Studio Vlog
          </button>
        </div>
      </div>

      {/* Main Grid: Upload & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Drag & Drop Area */}
        <div className="lg:col-span-7 space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[300px] ${
              isDragging
                ? 'border-cyan-400 bg-cyan-950/20 scale-[0.99]'
                : 'border-slate-800 bg-[#090d18]/60 hover:border-cyan-500/40 hover:bg-[#0c1222]/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-100">Drop your source video here</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Supports MP4, MOV, and WEBM formats up to 1080p / 4K. Audio track will be extracted and transcribed.
            </p>

            <button
              type="button"
              className="mt-5 px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md transition-all active:scale-95"
            >
              Choose Video
            </button>
          </div>

          {/* CRITICAL COPYRIGHT RULE ACCORDING TO PROMPT */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-600/30 space-y-3">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-amber-300">Mandatory Copyright & Authorization Notice</p>
                <p className="text-amber-200/80 mt-0.5">
                  Only upload videos you own or have permission to use and modify. This tool is designed for authorized
                  content creators to recreate scenes with Om Gio's identity.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-amber-500/30 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={project.permissionConfirmed}
                onChange={(e) => onUpdateProject({ permissionConfirmed: e.target.checked })}
                className="w-4 h-4 rounded border-amber-500 text-cyan-500 focus:ring-cyan-400 bg-slate-900 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-200">
                I confirm that I own this video or have permission to use and modify it.
              </span>
            </label>
          </div>
        </div>

        {/* Right Column: Metadata & Interactive Preview */}
        <div className="lg:col-span-5 space-y-4">
          {project.videoMetadata ? (
            <div className="rounded-2xl bg-[#090d18] border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <FileVideo className="w-4 h-4" />
                  Video Information
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  READY
                </span>
              </div>

              {/* Video Player Preview if URL is available */}
              {project.videoUrl ? (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-slate-800">
                  <video
                    ref={videoPlayerRef}
                    src={project.videoUrl}
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/70 backdrop-blur-md rounded-lg px-3 py-1.5 text-xs text-white">
                    <button onClick={togglePlay} className="hover:text-cyan-400">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <span className="font-mono text-[11px] text-slate-300">
                      {Math.floor(currentTime)}s / {project.videoMetadata.duration}s
                    </span>
                    <span className="font-mono text-[10px] text-cyan-400">
                      {project.videoMetadata.resolutionFormatted}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <FileVideo className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-200 truncate">{project.videoMetadata.filename}</p>
                    <p className="text-[11px] text-slate-400">{project.videoMetadata.fileSize}</p>
                  </div>
                </div>
              )}

              {/* Exact Metadata Specs from Section 7 */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                  <p className="text-[10px] text-slate-400 font-mono">Duration</p>
                  <p className="text-sm font-bold text-white font-mono mt-0.5">
                    {project.videoMetadata.durationFormatted}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                  <p className="text-[10px] text-slate-400 font-mono">Resolution</p>
                  <p className="text-sm font-bold text-white font-mono mt-0.5">
                    {project.videoMetadata.resolutionFormatted}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                  <p className="text-[10px] text-slate-400 font-mono">FPS</p>
                  <p className="text-sm font-bold text-white font-mono mt-0.5">
                    {project.videoMetadata.fps}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                  <p className="text-[10px] text-slate-400 font-mono">Aspect Ratio</p>
                  <p className="text-sm font-bold text-white font-mono mt-0.5">
                    {project.videoMetadata.aspectRatio}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                  <p className="text-[10px] text-slate-400 font-mono">Audio Track</p>
                  <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    Detected (Stereo)
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                  <p className="text-[10px] text-slate-400 font-mono">Estimated Frames</p>
                  <p className="text-sm font-bold text-white font-mono mt-0.5">
                    {project.videoMetadata.totalFrames.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Character Assignment Confirmation */}
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-bold text-cyan-300">
                    OG
                  </div>
                  <div>
                    <p className="font-bold text-slate-100">Om Gio (Primary Character)</p>
                    <p className="text-[10px] text-slate-400">Identity Lock: {project.identityLockStrength}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  DEFAULT
                </span>
              </div>

              {/* ANALYZE VIDEO BUTTON */}
              <button
                disabled={!project.permissionConfirmed || isLoadingMetadata}
                onClick={onStartAnalysis}
                className={`w-full py-3.5 rounded-xl font-extrabold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
                  project.permissionConfirmed && !isLoadingMetadata
                    ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-slate-950 hover:from-cyan-300 hover:to-indigo-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer active:scale-[0.98]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>ANALYZE VIDEO</span>
              </button>

              {!project.permissionConfirmed && (
                <p className="text-[11px] text-amber-400 text-center font-medium">
                  * Confirm copyright ownership checkbox above to enable analysis
                </p>
              )}
            </div>
          ) : (
            <div className="h-full rounded-2xl bg-[#090d18]/50 border border-slate-800/80 p-6 flex flex-col items-center justify-center text-center text-slate-500">
              <FileVideo className="w-12 h-12 mb-3 text-slate-700" />
              <p className="text-sm font-semibold text-slate-400">No Video Ingested Yet</p>
              <p className="text-xs text-slate-600 mt-1 max-w-xs">
                Upload your MP4/MOV/WEBM file or click a demo preset above to load metadata and proceed to analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
