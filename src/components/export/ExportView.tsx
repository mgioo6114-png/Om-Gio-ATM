import React, { useState } from 'react';
import {
  Download,
  Copy,
  FileText,
  FileCode,
  Sparkles,
  Check,
  ShieldCheck,
  Film,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { Project, BrandingPosition } from '../../types';
import {
  copyToClipboard,
  exportGoogleFlowTxt,
  exportProjectJson,
  exportFullTranscriptTxt,
  exportTranscriptSrt,
} from '../../utils/exportHelpers';
import { formatAllPrompts } from '../../utils/promptGenerator';

interface ExportViewProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => void;
  onOpenStoryboardModal?: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ExportView: React.FC<ExportViewProps> = ({
  project,
  onUpdateProject,
  onOpenStoryboardModal,
  onShowToast,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);

  const handleCopyAll = async () => {
    const text = formatAllPrompts(project.scenes);
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedAll(true);
      onShowToast(`All ${project.scenes.length} Google Flow prompts copied!`, 'success');
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleCopySingle = async (prompt: string, label: string) => {
    const success = await copyToClipboard(prompt);
    if (success) {
      onShowToast(`Prompt for ${label} copied!`, 'success');
    }
  };

  const currentScene = project.scenes[selectedSceneIndex] || project.scenes[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#091120] via-[#080d1a] to-[#040812] border border-cyan-500/25 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              PRODUCTION EXPORT HUB
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Ready for Google Flow & Veo 3.1
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Export & Google Flow Deliverables</h2>
          <p className="text-xs text-slate-400">
            Export generated scene prompts as plain text, JSON project structures, and subtitle tracks.
          </p>
        </div>

        {/* Master Copy All */}
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-95 shrink-0"
        >
          {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>COPY ALL GOOGLE FLOW PROMPTS</span>
        </button>
      </div>

      {/* Main Export Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Card 0: Visual Storyboard PDF & Print */}
        <div className="rounded-2xl bg-[#090d18] border-2 border-cyan-500/40 p-5 space-y-3 flex flex-col justify-between shadow-xl">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Film className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-white">Visual Storyboard</h3>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 font-bold">PDF/HTML</span>
            </div>
            <p className="text-xs text-slate-400">
              Full visual comparison (Source vs Om Gio), scene by scene cards, timestamps, verbatim speech, and print-ready PDF layout.
            </p>
          </div>
          <button
            onClick={onOpenStoryboardModal}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Open Storyboard</span>
          </button>
        </div>

        {/* Card 1: Google Flow TXT */}
        <div className="rounded-2xl bg-[#090d18] border border-slate-800 p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Google Flow Prompts (.txt)</h3>
            <p className="text-xs text-slate-400">
              Plain text formatted with scene delimiters. Ready to copy-paste directly into Veo / Google Flow.
            </p>
          </div>
          <button
            onClick={() => exportGoogleFlowTxt(project.scenes, project.name)}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download TXT</span>
          </button>
        </div>

        {/* Card 2: Full Project JSON */}
        <div className="rounded-2xl bg-[#090d18] border border-slate-800 p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Complete Project (.json)</h3>
            <p className="text-xs text-slate-400">
              Full project state including metadata, wardrobe locks, timestamps, audio events, and quality checks.
            </p>
          </div>
          <button
            onClick={() => exportProjectJson(project)}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-blue-300 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
        </div>

        {/* Card 3: Exact Transcript */}
        <div className="rounded-2xl bg-[#090d18] border border-slate-800 p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Exact Transcript (.txt)</h3>
            <p className="text-xs text-slate-400">
              Verbatim speech transcription with millisecond timestamps and mapped speaker identities.
            </p>
          </div>
          <button
            onClick={() => exportFullTranscriptTxt(project.transcript, project.name)}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Transcript</span>
          </button>
        </div>

        {/* Card 4: Subtitles SRT */}
        <div className="rounded-2xl bg-[#090d18] border border-slate-800 p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Subtitles (.srt)</h3>
            <p className="text-xs text-slate-400">
              Standardized SRT subtitle timing for video editing suites (Premiere, DaVinci, Final Cut).
            </p>
          </div>
          <button
            onClick={() => exportTranscriptSrt(project.transcript, project.name)}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-purple-300 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download SRT</span>
          </button>
        </div>
      </div>

      {/* User Branding Watermark Settings (Section 47) */}
      <div className="rounded-2xl bg-[#090d18] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Om Gio User Branding (Optional Watermark)</h3>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
            <input
              type="checkbox"
              checked={project.userBranding.enabled}
              onChange={(e) =>
                onUpdateProject({
                  userBranding: { ...project.userBranding, enabled: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700"
            />
            <span className="text-slate-300 font-semibold">Enable Branding</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <label className="text-slate-400 font-bold block mb-1">Brand Text</label>
            <select
              value={project.userBranding.brandText}
              onChange={(e) =>
                onUpdateProject({
                  userBranding: {
                    ...project.userBranding,
                    brandText: e.target.value as 'OM GIO' | 'OM GIO AI',
                  },
                })
              }
              className="w-full rounded-lg bg-slate-900 border border-slate-700 p-2 text-white"
            >
              <option value="OM GIO">OM GIO</option>
              <option value="OM GIO AI">OM GIO AI</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">Watermark Position</label>
            <select
              value={project.userBranding.position}
              onChange={(e) =>
                onUpdateProject({
                  userBranding: {
                    ...project.userBranding,
                    position: e.target.value as BrandingPosition,
                  },
                })
              }
              className="w-full rounded-lg bg-slate-900 border border-slate-700 p-2 text-white"
            >
              <option value="top-right">Top Right (Default)</option>
              <option value="top-left">Top Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-400 font-bold">Opacity</label>
              <span className="text-cyan-400 font-bold">{project.userBranding.opacity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={project.userBranding.opacity}
              onChange={(e) =>
                onUpdateProject({
                  userBranding: {
                    ...project.userBranding,
                    opacity: parseInt(e.target.value, 10),
                  },
                })
              }
              className="w-full accent-cyan-400"
            />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2 text-[11px] text-slate-400">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Compliance Rule (Section 47): Branding OM GIO is strictly applied to your own created deliverables and must
            never be used to overlay or conceal third-party watermarks.
          </span>
        </div>
      </div>

      {/* Interactive Single Scene Prompt Inspector & Copy */}
      {currentScene && (
        <div className="rounded-2xl bg-[#090d18] border border-slate-800 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-sm text-white font-mono">
                Inspect & Copy Single Scene Prompt
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Select a scene from your breakdown to view or copy its individual prompt.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedSceneIndex}
                onChange={(e) => setSelectedSceneIndex(parseInt(e.target.value, 10))}
                className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs font-mono text-cyan-300"
              >
                {project.scenes.map((s, idx) => (
                  <option key={s.id} value={idx}>
                    {s.sceneLabel} ({s.timeRangeStr})
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleCopySingle(currentScene.generatedPrompt, currentScene.sceneLabel)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy This Scene</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#04060c] border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
            {currentScene.generatedPrompt}
          </div>
        </div>
      )}
    </div>
  );
};
