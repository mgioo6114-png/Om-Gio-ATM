import React, { useState } from 'react';
import {
  Copy,
  Plus,
  Sparkles,
  Search,
  SlidersHorizontal,
  Film,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Upload,
  User,
  Zap,
} from 'lucide-react';
import { SceneAnalysis, Project } from '../../types';
import { SceneCard } from './SceneCard';
import { copyToClipboard } from '../../utils/exportHelpers';
import { formatAllPrompts } from '../../utils/promptGenerator';

interface SceneGridProps {
  project: Project;
  onViewPrompt: (scene: SceneAnalysis) => void;
  onEditScene: (scene: SceneAnalysis) => void;
  onRegenerateScene: (scene: SceneAnalysis) => void;
  onAddSceneManually: () => void;
  onOpenExport: () => void;
  onOpenStoryboardModal: () => void;
  onUploadCharacterPhoto: (photoUrl: string) => void;
  onRenderAllOmGioFrames?: () => void;
  onConvertToShortFormat?: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const SceneGrid: React.FC<SceneGridProps> = ({
  project,
  onViewPrompt,
  onEditScene,
  onRegenerateScene,
  onAddSceneManually,
  onOpenExport,
  onOpenStoryboardModal,
  onUploadCharacterPhoto,
  onRenderAllOmGioFrames,
  onConvertToShortFormat,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'dialogue' | 'silent'>('all');

  const handleCopyAll = async () => {
    if (project.scenes.length === 0) {
      onShowToast('No scenes available to copy yet', 'warning');
      return;
    }
    const allText = formatAllPrompts(project.scenes);
    const success = await copyToClipboard(allText);
    if (success) {
      onShowToast(`All ${project.scenes.length} Google Flow / Veo Prompts copied successfully!`, 'success');
    } else {
      onShowToast('Failed to copy to clipboard', 'warning');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      onUploadCharacterPhoto(url);
      onShowToast('Om Gio reference photo updated and linked to all storyboard scenes!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const filteredScenes = project.scenes.filter((scene) => {
    const matchesSearch =
      scene.sceneLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scene.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scene.dialogueSegments.some((d) => d.text.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter === 'dialogue') {
      return scene.dialogueSegments && scene.dialogueSegments.length > 0;
    }
    if (selectedFilter === 'silent') {
      return !scene.dialogueSegments || scene.dialogueSegments.length === 0;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Stats & Master Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#091120] via-[#080d1b] to-[#040812] border border-cyan-500/25 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              ONE SCENE = ONE PROMPT
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {project.scenes.length} Scenes Total • Om Gio Primary Target
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Google Flow / Veo Scene Prompts</h2>
          <p className="text-xs text-slate-400">
            Every prompt retains exact unsummarized dialogue, camera grammar, lip-sync rules, and Om Gio's 95% identity lock.
          </p>
        </div>

        {/* Master Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* VISUAL STORYBOARD (GAMBAR / PDF / PRINT) */}
          <button
            onClick={onOpenStoryboardModal}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/50 shadow-md transition-all cursor-pointer"
            title="Download Storyboard sebagai Dokumen Gambar (.PNG) atau PDF untuk Google Flow"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>DOWNLOAD STORYBOARD (GAMBAR / PDF)</span>
          </button>

          {/* UNDER 11 SECONDS ADAPTER BUTTON */}
          {onConvertToShortFormat && (
            <button
              onClick={onConvertToShortFormat}
              className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm transition-all cursor-pointer"
              title="Optimalkan & pangkas storyboard menjadi ≤ 11 detik (ideal untuk limit Google Veo & Shorts)"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Format ≤ 11s (Veo)</span>
            </button>
          )}

          {/* RENDER ALL OM GIO FRAMES BUTTON (16:9 FULL-BLEED) */}
          {onRenderAllOmGioFrames && (
            <button
              onClick={onRenderAllOmGioFrames}
              className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm transition-all cursor-pointer"
              title="Perbarui seluruh frame adegan agar memenuhi kolom 16:9 penuh tanpa potongan bundar"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Penuhi Kolom (16:9)</span>
            </button>
          )}

          {/* BIG BUTTON: COPY ALL GOOGLE FLOW PROMPTS (Section 41) */}
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs tracking-wider bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-95"
          >
            <Copy className="w-4 h-4" />
            <span>COPY ALL PROMPTS</span>
          </button>

          {/* Add Scene Manually (Section 55) */}
          <button
            onClick={onAddSceneManually}
            className="flex items-center gap-1.5 px-3 py-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Scene</span>
          </button>

          {/* Export button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Continuity, Reference Photo & Quality Control Banner */}
      <div className="p-4 rounded-2xl bg-[#090d18] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center shrink-0">
            {project.character.customPhotoUrl ? (
              <img src={project.character.customPhotoUrl} alt="Om Gio Reference" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-cyan-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white">Target Character: Om Gio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                Identity Lock: {project.identityLockStrength}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {project.character.customPhotoUrl
                ? 'Foto referensi khusus Om Gio aktif dan dipetakan ke seluruh scene.'
                : 'Menggunakan Karakter Spesifikasi Standar Om Gio (28th, Kacamata kotak, Kumis tipis, Rambut rapi).'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>{project.character.customPhotoUrl ? 'Ganti Foto Om Gio' : 'Upload Foto Referensi Om Gio'}</span>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Continuity & Quality Control Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400">CHARACTER</p>
            <p className="font-bold text-white">OM GIO (95%)</p>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400">BEGRON / STUDIO</p>
            <p className="font-bold text-cyan-300">OM GIO TECH</p>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400">LOGO & BRANDING</p>
            <p className="font-bold text-emerald-400">OM GIO STUDIO</p>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400">SOURCE LOGOS</p>
            <p className="font-bold text-red-400 line-through">STRIPPED</p>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400">WARDROBE LOCK</p>
            <p className="font-bold text-white">PRESERVED</p>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400">SPEECH & DIALOGUE</p>
            <p className="font-bold text-emerald-400">100% COMPLETE</p>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400">LIP SYNC</p>
            <p className="font-bold text-white">SYNCHRONIZED</p>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400">MODE</p>
            <p className="font-bold text-cyan-300 truncate">{project.recreationMode}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#080d18] border border-slate-800/80 p-3 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dialogue, actions, or scenes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-mono">Filter:</span>
          {(['all', 'dialogue', 'silent'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                selectedFilter === filter
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Scene Cards Grid */}
      {filteredScenes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenes.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              character={project.character}
              onViewPrompt={onViewPrompt}
              onEditScene={onEditScene}
              onRegenerateScene={onRegenerateScene}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl bg-[#090d18]/40 border border-slate-800 p-8 space-y-3">
          <Film className="w-12 h-12 text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Scenes Matching Filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria, or click "Add Scene" to create a custom scene segment.
          </p>
        </div>
      )}
    </div>
  );
};

