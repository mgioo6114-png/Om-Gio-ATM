import React from 'react';
import { Sparkles, CheckCircle2, Loader2, ShieldCheck, Film } from 'lucide-react';
import { ANALYSIS_PIPELINE_STEPS } from '../../constants/omGioData';

interface AnalysisProgressModalProps {
  isOpen: boolean;
  currentStepIndex: number;
  currentStepName: string;
  progressPercent: number;
  onCancel?: () => void;
}

export const AnalysisProgressModal: React.FC<AnalysisProgressModalProps> = ({
  isOpen,
  currentStepIndex,
  currentStepName,
  progressPercent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#080d1a] border border-cyan-500/40 p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Glow Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">OM GIO AI ANALYSIS PIPELINE</h3>
              <p className="text-xs text-cyan-400/80 font-mono">Multimodal Vision + Audio Speech Diarization</p>
            </div>
          </div>
          <span className="text-sm font-mono font-bold text-cyan-400 px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/30">
            {progressPercent}%
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              {currentStepName}
            </span>
            <span className="text-slate-400">
              Step {Math.min(currentStepIndex + 1, ANALYSIS_PIPELINE_STEPS.length)} of {ANALYSIS_PIPELINE_STEPS.length}
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step-by-Step Checklist View (scrollable) */}
        <div className="max-h-60 overflow-y-auto pr-1 space-y-1 text-xs font-mono rounded-xl bg-[#050811] p-3 border border-slate-800/80">
          {ANALYSIS_PIPELINE_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step}
                className={`flex items-center justify-between py-1.5 px-2.5 rounded transition-colors ${
                  isCurrent
                    ? 'bg-cyan-950/50 text-cyan-300 font-semibold border-l-2 border-cyan-400'
                    : isCompleted
                    ? 'text-slate-400'
                    : 'text-slate-600 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span>{step}</span>
                </div>
                {isCompleted && <span className="text-[10px] text-emerald-400 font-bold">DONE</span>}
                {isCurrent && <span className="text-[10px] text-cyan-400 font-bold animate-pulse">PROCESSING</span>}
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Identity Lock: 95% Active
          </span>
          <span>Zero Dialogue Skipping Enforced</span>
        </div>
      </div>
    </div>
  );
};
