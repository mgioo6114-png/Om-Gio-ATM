import React from 'react';
import {
  PlusCircle,
  Video,
  Film,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  Layers,
  FileText,
} from 'lucide-react';
import { Project } from '../../types';
import { NavTab } from '../layout/Sidebar';
import { OmGioVisualAvatar } from '../character/OmGioVisualAvatar';

interface DashboardViewProps {
  project: Project;
  onNavigate: (tab: NavTab) => void;
  onNewProject: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  onNavigate,
  onNewProject,
  onShowToast,
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Studio Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a1122] via-[#09101d] to-[#040711] border border-cyan-500/30 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                OM GIO AI STUDIO
              </span>
              <span className="text-xs text-slate-400 font-mono">V1.0 PRODUCTION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Analyze. Recreate. Replace with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Om Gio</span>.
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Transform authorized source videos into exact, unsummarized, frame-by-frame scene prompts for Google Flow and Veo.
              Audio speech-to-text diarization and 95% identity lock guarantee seamless facial and lip continuity.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onNewProject}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>CREATE NEW PROJECT</span>
              </button>

              <button
                onClick={() => onNavigate('scene-generator')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 transition-all cursor-pointer"
              >
                <Film className="w-4 h-4" />
                <span>View Generated Scenes ({project.scenes.length})</span>
              </button>
            </div>
          </div>

          {/* Om Gio Character Mini Hero Card */}
          <div className="w-full lg:w-72 aspect-[4/5] rounded-2xl overflow-hidden border border-cyan-500/40 shadow-2xl relative shrink-0">
            <OmGioVisualAvatar
              viewMode="threeQuarter"
              identityLockStrength={project.identityLockStrength}
              showHud={true}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Main 3 Quick Start Steps (Section 5) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Step 1: Upload Source Video */}
        <div
          onClick={() => onNavigate('video-analyzer')}
          className="p-6 rounded-2xl bg-[#090d18] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c1222] transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Step 1</span>
            <h3 className="font-extrabold text-base text-white group-hover:text-cyan-300 transition-colors">
              Upload Source Video
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag and drop an authorized MP4/MOV video. Extract duration, resolution, audio channels, and FPS.
            </p>
          </div>
          <div className="mt-5 flex items-center justify-between text-xs text-cyan-400 font-semibold">
            <span>Ingest Source</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Step 2: Select Character (Om Gio Default) */}
        <div
          onClick={() => onNavigate('character-library')}
          className="p-6 rounded-2xl bg-[#090d18] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c1222] transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">Step 2</span>
            <h3 className="font-extrabold text-base text-white group-hover:text-blue-300 transition-colors">
              Select Character (Om Gio)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect the primary character reference sheet. Lock facial structure, rectangular eyeglasses, and mustache at 95%.
            </p>
          </div>
          <div className="mt-5 flex items-center justify-between text-xs text-blue-400 font-semibold">
            <span>Verify Character Sheet</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Step 3: Analyze Video */}
        <div
          onClick={() => onNavigate('video-analyzer')}
          className="p-6 rounded-2xl bg-[#090d18] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c1222] transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Step 3</span>
            <h3 className="font-extrabold text-base text-white group-hover:text-emerald-300 transition-colors">
              Analyze Video & Generate Prompts
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Execute 20-step pipeline: scene cuts, verbatim transcription, speaker diarization, and Google Flow prompt generation.
            </p>
          </div>
          <div className="mt-5 flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Launch Pipeline</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* FINAL PROJECT SUMMARY (Section 50) */}
      <div className="rounded-3xl bg-[#090d18] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              VIDEO ANALYSIS COMPLETE — MASTER SUMMARY
            </h3>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
            100% PRODUCTION READY
          </span>
        </div>

        {/* Section 50 Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400">Duration</span>
            <p className="text-sm font-extrabold text-white mt-0.5">{project.videoMetadata?.durationFormatted || '00:00:54'}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400">Scenes</span>
            <p className="text-sm font-extrabold text-cyan-300 mt-0.5">{project.scenes.length} Detected</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400">Speakers</span>
            <p className="text-sm font-extrabold text-white mt-0.5">{project.stats.speakerCount} (Mapped to Om Gio)</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400">Dialogue Segments</span>
            <p className="text-sm font-extrabold text-white mt-0.5">{project.transcript.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400">Spoken Words</span>
            <p className="text-sm font-extrabold text-white mt-0.5">{project.stats.wordCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400">Unclear Segments</span>
            <p className="text-sm font-extrabold text-emerald-400 mt-0.5">0</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400">Unmapped Speech</span>
            <p className="text-sm font-extrabold text-emerald-400 mt-0.5">0</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400">Prompts Ready</span>
            <p className="text-sm font-extrabold text-cyan-400 mt-0.5">{project.scenes.length} / {project.scenes.length}</p>
          </div>
        </div>

        {/* Global Locks State */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <span className="text-slate-400">Global Locks:</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
            Character Lock: ON (95%)
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
            Wardrobe Lock: ON
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
            Location Lock: ON
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
            Lighting Continuity: ON
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
            Visual Style Lock: ON
          </span>
        </div>
      </div>
    </div>
  );
};
