import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Video,
  Film,
  FileText,
  UserCheck,
  FolderKanban,
  Download,
  Settings,
  ShieldCheck,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Project } from '../../types';

export type NavTab =
  | 'dashboard'
  | 'create-project'
  | 'video-analyzer'
  | 'scene-generator'
  | 'transcript'
  | 'character-library'
  | 'projects'
  | 'exports'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  project: Project;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, project }) => {
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create-project', label: 'Create Project', icon: PlusCircle },
    { id: 'video-analyzer', label: 'Video Analyzer', icon: Video },
    { id: 'scene-generator', label: 'Scene Generator', icon: Film },
    { id: 'transcript', label: 'Transcript', icon: FileText },
    { id: 'character-library', label: 'Character Sheet (360°)', icon: UserCheck },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'exports', label: 'Exports', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#070b14] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none z-20">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/70">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-[0_0_20px_rgba(6,182,212,0.35)]">
              <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 tracking-tighter text-lg">
                  OG
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-base text-white">OM GIO</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-tight font-medium">STUDIO V1.0</p>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-cyan-400/80 font-mono tracking-tight bg-cyan-950/40 border border-cyan-800/40 rounded px-2 py-1">
            "Analyze. Recreate. Replace with Om Gio."
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent text-cyan-300 border-l-2 border-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'scene-generator' && project.scenes.length > 0 && (
                  <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    {project.scenes.length}
                  </span>
                )}
                {item.id === 'transcript' && project.transcript.length > 0 && (
                  <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                    {project.transcript.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Identity Lock & Compliance Status Widget */}
      <div className="p-4 border-t border-slate-800/80 space-y-3 bg-[#050810]/70">
        {/* Character Card Mini */}
        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-400 font-medium text-[11px]">Primary Target</span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400">
              <Lock className="w-2.5 h-2.5" />
              {project.identityLockStrength}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300 text-xs shrink-0">
              OG
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-slate-200 truncate">{project.character.name}</p>
              <p className="text-[10px] text-slate-400 truncate">28yo • Indonesian • Fit</p>
            </div>
          </div>
        </div>

        {/* Permission Rule Confirmation */}
        <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono bg-emerald-950/30 border border-emerald-800/40 rounded px-2.5 py-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">Copyright Verified Only</span>
        </div>
      </div>
    </aside>
  );
};
