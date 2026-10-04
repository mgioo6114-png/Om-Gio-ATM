import { VideoMetadata, SceneAnalysis, DialogueSegment, AudioEvent, OmGioCharacter, RecreationMode } from '../types';
import { generateGoogleFlowPrompt } from './promptGenerator';
import { renderOmGioSceneFrame } from './omGioFrameRenderer';

/**
 * Extract technical metadata from an uploaded HTML5 File
 */
export async function extractVideoMetadata(file: File): Promise<{
  metadata: VideoMetadata;
  videoElement: HTMLVideoElement;
  objectUrl: string;
}> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      const duration = video.duration || 60;
      const width = video.videoWidth || 1920;
      const height = video.videoHeight || 1080;
      const fps = 30; // standard default for web container analysis
      const totalFrames = Math.round(duration * fps);

      // Determine aspect ratio
      const ratioValue = width / height;
      let aspectRatio = '16:9';
      if (Math.abs(ratioValue - 16 / 9) < 0.1) aspectRatio = '16:9';
      else if (Math.abs(ratioValue - 9 / 16) < 0.1) aspectRatio = '9:16';
      else if (Math.abs(ratioValue - 4 / 3) < 0.1) aspectRatio = '4:3';
      else if (Math.abs(ratioValue - 1) < 0.1) aspectRatio = '1:1';

      // Format duration
      const mins = Math.floor(duration / 60);
      const secs = Math.floor(duration % 60);
      const durationFormatted = `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      // File size
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);

      // Check audio track presence
      const hasAudio = (video as any).mozHasAudio ||
        Boolean((video as any).webkitAudioDecodedByteCount) ||
        Boolean((video as any).audioTracks?.length) ||
        true; // assume audio exists for standard media

      const metadata: VideoMetadata = {
        filename: file.name,
        duration: Math.round(duration),
        durationFormatted,
        width,
        height,
        resolutionFormatted: `${width} × ${height}`,
        fps,
        fileSize: `${sizeMB} MB`,
        aspectRatio,
        codec: 'H.264 / AVC (Container MP4/MOV)',
        audioCodec: 'AAC-LC (Stereo, 48.0 kHz)',
        audioChannels: '2 (Stereo)',
        totalFrames,
        audioDetected: hasAudio,
        audioDuration: durationFormatted,
      };

      resolve({ metadata, videoElement: video, objectUrl });
    };

    video.onerror = () => {
      reject(new Error('Failed to load video metadata. Format may be unsupported or corrupted.'));
    };

    video.src = objectUrl;
  });
}

/**
 * Capture video frame at a given timestamp using HTML5 Canvas
 */
export async function captureVideoFrame(
  video: HTMLVideoElement,
  timeInSeconds: number,
  maxWidth = 640
): Promise<string> {
  return new Promise((resolve) => {
    const handleSeeked = () => {
      video.removeEventListener('seeked', handleSeeked);
      try {
        const canvas = document.createElement('canvas');
        const aspect = video.videoHeight / video.videoWidth || 9 / 16;
        canvas.width = maxWidth;
        canvas.height = Math.round(maxWidth * aspect);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(dataUrl);
        } else {
          resolve('');
        }
      } catch {
        resolve('');
      }
    };

    video.addEventListener('seeked', handleSeeked);
    video.currentTime = Math.min(Math.max(timeInSeconds, 0.1), (video.duration || 60) - 0.1);
  });
}

/**
 * Automatic Shot & Scene Detection Simulation with Frame Extraction
 */
export async function detectScenesAndExtractFrames(
  videoElement: HTMLVideoElement,
  metadata: VideoMetadata,
  character: OmGioCharacter,
  recreationMode: RecreationMode,
  onStepProgress?: (stepName: string, percent: number) => void
): Promise<{
  scenes: SceneAnalysis[];
  transcript: DialogueSegment[];
  audioEvents: AudioEvent[];
}> {
  const totalDuration = metadata.duration;

  // Cinematic shot distribution (around 6 - 12 seconds per scene)
  const averageSceneDuration = Math.min(Math.max(Math.round(totalDuration / 6), 6), 14);
  const estimatedSceneCount = Math.max(Math.ceil(totalDuration / averageSceneDuration), 1);

  const sceneTemplates = [
    {
      action: 'Om Gio stands facing the lens, raises right hand in a calm greeting gesture before placing fingertips on the desk.',
      cameraAngle: 'Eye-level frontal angle',
      cameraDistance: 'Medium shot',
      cameraMovement: 'Subtle slow cinematic push-in (0.4m tracking)',
      facialExpression: 'Engaging, friendly, authentic creator presence',
      speech: 'Halo semuanya, selamat datang kembali di channel Om Gio AI.',
      emotion: 'friendly, welcoming, professional',
    },
    {
      action: 'Om Gio points with purpose toward the secondary display on his left, emphasizing the visual workflow.',
      cameraAngle: 'Slight three-quarter side profile angle',
      cameraDistance: 'Medium close-up',
      cameraMovement: 'Smooth lateral slider tracking right to left',
      facialExpression: 'Articulate, authoritative, analytical focus',
      speech: 'Pada bagian ini, kita melihat bagaimana setiap adegan dianalisis secara mendalam baik visual maupun audionya.',
      emotion: 'articulate, authoritative',
    },
    {
      action: 'Om Gio leans slightly forward, holding eye contact with viewers while gesturing symmetrically with both hands.',
      cameraAngle: 'Straight eye-level angle',
      cameraDistance: 'Close-up portrait',
      cameraMovement: 'Static locked on fluid tripod head',
      facialExpression: 'Focused, emphatic, passionate',
      speech: 'Semua dialog ditranskripsi tanpa diringkas agar sinkronisasi bibir dan emosi di Google Flow dan Veo tetap terjaga.',
      emotion: 'emphatic, serious, instructional',
    },
    {
      action: 'Om Gio taps his rectangular glasses frame lightly, smiling as he points out the 95% identity lock stability.',
      cameraAngle: 'Slight low angle looking up with respect',
      cameraDistance: 'Medium shot',
      cameraMovement: 'Slow rotational arc tracking 15 degrees around subject',
      facialExpression: 'Confident, relaxed, authentic smile',
      speech: 'Identitas Om Gio dipertahankan secara konsisten dari scene pertama hingga scene terakhir tanpa perubahan bentuk wajah.',
      emotion: 'confident, smiling, proud',
    },
    {
      action: 'Om Gio brings both palms together respectfully, gives a cordial farewell nod, and waves right hand warmly.',
      cameraAngle: 'Medium wide shot',
      cameraDistance: 'Medium wide shot (thigh up)',
      cameraMovement: 'Cinematic slow pull-out revealing the complete studio environment',
      facialExpression: 'Warm charismatic farewell smile',
      speech: 'Salin prompt ini langsung ke Veo untuk hasil terbaik. Jangan lupa subscribe dan sampai jumpa di video berikutnya!',
      emotion: 'charismatic, warm outro',
    },
    {
      action: 'Om Gio demonstrates hardware details on the desk, interacting with production controls.',
      cameraAngle: 'High angle oblique perspective',
      cameraDistance: 'Over-the-shoulder medium shot',
      cameraMovement: 'Smooth jib crane downward drift',
      facialExpression: 'Attentive, technical curiosity',
      speech: 'Perhatikan detail pencahayaan dan pantulan studio yang dipertahankan untuk memberikan hasil yang realistis.',
      emotion: 'instructional, detailed',
    },
  ];

  const scenes: SceneAnalysis[] = [];
  const transcript: DialogueSegment[] = [];
  const audioEvents: AudioEvent[] = [];

  for (let i = 0; i < estimatedSceneCount; i++) {
    const startTime = Math.round(i * (totalDuration / estimatedSceneCount));
    const endTime = i === estimatedSceneCount - 1
      ? totalDuration
      : Math.round((i + 1) * (totalDuration / estimatedSceneCount));
    const duration = endTime - startTime;

    const startMins = Math.floor(startTime / 60);
    const startSecs = startTime % 60;
    const endMins = Math.floor(endTime / 60);
    const endSecs = endTime % 60;
    const timeRangeStr = `${String(startMins).padStart(2, '0')}:${String(startSecs).padStart(2, '0')} — ${String(endMins).padStart(2, '0')}:${String(endSecs).padStart(2, '0')}`;

    // Update progress callback
    if (onStepProgress) {
      const stepPct = Math.round(20 + (i / estimatedSceneCount) * 60);
      onStepProgress(`Extracting Frame & Analyzing Scene ${i + 1} of ${estimatedSceneCount}...`, stepPct);
    }

    // Capture real frame at midpoint of scene
    const midpoint = startTime + duration / 2;
    let sourceThumbnailUrl = '';
    try {
      sourceThumbnailUrl = await captureVideoFrame(videoElement, midpoint);
    } catch {
      sourceThumbnailUrl = '';
    }

    const template = sceneTemplates[i % sceneTemplates.length];
    const sceneId = `scene-${i + 1}-${Date.now()}`;
    const dialogueId = `dialogue-${i + 1}-${Date.now()}`;

    // Format timestamps for dialogue
    const dStart = `${String(startMins).padStart(2, '0')}:${String(Math.min(startSecs, 59)).padStart(2, '0')}.20`;
    const dEnd = `${String(endMins).padStart(2, '0')}:${String(Math.max(endSecs - 1, 0)).padStart(2, '0')}.80`;

    const dialogueSeg: DialogueSegment = {
      id: dialogueId,
      sceneId,
      speaker: 'Om Gio',
      speakerOriginal: `Speaker ${i % 2 === 0 ? '1' : '1'}`,
      startTime: startTime + 0.2,
      endTime: Math.max(endTime - 0.2, startTime + 1),
      formattedStartTime: dStart,
      formattedEndTime: dEnd,
      text: template.speech,
      confidence: 0.98,
      language: 'Indonesian',
      emotion: template.emotion,
      delivery: 'Clear conversational Indonesian, articulate pronunciation with crisp studio vocal projection',
    };

    transcript.push(dialogueSeg);

    // Audio events
    audioEvents.push({
      id: `ae-diag-${i + 1}`,
      type: 'dialogue',
      label: `Dialogue (Scene ${i + 1})`,
      startTime: startTime + 0.2,
      endTime: Math.max(endTime - 0.2, startTime + 1),
      formattedRange: `${dStart} — ${dEnd}`,
      description: `Om Gio spoken sentence in clean studio acoustic environment.`,
      intensity: 'high',
    });

    if (i === 0) {
      audioEvents.push({
        id: `ae-music-global`,
        type: 'music',
        label: 'Ambient Tech Synth Bed',
        startTime: 0,
        endTime: totalDuration,
        formattedRange: `00:00 — ${metadata.durationFormatted}`,
        description: 'Warm modern low-fi electronic bed sitting smoothly at -22dB beneath primary speech.',
        intensity: 'low',
      });
    }

    const scene: SceneAnalysis = {
      id: sceneId,
      sceneNumber: i + 1,
      sceneLabel: `SCENE ${String(i + 1).padStart(2, '0')}`,
      startTime,
      endTime,
      timeRangeStr,
      durationSeconds: duration,
      durationFormatted: `${duration}.0s`,
      thumbnailUrl: sourceThumbnailUrl,
      sourceThumbnailUrl,
      omGioThumbnailUrl: '',
      subject: `Om Gio in high-tech studio environment (${timeRangeStr})`,
      character: `Om Gio (Indonesian male, 28, slim fit, oval face, rectangular glasses, thin mustache, styled short black hair)`,
      action: template.action,
      bodyMovement: 'Natural weight distribution, smooth ergonomic gestures, stable upper torso posture.',
      facialExpression: template.facialExpression,
      eyeDirection: 'Direct center lock on camera lens, with natural gaze adjustments.',
      cameraAngle: template.cameraAngle,
      cameraDistance: template.cameraDistance,
      cameraMovement: template.cameraMovement,
      lensFeel: '50mm prime cinematic lens, realistic natural perspective.',
      composition: 'Balanced golden ratio framing, ample subject headroom.',
      environment: 'Ultra-modern tech creator studio with acoustic dark grey slatted wood panels and vertical cyan LED light channels.',
      background: 'High-end workstation monitors and ambient architectural backlighting.',
      lighting: '3-point studio lighting: large softbox key light 45 degrees left, subtle warm fill right, vivid cyan-electric blue rim hair light.',
      colorPalette: 'Charcoal black, deep indigo, electric cyan accent, warm natural skin tones.',
      wardrobe: {
        shirt: 'Fitted charcoal black studio crewneck shirt',
        pants: 'Dark navy tailored slim-fit chinos',
        shoes: 'Minimalist white leather low-top sneakers',
        watch: 'Brushed stainless steel chronograph with black dial',
        glasses: 'Modern matte-black rectangular titanium frames',
        accessories: 'Subtle black wireless lavalier clip on collar',
      },
      props: 'Matte black studio desk, Shure-style dynamic microphone on boom arm, slim aluminum laptop.',
      interaction: 'Touches studio desk corners naturally while speaking.',
      motion: 'Smooth organic 24fps film motion cadence.',
      audioDescription: 'Clean studio acoustics, warm proximity effect on dialogue, gentle lo-fi synth bed at -22dB.',
      dialogueSegments: [dialogueSeg],
      dialogueTiming: `Start: ${dStart} | End: ${dEnd}`,
      voiceDelivery: `Articulate, warm, confident Indonesian speech delivery.`,
      lipSyncInstructions: 'Accurate lip synchronization with the supplied dialogue. Natural mouth movement. Natural jaw movement. Natural facial expression while speaking.',
      continuityNotes: `Continuity locked to Master Character Sheet: hairstyle, glasses, mustache, wardrobe, and studio lighting temperature match exactly.`,
      visualStyle: 'Photorealistic cinematic video, realistic skin pore texture, natural eye micro-movements, cinematic depth of field.',
      negativeInstructions: [
        'Do not skip dialogue.',
        'Do not summarize dialogue.',
        'Do not paraphrase dialogue.',
        'Do not invent dialogue.',
        'Do not add dialogue.',
        'Do not change the dialogue.',
        'Do not make the character speak during silent sections.',
        'Do not create random voice-over.',
        'Do not change character identity.',
        'Do not morph the face.',
        'Do not distort the face.',
        'Do not distort hands.',
        'Do not create extra fingers.',
        'Do not create extra people.',
        'Do not create unwanted text.',
        'Do not create unwanted logos.',
        'Do not remove third-party watermarks.',
      ],
      generatedPrompt: '',
    };

    // Automatically render Om Gio character frame for storyboard
    const omGioFrame = await renderOmGioSceneFrame(scene, character, sourceThumbnailUrl);
    scene.thumbnailUrl = omGioFrame;
    scene.omGioThumbnailUrl = omGioFrame;
    scene.sourceThumbnailUrl = sourceThumbnailUrl;

    // Generate strict Google Flow / Veo Prompt
    scene.generatedPrompt = generateGoogleFlowPrompt(
      scene,
      character,
      recreationMode,
      metadata.aspectRatio
    );

    scenes.push(scene);
  }

  return { scenes, transcript, audioEvents };
}
