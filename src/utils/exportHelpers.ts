import { SceneAnalysis, DialogueSegment, Project } from '../types';
import { formatAllPrompts } from './promptGenerator';

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

/**
 * Trigger file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export all scenes as formatted Google Flow TXT
 */
export function exportGoogleFlowTxt(scenes: SceneAnalysis[], projectName: string = 'Om_Gio_Studio') {
  const text = formatAllPrompts(scenes);
  const safeName = projectName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  downloadFile(text, `${safeName}_google_flow_prompts.txt`, 'text/plain');
}

/**
 * Export full project state as JSON
 */
export function exportProjectJson(project: Project) {
  const exportPayload = {
    appName: 'OM GIO AI STUDIO',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    project: {
      id: project.id,
      name: project.name,
      recreationMode: project.recreationMode,
      identityLockStrength: project.identityLockStrength,
      globalLocks: project.globalLocks,
      videoMetadata: project.videoMetadata,
      stats: project.stats,
      qualityCheck: project.qualityCheck,
      character: {
        name: project.character.name,
        age: project.character.age,
        nationality: project.character.nationality,
        style: project.character.style,
      },
      scenes: project.scenes.map((s) => ({
        sceneNumber: s.sceneNumber,
        sceneLabel: s.sceneLabel,
        timeRangeStr: s.timeRangeStr,
        durationSeconds: s.durationSeconds,
        subject: s.subject,
        action: s.action,
        camera: s.cameraAngle,
        cameraMovement: s.cameraMovement,
        facialExpression: s.facialExpression,
        dialogue: s.dialogueSegments.map((d) => ({
          speaker: d.speaker,
          start: d.formattedStartTime,
          end: d.formattedEndTime,
          text: d.text,
        })),
        googleFlowPrompt: s.generatedPrompt,
      })),
      transcript: project.transcript,
      audioEvents: project.audioEvents,
    },
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const safeName = project.name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  downloadFile(jsonStr, `${safeName}_om_gio_project.json`, 'application/json');
}

/**
 * Export Full Transcript in standardized format:
 * [00:00.20]
 * Speaker A:
 * "Halo semuanya."
 */
export function exportFullTranscriptTxt(transcript: DialogueSegment[], projectName: string = 'Om_Gio_Studio') {
  const lines: string[] = [
    '============================================================',
    `OM GIO AI STUDIO — COMPLETE EXACT TRANSCRIPT`,
    `Project: ${projectName}`,
    `Generated: ${new Date().toLocaleString()}`,
    'Rule: Full verbatim spoken content preserved without summary.',
    '============================================================\n',
  ];

  transcript.forEach((d) => {
    lines.push(`[${d.formattedStartTime} → ${d.formattedEndTime}]`);
    lines.push(`${d.speaker}:`);
    lines.push(`"${d.text}"\n`);
  });

  const text = lines.join('\n');
  const safeName = projectName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  downloadFile(text, `${safeName}_transcript.txt`, 'text/plain');
}

/**
 * Export Transcript as standard SRT subtitle file
 */
export function exportTranscriptSrt(transcript: DialogueSegment[], projectName: string = 'Om_Gio_Studio') {
  const formatSrtTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.floor((seconds % 1) * 1000);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
  };

  const blocks = transcript.map((d, index) => {
    const idx = index + 1;
    const startStr = formatSrtTime(d.startTime);
    const endStr = formatSrtTime(d.endTime);
    return `${idx}\n${startStr} --> ${endStr}\n${d.text}\n`;
  });

  const srtContent = blocks.join('\n');
  const safeName = projectName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  downloadFile(srtContent, `${safeName}_subtitles.srt`, 'text/plain');
}
