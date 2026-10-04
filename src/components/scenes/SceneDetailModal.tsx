import React, { useState } from 'react';
import { X, Copy, Download, Check, Sparkles, Film, Clock, MessageSquare } from 'lucide-react';
import { SceneAnalysis } from '../../types';
import { copyToClipboard, downloadFile } from '../../utils/exportHelpers';

interface SceneDetailModalProps {
  scene: SceneAnalysis | null;
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const SceneDetailModal: React.FC<SceneDetailModalProps> = ({
  scene,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!scene) return null;

  const handleCopy = async () => {
    const success = await copyToClipboard(scene.generatedPrompt);
    if (success) {
      setCopied(true);
      onShowToast(`Prompt for ${scene.sceneLabel} copied successfully.`, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(
      scene.generatedPrompt,
      `${scene.sceneLabel.replace(/\s+/g, '_')}_google_flow_prompt.txt`,
      'text/plain'
    );
    onShowToast(`Downloaded prompt for ${scene.sceneLabel}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-[#080d19] border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#050811]">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            <div>
              <h3 className="text-base font-extrabold text-white tracking-wide font-mono">
                {scene.sceneLabel} — GOOGLE FLOW / VEO PROMPT
              </h3>
              <p className="text-xs text-cyan-400 font-mono">
                Time: {scene.timeRangeStr} ({scene.durationFormatted}) • Om Gio Identity Locked (95%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Prompt' : 'Copy Prompt'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
              title="Download as TXT"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Visual Bar: Frame + Dialogue summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#050811] p-4 rounded-xl border border-slate-800/80">
            <div className="md:col-span-4 aspect-video rounded-lg overflow-hidden bg-black border border-cyan-500/40 flex items-center justify-center relative">
              {scene.omGioThumbnailUrl || scene.thumbnailUrl ? (
                <img src={scene.omGioThumbnailUrl || scene.thumbnailUrl} alt={scene.sceneLabel} className="w-full h-full object-cover" />
              ) : (
                <Film className="w-8 h-8 text-slate-700" />
              )}
              <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-cyan-300 font-bold border border-cyan-500/30">
                OM GIO STORYBOARD
              </span>
            </div>
            <div className="md:col-span-8 flex flex-col justify-between space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">Scene Subject & Action:</span>
                <p className="text-slate-200 mt-1 leading-relaxed">{scene.action}</p>
              </div>

              {scene.dialogueSegments && scene.dialogueSegments.length > 0 && (
                <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-800/30">
                  <span className="text-[10px] font-mono text-cyan-300 font-bold block mb-1">
                    Spoken Dialogue (Verbatim):
                  </span>
                  <p className="text-slate-100 font-serif italic text-xs">
                    "{scene.dialogueSegments.map((d) => d.text).join(' ')}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Full Prompt Display (Strict Google Flow format) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Full Formatted Prompt (Ready to paste into Google Flow / Veo):
              </span>
              <span className="text-[11px] font-mono text-slate-500">25 Mandatory Sections Included</span>
            </div>

            <div className="relative rounded-xl bg-[#04060c] border border-slate-800 p-4 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-cyan-500/30">
              {scene.generatedPrompt}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#050811] flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Target Platform: Google Flow & Veo 3.1</span>
          <button
            onClick={handleCopy}
            className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 cursor-pointer"
          >
            Copy Prompt Successfully
          </button>
        </div>
      </div>
    </div>
  );
};
