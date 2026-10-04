export type RecreationMode = 'EXACT RECREATION' | 'INSPIRED RECREATION' | 'CINEMATIC UPGRADE';
export type IdentityLockStrength = '80%' | '85%' | '90%' | '95%' | '100%';
export type BrandingPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface VideoMetadata {
  filename: string;
  duration: number; // in seconds
  durationFormatted: string; // e.g. "00:01:24"
  width: number;
  height: number;
  resolutionFormatted: string; // "1920 × 1080"
  fps: number;
  fileSize: string; // "34.2 MB"
  aspectRatio: string; // "16:9" | "9:16" | "4:3"
  codec: string; // "H.264 / AVC"
  audioCodec: string; // "AAC-LC"
  audioChannels: string; // "2 (Stereo)"
  totalFrames: number;
  audioDetected: boolean;
  audioDuration: string;
}

export interface OmGioCharacter {
  id: string;
  name: string;
  age: number;
  gender: string;
  nationality: string;
  bodyType: string;
  faceShape: string;
  hair: string;
  eyewear: string;
  facialHair: string;
  skinTone: string;
  style: string;
  identityLock: boolean;
  identityStrength: IdentityLockStrength;
  customUploaded?: boolean;
  customPhotoUrl?: string;
  sheetAngles: {
    front: string;
    leftProfile: string;
    rightProfile: string;
    threeQuarter: string;
    fullBody: string;
    expressions: {
      smile: string;
      neutral: string;
      serious: string;
    };
    closeups: {
      glasses: string;
      mustache: string;
      watch: string;
      shoes: string;
    };
  };
}

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

export interface DialogueSegment {
  id: string;
  sceneId?: string;
  speaker: string; // "Speaker 1" or "Om Gio"
  speakerOriginal?: string;
  startTime: number; // seconds
  endTime: number; // seconds
  formattedStartTime: string; // "00:00.20"
  formattedEndTime: string; // "00:02.10"
  text: string; // exact dialogue, NEVER summarized!
  confidence: number; // 0.0 - 1.0
  language: string; // "Indonesian", "English", etc.
  emotion: string; // "confident", "serious", "enthusiastic"
  delivery: string; // "Fast-paced articulation, clear studio vocal projection"
  pronunciationNotes?: string;
  words?: WordTimestamp[];
  isUnclear?: boolean;
  needsReview?: boolean;
}

export interface AudioEvent {
  id: string;
  type: 'dialogue' | 'pause' | 'music' | 'sfx' | 'applause' | 'ambient' | 'keyboard';
  label: string;
  startTime: number;
  endTime: number;
  formattedRange: string;
  description: string;
  intensity?: 'low' | 'medium' | 'high';
}

export interface WardrobeSpec {
  shirt: string;
  pants: string;
  shoes: string;
  watch: string;
  glasses: string;
  accessories: string;
}

export interface SceneAnalysis {
  id: string;
  sceneNumber: number;
  sceneLabel: string; // "SCENE 01"
  startTime: number;
  endTime: number;
  timeRangeStr: string; // "00:00 — 00:06"
  durationSeconds: number;
  durationFormatted: string; // "6.0s"
  thumbnailUrl: string;
  sourceThumbnailUrl?: string;
  omGioThumbnailUrl?: string;

  subject: string;
  character: string;
  action: string;
  bodyMovement: string;
  facialExpression: string;
  eyeDirection: string;
  cameraAngle: string;
  cameraDistance: string;
  cameraMovement: string;
  lensFeel: string;
  composition: string;
  environment: string;
  background: string;
  lighting: string;
  colorPalette: string;
  wardrobe: WardrobeSpec;
  props: string;
  interaction: string;
  motion: string;

  // Audio & Dialogue
  audioDescription: string;
  dialogueSegments: DialogueSegment[];
  dialogueTiming: string;
  voiceDelivery: string;
  lipSyncInstructions: string;
  continuityNotes: string;
  visualStyle: string;
  negativeInstructions: string[];

  // Output
  generatedPrompt: string;
  needsReview?: boolean;
  isCustomEdited?: boolean;
}

export interface ProjectStats {
  totalDuration: number;
  totalDurationStr: string;
  speechDuration: number;
  speechDurationStr: string;
  speakerCount: number;
  dialogueCount: number;
  wordCount: number;
  unclearCount: number;
  unmappedCount: number;
  sceneCount: number;
  promptsGeneratedCount: number;
}

export interface ProjectQualityCheck {
  characterIdentity: boolean;
  sceneTiming: boolean;
  action: boolean;
  camera: boolean;
  cameraMovement: boolean;
  environment: boolean;
  lighting: boolean;
  wardrobe: boolean;
  expression: boolean;
  dialogue: boolean;
  dialogueTiming: boolean;
  speaker: boolean;
  audio: boolean;
  continuity: boolean;
  duration: boolean;
  aspectRatio: boolean;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  videoUrl?: string;
  videoFile?: File;
  videoMetadata?: VideoMetadata;
  permissionConfirmed: boolean;
  recreationMode: RecreationMode;
  character: OmGioCharacter;
  identityLockStrength: IdentityLockStrength;
  globalLocks: {
    characterLock: boolean;
    wardrobeLock: boolean;
    locationLock: boolean;
    lightingContinuity: boolean;
    visualStyleLock: boolean;
  };
  userBranding: {
    enabled: boolean;
    brandText: 'OM GIO' | 'OM GIO AI';
    position: BrandingPosition;
    opacity: number; // 20 - 100
  };
  scenes: SceneAnalysis[];
  transcript: DialogueSegment[];
  audioEvents: AudioEvent[];
  stats: ProjectStats;
  qualityCheck: ProjectQualityCheck;
  missingDialogueWarnings: {
    id: string;
    timeRange: string;
    startTime: number;
    endTime: number;
    reason: string;
    status: 'Needs Review' | 'Resolved';
  }[];
}
