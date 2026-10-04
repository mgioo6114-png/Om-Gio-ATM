import React, { useRef, useState } from 'react';
import { X, Printer, Download, Copy, Film, Sparkles, Check, Clock, User, ShieldCheck, Image as ImageIcon, Archive } from 'lucide-react';
import { Project, SceneAnalysis } from '../../types';
import { downloadFile, copyToClipboard } from '../../utils/exportHelpers';
import { formatAllPrompts } from '../../utils/promptGenerator';
import {
  exportStoryboardAsMasterImage,
  downloadAllSceneImagesZip,
  downloadSingleSceneImage,
} from '../../utils/storyboardImageExporter';
import { OmGioVisualAvatar } from '../character/OmGioVisualAvatar';

interface VisualStoryboardModalProps {
  isOpen: boolean;
  project: Project;
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const VisualStoryboardModal: React.FC<VisualStoryboardModalProps> = ({
  isOpen,
  project,
  onClose,
  onShowToast,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMasterImage = async () => {
    try {
      setIsExporting(true);
      onShowToast('Sedang merender Master Dokumen Gambar Storyboard (PNG 1920px)...', 'info');
      await exportStoryboardAsMasterImage(project, (msg) => onShowToast(msg, 'info'));
      onShowToast('Dokumen Gambar Storyboard (.PNG) berhasil diunduh!', 'success');
    } catch {
      onShowToast('Gagal merender dokumen gambar', 'warning');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadZipImages = async () => {
    try {
      setIsExporting(true);
      onShowToast('Mengumpulkan seluruh frame 16:9 ke dalam file ZIP...', 'info');
      await downloadAllSceneImagesZip(project, (msg) => onShowToast(msg, 'info'));
      onShowToast('Paket gambar adegan (ZIP) berhasil diunduh untuk Google Flow!', 'success');
    } catch {
      onShowToast('Gagal membuat paket ZIP', 'warning');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSingleImage = async (scene: SceneAnalysis) => {
    try {
      onShowToast(`Mengunduh gambar untuk ${scene.sceneLabel}...`, 'info');
      await downloadSingleSceneImage(scene, project.character);
      onShowToast(`Gambar ${scene.sceneLabel} berhasil diunduh!`, 'success');
    } catch {
      onShowToast('Gagal mengunduh gambar', 'warning');
    }
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${project.name} — Visual Storyboard (Om Gio AI Studio)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #070b14; color: #f1f5f9; padding: 24px; line-height: 1.5; }
    .header { border-bottom: 2px solid #06b6d4; padding-bottom: 16px; margin-bottom: 24px; }
    .title { font-size: 24px; font-weight: 800; color: #fff; margin: 0; }
    .subtitle { font-size: 13px; color: #06b6d4; margin-top: 4px; font-family: monospace; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: 24px; }
    .card { background: #0c1220; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; padding: 16px; page-break-inside: avoid; }
    .card-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 8px; margin-bottom: 12px; }
    .scene-title { font-size: 14px; font-weight: 800; color: #38bdf8; font-family: monospace; }
    .timing { font-size: 12px; color: #94a3b8; font-family: monospace; }
    .frames { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
    .frame-box { aspect-ratio: 16/9; background: #000; border-radius: 8px; overflow: hidden; position: relative; border: 1px solid #334155; }
    .frame-box img { width: 100%; height: 100%; object-fit: cover; }
    .frame-label { position: absolute; bottom: 4px; left: 4px; background: rgba(0,0,0,0.75); color: #38bdf8; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
    .section-title { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-top: 8px; font-family: monospace; }
    .text-body { font-size: 12px; color: #cbd5e1; margin-top: 2px; }
    .dialogue-box { background: #050811; border-left: 3px solid #10b981; padding: 8px 12px; margin-top: 8px; border-radius: 4px; font-style: italic; font-size: 12px; color: #e2e8f0; }
    .prompt-box { background: #020617; border: 1px solid #1e293b; padding: 8px; font-family: monospace; font-size: 10px; color: #cbd5e1; white-space: pre-wrap; max-height: 140px; overflow-y: auto; margin-top: 8px; border-radius: 6px; }
    @media print {
      body { background: #fff !important; color: #000 !important; }
      .card { background: #fff !important; border: 1px solid #ccc !important; }
      .dialogue-box { background: #f8fafc !important; color: #000 !important; }
      .prompt-box { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="title">${project.name}</h1>
    <div class="subtitle">OM GIO AI STUDIO — VISUAL STORYBOARD & GOOGLE FLOW / VEO RECREATION</div>
    <div style="font-size: 11px; color: #94a3b8; margin-top: 6px; font-family: monospace;">
      Target Character: Om Gio (28yo, Indonesian, Rectangular Glasses, Thin Mustache) • Identity Lock: ${project.identityLockStrength} • Mode: ${project.recreationMode}
    </div>
  </div>

  <div class="grid">
    ${project.scenes
      .map(
        (scene) => `
      <div class="card">
        <div class="card-header">
          <span class="scene-title">${scene.sceneLabel}</span>
          <span class="timing">${scene.timeRangeStr} (${scene.durationFormatted})</span>
        </div>

        <div class="frames" style="grid-template-columns: 1fr;">
          <div class="frame-box">
            ${
              scene.omGioThumbnailUrl
                ? `<img src="${scene.omGioThumbnailUrl}" alt="Om Gio Storyboard Frame" />`
                : project.character.customPhotoUrl
                ? `<img src="${project.character.customPhotoUrl}" alt="Om Gio Reference" />`
                : `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#090d18;color:#38bdf8;font-size:13px;font-family:monospace;text-align:center;padding:12px;">OM GIO STORYBOARD FRAME<br/><span style="font-size:10px;color:#94a3b8;">Identity Lock 95% Active</span></div>`
            }
            <div class="frame-label" style="color:#22d3ee;font-weight:bold;">OM GIO STORYBOARD FRAME</div>
          </div>
        </div>

        <div class="section-title">Action & Subject</div>
        <div class="text-body">${scene.action}</div>

        <div class="section-title">Camera & Composition</div>
        <div class="text-body">${scene.cameraAngle} • ${scene.cameraMovement}</div>

        <div class="section-title">Om Gio Verbatim Dialogue</div>
        <div class="dialogue-box">"${scene.dialogueSegments?.map((d) => d.text).join(' ') || 'No spoken dialogue'}"</div>

        <div class="section-title">Google Flow / Veo Prompt Preview</div>
        <div class="prompt-box">${scene.generatedPrompt}</div>
      </div>
    `
      )
      .join('')}
  </div>
</body>
</html>`;

    const safeName = project.name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
    downloadFile(htmlContent, `${safeName}_visual_storyboard.html`, 'text/html');
    onShowToast('Visual Storyboard HTML downloaded successfully!', 'success');
  };

  const handleCopyAll = async () => {
    const text = formatAllPrompts(project.scenes);
    const ok = await copyToClipboard(text);
    if (ok) {
      onShowToast(`All ${project.scenes.length} Google Flow prompts copied!`, 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-6xl max-h-[92vh] rounded-3xl bg-[#080d19] border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#050811] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white font-mono">
                  VISUAL STORYBOARD — {project.scenes.length} SCENES
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                  OM GIO REPLACED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Compare Source Frames vs Om Gio Identity Replacement Target
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* DOWNLOAD MASTER IMAGE DOCUMENT (.PNG) */}
            <button
              onClick={handleDownloadMasterImage}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              title="Download Seluruh Storyboard sebagai Satu Dokumen Gambar Lengkap (.PNG) untuk Google Flow"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Dokumen Gambar (.PNG)</span>
            </button>

            {/* DOWNLOAD ALL IMAGES ZIP */}
            <button
              onClick={handleDownloadZipImages}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              title="Download Semua Gambar 16:9 + Teks Prompt ke dalam ZIP"
            >
              <Archive className="w-3.5 h-3.5 text-cyan-400" />
              <span>Semua Gambar (.ZIP)</span>
            </button>

            {/* PRINT / SAVE AS PDF */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-all cursor-pointer"
              title="Print directly or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print / PDF</span>
            </button>

            {/* COPY ALL PROMPTS */}
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Copy All Prompts</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Storyboard Content Scrollable Area */}
        <div ref={printAreaRef} className="p-6 overflow-y-auto space-y-6">
          {/* Top Info Banner */}
          <div className="p-4 rounded-2xl bg-[#050811] border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                Om Gio Character Reference Verified
              </span>
              <p className="text-slate-300">
                Setiap prompt di storyboard ini telah menginstruksikan generator AI (Google Flow / Veo) untuk menggantikan
                orang pada video sumber dengan karakter <strong className="text-white">Om Gio</strong> (pria Indonesia 28 tahun, kacamata kotak, kumis tipis, rambut rapi) dengan penguncian identitas 95%.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-bold">
                Lock: {project.identityLockStrength}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                Mode: {project.recreationMode}
              </span>
            </div>
          </div>

          {/* Scene Cards Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.scenes.map((scene, idx) => {
              const exactDialogue = scene.dialogueSegments?.map((d) => d.text).join(' ') || 'No spoken dialogue';

              return (
                <div
                  key={scene.id}
                  className="rounded-2xl bg-[#090d18] border border-slate-800 p-4 space-y-3.5 shadow-xl flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      <h4 className="font-mono font-extrabold text-white text-sm">
                        {scene.sceneLabel}
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      {scene.timeRangeStr} ({scene.durationFormatted})
                    </span>
                  </div>

                  {/* 100% Direct Om Gio Storyboard Frame */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#070b14] border border-cyan-500/40">
                    {scene.omGioThumbnailUrl ? (
                      <img
                        src={scene.omGioThumbnailUrl}
                        alt={`${scene.sceneLabel} Om Gio Frame`}
                        className="w-full h-full object-cover"
                      />
                    ) : project.character.customPhotoUrl ? (
                      <img
                        src={project.character.customPhotoUrl}
                        alt="Om Gio Reference"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <OmGioVisualAvatar
                        viewMode={
                          idx % 3 === 0
                            ? 'front'
                            : idx % 3 === 1
                            ? 'threeQuarter'
                            : 'smile'
                        }
                        identityLockStrength={project.identityLockStrength}
                        showHud={false}
                        className="w-full h-full"
                      />
                    )}
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      OM GIO STORYBOARD FRAME
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[9px] font-mono text-slate-300 border border-slate-700">
                      {scene.cameraDistance || 'Medium shot'}
                    </div>
                  </div>

                  {/* Scene Specs & Action */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                        Action & Movement:
                      </span>
                      <p className="text-slate-200 mt-0.5 leading-relaxed text-[11px]">
                        {scene.action}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <span>Camera: {scene.cameraAngle}</span>
                      <span>•</span>
                      <span>Movement: {scene.cameraMovement}</span>
                    </div>

                    {/* Verbatim Dialogue */}
                    <div className="p-2.5 rounded-lg bg-[#050811] border border-slate-800">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1">
                        Om Gio Verbatim Spoken Dialogue:
                      </span>
                      <p className="text-slate-200 font-serif italic text-xs leading-relaxed">
                        "{exactDialogue}"
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons: Download Image + Copy Prompt */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDownloadSingleImage(scene)}
                      className="py-2 px-2.5 rounded-xl text-xs font-bold bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Download Gambar 16:9 Adegan Ini untuk Langsung Dikirim ke Google Flow"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Unduh Gambar</span>
                    </button>

                    <button
                      onClick={async () => {
                        await copyToClipboard(scene.generatedPrompt);
                        onShowToast(`Copied Google Flow prompt for ${scene.sceneLabel}`, 'success');
                      }}
                      className="py-2 px-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Prompt</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#050811] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <span>Total {project.scenes.length} Scenes Analyzed & Replaced with Om Gio</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline cursor-pointer"
            >
              Print / Save as PDF
            </button>
            <button
              onClick={handleDownloadHtml}
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
            >
              Download Standalone HTML
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
