import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Cpu,
  ShieldCheck,
  Trash2,
  Lock,
  Layers,
  Sparkles,
  Server,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { Project, IdentityLockStrength } from '../../types';

interface SettingsViewProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => void;
  onDeleteAllData: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  project,
  onUpdateProject,
  onDeleteAllData,
  onShowToast,
}) => {
  const [selectedVisionProvider, setSelectedVisionProvider] = useState('Gemini 3.8 Flash (Multimodal Vision)');
  const [selectedSpeechProvider, setSelectedSpeechProvider] = useState('Gemini 3.5 Transcribe + Diarization');
  const [selectedPromptProvider, setSelectedPromptProvider] = useState('Om Gio Google Flow Generator V1');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#091120] via-[#080d1a] to-[#040812] border border-cyan-500/25 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              SYSTEM CONFIGURATION
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Provider Abstraction & Architecture
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Studio Settings & AI Providers</h2>
          <p className="text-xs text-slate-400">
            Section 51 & 52: Modular abstraction for Video Analysis, Audio Diarization, and Prompt Generation providers.
          </p>
        </div>
      </div>

      {/* Provider Abstraction (Section 52) */}
      <div className="rounded-2xl bg-[#090d18] border border-slate-800 p-6 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-white">AI Provider Abstraction Interfaces</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <label className="text-cyan-400 font-bold block uppercase">Vision & Scene Provider</label>
            <select
              value={selectedVisionProvider}
              onChange={(e) => setSelectedVisionProvider(e.target.value)}
              className="w-full rounded-lg bg-black border border-slate-700 p-2 text-white"
            >
              <option value="Gemini 3.8 Flash (Multimodal Vision)">Gemini 3.8 Flash (Multimodal)</option>
              <option value="Om Gio Local Vision Engine">Om Gio Local Canvas Engine</option>
            </select>
            <p className="text-[10px] text-slate-400">Analyzes camera angles, lighting, wardrobe, and actions.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <label className="text-emerald-400 font-bold block uppercase">Speech & Audio Provider</label>
            <select
              value={selectedSpeechProvider}
              onChange={(e) => setSelectedSpeechProvider(e.target.value)}
              className="w-full rounded-lg bg-black border border-slate-700 p-2 text-white"
            >
              <option value="Gemini 3.5 Transcribe + Diarization">Gemini 3.5 Transcribe</option>
              <option value="Web Audio Verbatim Diarizer">Web Audio Verbatim Engine</option>
            </select>
            <p className="text-[10px] text-slate-400">Transcribes all speech with word/segment level timestamps.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <label className="text-blue-400 font-bold block uppercase">Prompt Generation Provider</label>
            <select
              value={selectedPromptProvider}
              onChange={(e) => setSelectedPromptProvider(e.target.value)}
              className="w-full rounded-lg bg-black border border-slate-700 p-2 text-white"
            >
              <option value="Om Gio Google Flow Generator V1">Om Gio Google Flow Strict V1</option>
              <option value="Veo 3.1 Cinematic Director">Veo 3.1 Cinematic Director</option>
            </select>
            <p className="text-[10px] text-slate-400">Enforces 25-section strict prompt schema for Google Flow / Veo.</p>
          </div>
        </div>
      </div>

      {/* Global Continuity Locks Toggle (Section 30) */}
      <div className="rounded-2xl bg-[#090d18] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Lock className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-white">Global Production Continuity Locks</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
          {Object.entries(project.globalLocks).map(([key, val]) => (
            <label
              key={key}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
            >
              <span className="text-slate-300 font-semibold uppercase">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <input
                type="checkbox"
                checked={val}
                onChange={(e) =>
                  onUpdateProject({
                    globalLocks: {
                      ...project.globalLocks,
                      [key]: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-cyan-500 bg-black border-slate-700"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Privacy & Security Cleanup (Section 56 & 57) */}
      <div className="rounded-2xl bg-rose-950/20 border border-rose-800/40 p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-rose-800/30 pb-3">
          <Trash2 className="w-5 h-5 text-rose-400" />
          <h3 className="font-bold text-sm text-white">Privacy & Workspace Data Cleanup</h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Section 56 & 57: Videos and extracted audio data are processed locally and securely. You can purge all cached
          frames, video blobs, and generated prompt artifacts at any time.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Delete current uploaded video file and release memory?')) {
                onUpdateProject({ videoUrl: undefined, videoFile: undefined });
                onShowToast('Video memory released.', 'info');
              }
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-800/40 transition-colors"
          >
            DELETE VIDEO
          </button>

          <button
            onClick={() => {
              if (confirm('Permanently delete all generated project files, scenes, and transcripts?')) {
                onDeleteAllData();
                onShowToast('All project files cleared.', 'info');
              }
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-colors"
          >
            DELETE ALL GENERATED FILES
          </button>
        </div>
      </div>
    </div>
  );
};
