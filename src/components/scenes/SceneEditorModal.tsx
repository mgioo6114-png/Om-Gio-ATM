import React, { useState } from 'react';
import { X, Sparkles, Save, RotateCcw } from 'lucide-react';
import { SceneAnalysis, OmGioCharacter, RecreationMode } from '../../types';
import { generateGoogleFlowPrompt } from '../../utils/promptGenerator';

interface SceneEditorModalProps {
  scene: SceneAnalysis | null;
  character: OmGioCharacter;
  recreationMode: RecreationMode;
  aspectRatio: string;
  onClose: () => void;
  onSaveScene: (updatedScene: SceneAnalysis) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const SceneEditorModal: React.FC<SceneEditorModalProps> = ({
  scene,
  character,
  recreationMode,
  aspectRatio,
  onClose,
  onSaveScene,
  onShowToast,
}) => {
  if (!scene) return null;

  const [formData, setFormData] = useState({
    subject: scene.subject || '',
    action: scene.action || '',
    cameraAngle: scene.cameraAngle || '',
    cameraMovement: scene.cameraMovement || '',
    facialExpression: scene.facialExpression || '',
    eyeDirection: scene.eyeDirection || '',
    environment: scene.environment || '',
    background: scene.background || '',
    lighting: scene.lighting || '',
    props: scene.props || '',
    audioDescription: scene.audioDescription || '',
    durationFormatted: scene.durationFormatted || '6.0s',
    aspectRatio: aspectRatio || '16:9',
    dialogueText: scene.dialogueSegments?.map((d) => d.text).join(' ') || '',
    dialogueTiming: scene.dialogueTiming || scene.timeRangeStr,
    voiceDelivery: scene.voiceDelivery || '',
    wardrobeShirt: scene.wardrobe?.shirt || 'Fitted charcoal black studio crewneck shirt',
    wardrobePants: scene.wardrobe?.pants || 'Dark navy tailored slim-fit chinos',
    wardrobeShoes: scene.wardrobe?.shoes || 'Minimalist white leather low-top sneakers',
    wardrobeWatch: scene.wardrobe?.watch || 'Brushed stainless steel chronograph with black dial',
    wardrobeGlasses: scene.wardrobe?.glasses || 'Modern matte-black rectangular titanium frames',
  });

  const handleRegenerate = () => {
    // Construct updated scene
    const updatedScene: SceneAnalysis = {
      ...scene,
      subject: formData.subject,
      action: formData.action,
      cameraAngle: formData.cameraAngle,
      cameraMovement: formData.cameraMovement,
      facialExpression: formData.facialExpression,
      eyeDirection: formData.eyeDirection,
      environment: formData.environment,
      background: formData.background,
      lighting: formData.lighting,
      props: formData.props,
      audioDescription: formData.audioDescription,
      durationFormatted: formData.durationFormatted,
      dialogueTiming: formData.dialogueTiming,
      voiceDelivery: formData.voiceDelivery,
      wardrobe: {
        shirt: formData.wardrobeShirt,
        pants: formData.wardrobePants,
        shoes: formData.wardrobeShoes,
        watch: formData.wardrobeWatch,
        glasses: formData.wardrobeGlasses,
        accessories: scene.wardrobe?.accessories || 'Subtle black wireless lavalier clip on collar',
      },
      dialogueSegments: [
        {
          id: scene.dialogueSegments?.[0]?.id || `d-${Date.now()}`,
          sceneId: scene.id,
          speaker: 'Om Gio',
          startTime: scene.startTime,
          endTime: scene.endTime,
          formattedStartTime: scene.timeRangeStr.split('—')[0]?.trim() || '00:00',
          formattedEndTime: scene.timeRangeStr.split('—')[1]?.trim() || '00:06',
          text: formData.dialogueText,
          confidence: 1.0,
          language: 'Indonesian',
          emotion: formData.facialExpression,
          delivery: formData.voiceDelivery,
        },
      ],
      isCustomEdited: true,
      generatedPrompt: '',
    };

    // Recompute prompt using strict standard
    updatedScene.generatedPrompt = generateGoogleFlowPrompt(
      updatedScene,
      character,
      recreationMode,
      formData.aspectRatio
    );

    onSaveScene(updatedScene);
    onShowToast(`Scene ${scene.sceneLabel} updated & prompt regenerated!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl bg-[#080d19] border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#050811]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-extrabold text-white text-base font-mono">
              EDIT {scene.sceneLabel} & PROMPT PARAMETERS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subject / Scene Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-slate-400 font-bold uppercase">Scene Visual Summary</label>
              <textarea
                rows={2}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2.5 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Action */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-cyan-400 font-bold uppercase">Om Gio Action Description</label>
              <textarea
                rows={3}
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                className="w-full rounded-lg bg-slate-900 border border-cyan-500/30 p-2.5 text-white focus:outline-none focus:border-cyan-400"
                placeholder="Om Gio stands facing the lens, gestures smoothly..."
              />
            </div>

            {/* Dialogue */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-emerald-400 font-bold uppercase flex items-center justify-between">
                <span>Exact Spoken Dialogue (Verbatim — Never Summarize!)</span>
                <span className="text-[10px] text-slate-400">Strict Quality Rule</span>
              </label>
              <textarea
                rows={2}
                value={formData.dialogueText}
                onChange={(e) => setFormData({ ...formData, dialogueText: e.target.value })}
                className="w-full rounded-lg bg-slate-900 border border-emerald-500/40 p-2.5 text-white focus:outline-none focus:border-emerald-400 font-serif italic"
                placeholder="Insert complete transcript for this scene..."
              />
            </div>

            {/* Dialogue Timing */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase">Dialogue Timing</label>
              <input
                type="text"
                value={formData.dialogueTiming}
                onChange={(e) => setFormData({ ...formData, dialogueTiming: e.target.value })}
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Voice Delivery */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase">Voice Delivery & Tone</label>
              <input
                type="text"
                value={formData.voiceDelivery}
                onChange={(e) => setFormData({ ...formData, voiceDelivery: e.target.value })}
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Camera Angle & Framing */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase">Camera Angle & Framing</label>
              <input
                type="text"
                value={formData.cameraAngle}
                onChange={(e) => setFormData({ ...formData, cameraAngle: e.target.value })}
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Camera Movement */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase">Camera Movement</label>
              <input
                type="text"
                value={formData.cameraMovement}
                onChange={(e) => setFormData({ ...formData, cameraMovement: e.target.value })}
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Facial Expression */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase">Facial Expression</label>
              <input
                type="text"
                value={formData.facialExpression}
                onChange={(e) => setFormData({ ...formData, facialExpression: e.target.value })}
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Eye Direction */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase">Eye Direction</label>
              <input
                type="text"
                value={formData.eyeDirection}
                onChange={(e) => setFormData({ ...formData, eyeDirection: e.target.value })}
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Lighting */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase">Lighting</label>
              <input
                type="text"
                value={formData.lighting}
                onChange={(e) => setFormData({ ...formData, lighting: e.target.value })}
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Environment */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase">Environment & Studio</label>
              <input
                type="text"
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Props */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase">Props</label>
              <input
                type="text"
                value={formData.props}
                onChange={(e) => setFormData({ ...formData, props: e.target.value })}
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Audio & Ambience */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase">Audio / Sound Effects</label>
              <input
                type="text"
                value={formData.audioDescription}
                onChange={(e) => setFormData({ ...formData, audioDescription: e.target.value })}
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 p-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions with REGENERATE PROMPT (Section 39) */}
        <div className="p-4 border-t border-slate-800 bg-[#050811] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={handleRegenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>REGENERATE PROMPT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
