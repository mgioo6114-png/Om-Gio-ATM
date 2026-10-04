import React, { useState } from 'react';
import {
  Volume2,
  Music,
  Mic,
  PauseCircle,
  Zap,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Project, AudioEvent } from '../../types';

interface AudioTimelineViewProps {
  project: Project;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const AudioTimelineView: React.FC<AudioTimelineViewProps> = ({
  project,
  onShowToast,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<AudioEvent | null>(
    project.audioEvents[0] || null
  );

  const totalDuration = project.videoMetadata?.duration || 60;

  const getEventBadgeColor = (type: AudioEvent['type']) => {
    switch (type) {
      case 'dialogue':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'music':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'pause':
        return 'bg-slate-700/40 text-slate-400 border-slate-600/40';
      case 'sfx':
      case 'keyboard':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  const getEventIcon = (type: AudioEvent['type']) => {
    switch (type) {
      case 'dialogue':
        return <Mic className="w-3.5 h-3.5" />;
      case 'music':
        return <Music className="w-3.5 h-3.5" />;
      case 'pause':
        return <PauseCircle className="w-3.5 h-3.5" />;
      case 'sfx':
      case 'keyboard':
        return <Zap className="w-3.5 h-3.5" />;
      default:
        return <Volume2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#091120] via-[#080d1a] to-[#040812] border border-cyan-500/25 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              AUDIO & DIALOGUE TIMELINE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Total Duration: {project.videoMetadata?.durationFormatted || '00:01:24'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Audio Events & Visual Scrub Timeline</h2>
          <p className="text-xs text-slate-400">
            Section 22 & 23: Multi-track representation of speech dialogue, ambient beds, sound effects, and cadence pauses.
          </p>
        </div>
      </div>

      {/* Visual Multi-Track Scrub Bar */}
      <div className="rounded-2xl bg-[#090d18] border border-slate-800 p-6 space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="font-bold text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            TIMELINE TRACKS (00:00 → {project.videoMetadata?.durationFormatted})
          </span>
          <span className="text-cyan-400 font-semibold">Click any block to inspect audio parameters</span>
        </div>

        {/* Timeline Ruler */}
        <div className="relative h-6 border-b border-slate-800 flex items-end justify-between text-[10px] font-mono text-slate-500 px-1">
          <span>00:00</span>
          <span>{Math.round(totalDuration * 0.25)}s</span>
          <span>{Math.round(totalDuration * 0.5)}s</span>
          <span>{Math.round(totalDuration * 0.75)}s</span>
          <span>{project.videoMetadata?.durationFormatted}</span>
        </div>

        {/* Track 1: Dialogue Track */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
            Track 1: Spoken Dialogue (Om Gio Synchronized)
          </span>
          <div className="relative h-10 bg-slate-900/80 rounded-lg overflow-hidden border border-slate-800">
            {project.transcript.map((diag) => {
              const leftPct = (diag.startTime / totalDuration) * 100;
              const widthPct = Math.max(((diag.endTime - diag.startTime) / totalDuration) * 100, 3);
              const isSelected = selectedEvent?.id === `ae-diag-${diag.sceneId}`;

              return (
                <button
                  key={diag.id}
                  onClick={() => {
                    setSelectedEvent({
                      id: `ae-diag-${diag.id}`,
                      type: 'dialogue',
                      label: `Spoken Dialogue: ${diag.speaker}`,
                      startTime: diag.startTime,
                      endTime: diag.endTime,
                      formattedRange: `${diag.formattedStartTime} — ${diag.formattedEndTime}`,
                      description: diag.text,
                      intensity: 'high',
                    });
                  }}
                  className="absolute top-1 bottom-1 rounded bg-emerald-500/25 hover:bg-emerald-500/40 border border-emerald-500/50 flex items-center px-2 text-[10px] font-mono text-emerald-200 truncate cursor-pointer transition-colors"
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  title={`${diag.formattedStartTime} - ${diag.formattedEndTime}: "${diag.text}"`}
                >
                  <Mic className="w-2.5 h-2.5 mr-1 shrink-0" />
                  <span className="truncate">{diag.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Track 2: Music Bed */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
            Track 2: Background Music & Ambient Bed (-24dB)
          </span>
          <div className="relative h-8 bg-slate-900/80 rounded-lg overflow-hidden border border-slate-800">
            <div
              className="absolute inset-0 bg-blue-500/15 border border-blue-500/30 flex items-center px-3 text-[10px] font-mono text-blue-300"
              title="Continuous background lo-fi synth bed"
            >
              <Music className="w-3 h-3 mr-1.5 shrink-0" />
              <span>Ambient Studio Lo-Fi Synth Bed (Continuous)</span>
            </div>
          </div>
        </div>

        {/* Track 3: Sound Effects / Pauses */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
            Track 3: Foley SFX, Ambient Cues & Speech Pauses
          </span>
          <div className="relative h-8 bg-slate-900/80 rounded-lg overflow-hidden border border-slate-800">
            {project.audioEvents
              .filter((e) => e.type !== 'dialogue' && e.type !== 'music')
              .map((evt) => {
                const leftPct = (evt.startTime / totalDuration) * 100;
                const widthPct = Math.max(((evt.endTime - evt.startTime) / totalDuration) * 100, 4);

                return (
                  <button
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="absolute top-1 bottom-1 rounded bg-amber-500/25 hover:bg-amber-500/40 border border-amber-500/50 flex items-center px-1.5 text-[9px] font-mono text-amber-200 truncate cursor-pointer transition-colors"
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    title={`${evt.formattedRange}: ${evt.label}`}
                  >
                    <Zap className="w-2.5 h-2.5 mr-1 shrink-0" />
                    <span className="truncate">{evt.label}</span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Selected Audio Event Inspector Panel */}
      {selectedEvent && (
        <div className="rounded-2xl bg-[#090d18] border border-cyan-500/30 p-5 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-lg border text-xs ${getEventBadgeColor(selectedEvent.type)}`}>
                {getEventIcon(selectedEvent.type)}
              </span>
              <div>
                <h4 className="text-sm font-bold text-white font-mono">{selectedEvent.label}</h4>
                <p className="text-xs text-cyan-400 font-mono">{selectedEvent.formattedRange}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
              Type: {selectedEvent.type}
            </span>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed font-mono">
            <span className="text-slate-500 block mb-1 font-bold uppercase text-[10px]">Description & Parameters:</span>
            <p className="p-3 rounded-lg bg-[#050811] border border-slate-800 font-serif italic text-sm text-slate-100">
              "{selectedEvent.description}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
