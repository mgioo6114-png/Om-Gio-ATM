import React, { useState } from 'react';
import {
  Copy,
  Sparkles,
  Download,
  Film,
  Lock,
  CheckCircle2,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { Project, RecreationMode } from '../../types';
import { copyToClipboard } from '../../utils/exportHelpers';
import { formatAllPrompts } from '../../utils/promptGenerator';

interface HeaderProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => void;
  onOpenExport: () => void;
  onNewProject: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  onUpdateProject,
  onOpenExport,
  onNewProject,
  onShowToast,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [projectName, setProjectName] = useState(project.name);
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  const handleCopyAll = async () => {
    if (!project.scenes || project.scenes.length === 0) {
      onShowToast('No scenes available to copy yet. Analyze a video first.', 'warning');
      return;
    }
    const allPromptsText = formatAllPrompts(project.scenes);
    const success = await copyToClipboard(allPromptsText);
    if (success) {
      onShowToast(`All ${project.scenes.length} Google Flow / Veo Prompts copied successfully!`, 'success');
    } else {
      onShowToast('Failed to copy to clipboard', 'warning');
    }
  };

  const handleModeChange = (mode: RecreationMode) => {
    onUpdateProject({ recreationMode: mode });
    setShowModeDropdown(false);
    onShowToast(`Switched mode to ${mode}`, 'info');
  };

  const saveTitle = () => {
    setIsEditingTitle(false);
    if (projectName.trim()) {
      onUpdateProject({ name: projectName.trim() });
    } else {
      setProjectName(project.name);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md px-6 flex items-center justify-between z-10 shrink-0">
      {/* Left: Project Name & Title */}
      <div className="flex items-center gap-4">
        {isEditingTitle ? (
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
            autoFocus
            className="bg-slate-900 border border-cyan-500/50 rounded px-2.5 py-1 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className="text-left group flex items-center gap-2"
            title="Click to rename project"
          >
            <h1 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors max-w-xs md:max-w-md truncate">
              {project.name}
            </h1>
            <span className="text-[10px] text-slate-500 group-hover:text-slate-400">✎</span>
          </button>
        )}

        {/* Recreation Mode Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowModeDropdown(!showModeDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900/90 hover:bg-slate-850 text-cyan-300 border border-cyan-500/30 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{project.recreationMode}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showModeDropdown && (
            <div className="absolute top-full left-0 mt-1.5 w-60 rounded-lg bg-[#0b101d] border border-cyan-500/30 shadow-2xl p-1.5 z-50 text-xs">
              {(['EXACT RECREATION', 'INSPIRED RECREATION', 'CINEMATIC UPGRADE'] as RecreationMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors flex items-center justify-between ${
                    project.recreationMode === mode
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <p className="font-semibold">{mode}</p>
                    <p className="text-[10px] text-slate-400 font-normal">
                      {mode === 'EXACT RECREATION' && '1:1 Timing, camera, and dialogue replica'}
                      {mode === 'INSPIRED RECREATION' && 'Preserves concept with creative flair'}
                      {mode === 'CINEMATIC UPGRADE' && 'Premium anamorphic lighting & grading'}
                    </p>
                  </div>
                  {project.recreationMode === mode && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Identity Lock Status Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-cyan-950/50 border border-cyan-600/40 text-cyan-300">
          <Lock className="w-3 h-3 text-cyan-400" />
          <span>IDENTITY LOCK: {project.identityLockStrength}</span>
        </div>

        {/* Gemini API Key Status Badge */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 shadow-sm"
          title="Google Gemini API Key terhubung dan siap digunakan"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
          <span className="font-bold">API KEY: READY</span>
        </div>
      </div>

      {/* Right: Quick Action Buttons */}
      <div className="flex items-center gap-2.5">
        {/* Copy All Prompts Button (Section 41) */}
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer active:scale-95"
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">COPY ALL GOOGLE FLOW PROMPTS</span>
          <span className="sm:hidden">COPY ALL</span>
        </button>

        {/* Export Modal trigger */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
