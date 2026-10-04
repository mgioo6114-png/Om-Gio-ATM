import React from 'react';
import { FolderKanban, PlusCircle, Trash2, Clock, Film, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Project } from '../../types';

interface ProjectsViewProps {
  currentProject: Project;
  onSelectProject: (project: Project) => void;
  onNewProject: () => void;
  onDeleteProject: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  currentProject,
  onSelectProject,
  onNewProject,
  onDeleteProject,
  onShowToast,
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#091120] via-[#080d1a] to-[#040812] border border-cyan-500/25 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              PROJECT REPOSITORY
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Active Projects & Saved Productions</h2>
          <p className="text-xs text-slate-400">
            Section 45 & 56: All metadata, video assets, verbatim transcripts, and prompts are saved locally in private workspace storage.
          </p>
        </div>

        <button
          onClick={onNewProject}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>NEW PROJECT</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Project Card */}
        <div className="rounded-2xl bg-[#090d18] border-2 border-cyan-500/40 p-6 space-y-4 shadow-xl relative">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold">
              CURRENT ACTIVE
            </span>
            <span className="text-xs font-mono text-slate-400">
              Created: {new Date(currentProject.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{currentProject.name}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Mode: {currentProject.recreationMode} • Identity Lock: {currentProject.identityLockStrength}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500">Duration</span>
              <p className="font-bold text-white mt-0.5">{currentProject.videoMetadata?.durationFormatted || '00:00:54'}</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500">Scenes</span>
              <p className="font-bold text-cyan-300 mt-0.5">{currentProject.scenes.length}</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-500">Dialogue</span>
              <p className="font-bold text-emerald-400 mt-0.5">{currentProject.transcript.length} Segs</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Authorized
            </span>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this project and all generated prompts?')) {
                  onDeleteProject();
                  onShowToast('Project deleted successfully.', 'info');
                }
              }}
              className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
