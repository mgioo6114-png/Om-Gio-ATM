import React, { useState } from 'react';
import {
  Copy,
  Eye,
  Edit3,
  RefreshCw,
  Clock,
  Film,
  MessageSquare,
  Camera,
  Check,
  Sparkles,
  Sliders,
  Download,
  User,
} from 'lucide-react';
import { SceneAnalysis, OmGioCharacter } from '../../types';
import { copyToClipboard, downloadFile } from '../../utils/exportHelpers';
import { downloadSingleSceneImage } from '../../utils/storyboardImageExporter';
import { OmGioVisualAvatar } from '../character/OmGioVisualAvatar';

interface SceneCardProps {
  scene: SceneAnalysis;
  character: OmGioCharacter;
  onViewPrompt: (scene: SceneAnalysis) => void;
  onEditScene: (scene: SceneAnalysis) => void;
  onRegenerateScene: (scene: SceneAnalysis) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({
  scene,
  character,
  onViewPrompt,
  onEditScene,
  onRegenerateScene,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = async () => {
    const success = await copyToClipboard(scene.generatedPrompt);
    if (success) {
      setCopied(true);
      onShowToast(`Prompt for ${scene.sceneLabel} copied successfully.`, 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      onShowToast('Failed to copy prompt', 'warning');
    }
  };

  const handleDownloadImage = async () => {
    try {
      onShowToast(`Menyiapkan gambar 16:9 untuk ${scene.sceneLabel}...`, 'info');
      await downloadSingleSceneImage(scene, character);
      onShowToast(`Gambar ${scene.sceneLabel} berhasil diunduh untuk Google Flow!`, 'success');
    } catch {
      onShowToast('Gagal mengunduh gambar adegan', 'warning');
    }
  };

  const hasDialogue = scene.dialogueSegments && scene.dialogueSegments.length > 0;
  const dialoguePreview = hasDialogue
    ? scene.dialogueSegments.map((d) => d.text).join(' ')
    : 'No spoken dialogue (Silence / Ambient)';

  return (
    <div className="rounded-2xl bg-[#090d18] border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 shadow-xl overflow-hidden flex flex-col justify-between group">
      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between bg-[#060a12]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <h3 className="font-extrabold text-sm tracking-wider text-white font-mono">{scene.sceneLabel}</h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 rounded px-2.5 py-1">
          <Clock className="w-3 h-3 text-cyan-400" />
          <span>{scene.timeRangeStr}</span>
          <span className="text-slate-500 font-normal">({scene.durationFormatted})</span>
        </div>
      </div>

      {/* Frame Visual Area — 100% Direct Om Gio Storyboard Image */}
      <div className="relative aspect-video bg-black/90 overflow-hidden border-b border-slate-800/60 flex items-center justify-center">
        {scene.omGioThumbnailUrl ? (
          <img
            src={scene.omGioThumbnailUrl}
            alt={`${scene.sceneLabel} Om Gio`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : character.customPhotoUrl ? (
          <img
            src={character.customPhotoUrl}
            alt="Om Gio Reference"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <OmGioVisualAvatar
            viewMode={scene.sceneNumber % 2 === 0 ? 'threeQuarter' : 'front'}
            identityLockStrength={character.identityStrength || '95%'}
            showHud={true}
            className="w-full h-full"
          />
        )}

        {/* Floating Om Gio Identity Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
            OM GIO STORYBOARD
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-slate-300 border border-slate-700">
            {scene.cameraDistance || 'Medium shot'}
          </span>
        </div>

        {/* Quick Download 16:9 Image Button for Google Flow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownloadImage();
          }}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 hover:bg-cyan-950 text-cyan-300 hover:text-white border border-cyan-500/40 shadow-lg backdrop-blur-md transition-all cursor-pointer z-10"
          title="Download Gambar 16:9 Adegan Ini Langsung untuk Google Flow / Veo"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {hasDialogue && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/90 backdrop-blur-md text-emerald-300 border border-emerald-600/40">
            <MessageSquare className="w-2.5 h-2.5" />
            <span>Dialogue Mapped</span>
          </div>
        )}
      </div>

      {/* Structured Content Details */}
      <div className="p-4 space-y-3 text-xs flex-1">
        {/* Visual & Action */}
        <div>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide">Action & Subject</span>
          <p className="text-slate-200 mt-0.5 line-clamp-2 leading-relaxed">
            {scene.action || scene.subject}
          </p>
        </div>

        {/* Camera specs */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded-lg border border-slate-800">
          <Camera className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{scene.cameraAngle} • {scene.cameraMovement}</span>
        </div>

        {/* Dialogue Box */}
        <div className="bg-[#050811] p-2.5 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span className="text-cyan-400 font-semibold">Om Gio Spoken Dialogue:</span>
            <span>{scene.dialogueTiming || scene.timeRangeStr}</span>
          </div>
          <p className="text-slate-200 italic line-clamp-2 text-[11px] font-serif">
            "{dialoguePreview}"
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-3 bg-[#060a12] border-t border-slate-800/80 grid grid-cols-5 gap-1.5">
        {/* VIEW PROMPT */}
        <button
          onClick={() => onViewPrompt(scene)}
          className="flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-colors"
          title="View Complete Google Flow Prompt"
        >
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">View</span>
        </button>

        {/* COPY PROMPT */}
        <button
          onClick={handleCopyPrompt}
          className={`flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg text-xs font-bold transition-all ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30'
          }`}
          title="Copy Prompt for Google Flow / Veo"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>

        {/* DOWNLOAD 16:9 IMAGE */}
        <button
          onClick={handleDownloadImage}
          className="flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg text-xs font-semibold bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 transition-colors"
          title="Download Gambar 16:9 Adegan Ini untuk Google Flow"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Gambar</span>
        </button>

        {/* EDIT */}
        <button
          onClick={() => onEditScene(scene)}
          className="flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
          title="Edit Scene Details"
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Edit</span>
        </button>

        {/* REGENERATE */}
        <button
          onClick={() => onRegenerateScene(scene)}
          className="flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700/60 transition-colors"
          title="Regenerate Prompt"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Regen</span>
        </button>
      </div>
    </div>
  );
};

