import React, { useState, useRef, useEffect } from 'react';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { VideoUploader } from './components/analyzer/VideoUploader';
import { AnalysisProgressModal } from './components/analyzer/AnalysisProgressModal';
import { SceneGrid } from './components/scenes/SceneGrid';
import { SceneDetailModal } from './components/scenes/SceneDetailModal';
import { SceneEditorModal } from './components/scenes/SceneEditorModal';
import { TranscriptView } from './components/transcript/TranscriptView';
import { CharacterSheetView } from './components/character/CharacterSheetView';
import { AudioTimelineView } from './components/timeline/AudioTimelineView';
import { ProjectsView } from './components/projects/ProjectsView';
import { ExportView } from './components/export/ExportView';
import { SettingsView } from './components/settings/SettingsView';
import { VisualStoryboardModal } from './components/storyboard/VisualStoryboardModal';
import { ToastContainer, ToastMessage } from './components/ui/Toast';
import { getInitializedSampleProject } from './utils/initialProject';
import { detectScenesAndExtractFrames } from './utils/videoProcessor';
import { generateGoogleFlowPrompt } from './utils/promptGenerator';
import { renderOmGioSceneFrame } from './utils/omGioFrameRenderer';
import { convertToUnder11SecondsStoryboard } from './utils/shortStoryboardAdapter';
import { ANALYSIS_PIPELINE_STEPS, OM_GIO_DEFAULT_CHARACTER } from './constants/omGioData';
import { Project, SceneAnalysis, VideoMetadata, IdentityLockStrength } from './types';
import { Plus, X, Sparkles } from 'lucide-react';

export default function App() {
  const [project, setProject] = useState<Project>(getInitializedSampleProject());
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Pipeline Modal State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStepName, setCurrentStepName] = useState(ANALYSIS_PIPELINE_STEPS[0]);
  const [progressPercent, setProgressPercent] = useState(0);

  // Scene Detail / Edit Modal States
  const [selectedSceneForDetail, setSelectedSceneForDetail] = useState<SceneAnalysis | null>(null);
  const [selectedSceneForEdit, setSelectedSceneForEdit] = useState<SceneAnalysis | null>(null);

  // Manual Scene Creation Modal (Section 55)
  const [isManualSceneModalOpen, setIsManualSceneModalOpen] = useState(false);
  const [isStoryboardModalOpen, setIsStoryboardModalOpen] = useState(false);
  const [manualSceneData, setManualSceneData] = useState({
    sceneName: 'SCENE 06',
    startTime: 54,
    endTime: 62,
    action: 'Om Gio turns to camera and gestures toward technical specs on display.',
    dialogue: 'Pastikan untuk selalu memeriksa kembali hasil transkripsi sebelum rendering akhir.',
  });

  // Cached video element for frame extraction
  const loadedVideoRef = useRef<HTMLVideoElement | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateProject = (updated: Partial<Project>) => {
    setProject((prev) => {
      const next = { ...prev, ...updated, updatedAt: new Date().toISOString() };
      return next;
    });
  };

  // Automatically ensure all scenes have their Om Gio rendered frames
  useEffect(() => {
    let isCancelled = false;
    const autoGenerateOmGioFrames = async () => {
      const needsRender = project.scenes.some((s) => !s.omGioThumbnailUrl);
      if (!needsRender) return;

      const updated = await Promise.all(
        project.scenes.map(async (scene) => {
          if (!scene.omGioThumbnailUrl) {
            const frame = await renderOmGioSceneFrame(
              scene,
              project.character,
              scene.sourceThumbnailUrl || scene.thumbnailUrl
            );
            return {
              ...scene,
              omGioThumbnailUrl: frame,
              thumbnailUrl: frame,
              sourceThumbnailUrl: scene.sourceThumbnailUrl || scene.thumbnailUrl,
            };
          }
          return scene;
        })
      );

      if (!isCancelled) {
        setProject((prev) => ({ ...prev, scenes: updated }));
      }
    };

    autoGenerateOmGioFrames();
    return () => {
      isCancelled = true;
    };
  }, [project.scenes.length, project.character.customPhotoUrl]);

  // Video Selected Callback from VideoUploader
  const handleVideoSelected = (file: File, metadata: VideoMetadata, objectUrl: string) => {
    // Create hidden video element to capture frames
    const vid = document.createElement('video');
    vid.src = objectUrl;
    vid.muted = true;
    vid.playsInline = true;
    loadedVideoRef.current = vid;

    handleUpdateProject({
      name: `Recreation: ${file.name.replace(/\.[^/.]+$/, '')}`,
      videoUrl: objectUrl,
      videoFile: file,
      videoMetadata: metadata,
      permissionConfirmed: false,
    });

    showToast(`Video "${file.name}" ingested. Please confirm copyright to proceed.`, 'info');
  };

  // Load Preset Demos
  const handleLoadPreset = (presetType: 'tech' | 'vlog' | 'quick') => {
    const sample = getInitializedSampleProject();
    if (presetType === 'vlog') {
      sample.name = 'Studio Vlog & Creative Direction (Authorized Source)';
      sample.videoMetadata!.filename = 'creator_studio_vlog_omgio.mp4';
      sample.recreationMode = 'INSPIRED RECREATION';
    } else if (presetType === 'quick') {
      sample.name = '30-Second Quick Tech Tips (Authorized Source)';
      sample.videoMetadata!.filename = 'quick_tech_tips_omgio.mp4';
      sample.videoMetadata!.duration = 30;
      sample.videoMetadata!.durationFormatted = '00:00:30';
    }
    setProject(sample);
    showToast(`Loaded ${presetType.toUpperCase()} preset project successfully!`, 'success');
  };

  // Run the 20-step analysis pipeline
  const handleStartAnalysis = async () => {
    if (!project.permissionConfirmed) {
      showToast('You must confirm copyright permission first.', 'warning');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStepIndex(0);
    setProgressPercent(2);

    try {
      const totalSteps = ANALYSIS_PIPELINE_STEPS.length;

      // Sequential progress step simulator for smooth real-time feedback
      for (let i = 0; i < totalSteps; i++) {
        setCurrentStepIndex(i);
        setCurrentStepName(ANALYSIS_PIPELINE_STEPS[i]);
        setProgressPercent(Math.round(((i + 1) / totalSteps) * 100));
        // Short realistic delay between steps
        await new Promise((res) => setTimeout(res, 180));
      }

      // If a real video file is present, extract actual frame thumbnails & shot segments
      if (loadedVideoRef.current && project.videoMetadata) {
        const { scenes, transcript, audioEvents } = await detectScenesAndExtractFrames(
          loadedVideoRef.current,
          project.videoMetadata,
          project.character,
          project.recreationMode
        );

        handleUpdateProject({
          scenes,
          transcript,
          audioEvents,
          stats: {
            ...project.stats,
            sceneCount: scenes.length,
            dialogueCount: transcript.length,
            promptsGeneratedCount: scenes.length,
          },
        });
      } else {
        // Fallback / preset recalculation: re-generate all prompts with strict format
        const updatedScenes = project.scenes.map((s) => {
          s.generatedPrompt = generateGoogleFlowPrompt(
            s,
            project.character,
            project.recreationMode,
            project.videoMetadata?.aspectRatio || '16:9'
          );
          return s;
        });
        handleUpdateProject({ scenes: updatedScenes });
      }

      setIsAnalyzing(false);
      showToast('Analysis complete! All scene prompts generated for Om Gio.', 'success');
      setCurrentTab('scene-generator');
    } catch (err: any) {
      setIsAnalyzing(false);
      showToast(`Analysis error: ${err.message || 'Unknown error'}`, 'warning');
    }
  };

  // Handle single scene prompt regeneration
  const handleRegenerateScene = async (sceneToRegen: SceneAnalysis) => {
    const regeneratedPrompt = generateGoogleFlowPrompt(
      sceneToRegen,
      project.character,
      project.recreationMode,
      project.videoMetadata?.aspectRatio || '16:9'
    );

    const updatedScenes = project.scenes.map((s) =>
      s.id === sceneToRegen.id ? { ...s, generatedPrompt: regeneratedPrompt } : s
    );

    handleUpdateProject({ scenes: updatedScenes });
    showToast(`Prompt for ${sceneToRegen.sceneLabel} regenerated successfully!`, 'success');
  };

  // Add Manual Scene (Section 55)
  const handleCreateManualScene = () => {
    const newSceneNumber = project.scenes.length + 1;
    const duration = manualSceneData.endTime - manualSceneData.startTime;
    const sceneId = `scene-${newSceneNumber}-${Date.now()}`;
    const dStart = `00:${String(manualSceneData.startTime).padStart(2, '0')}.00`;
    const dEnd = `00:${String(manualSceneData.endTime).padStart(2, '0')}.00`;

    const newDialogue = {
      id: `diag-manual-${Date.now()}`,
      sceneId,
      speaker: 'Om Gio',
      startTime: manualSceneData.startTime,
      endTime: manualSceneData.endTime,
      formattedStartTime: dStart,
      formattedEndTime: dEnd,
      text: manualSceneData.dialogue,
      confidence: 1.0,
      language: 'Indonesian',
      emotion: 'confident, articulate',
      delivery: 'Clear studio speech projection',
    };

    const newScene: SceneAnalysis = {
      id: sceneId,
      sceneNumber: newSceneNumber,
      sceneLabel: manualSceneData.sceneName || `SCENE ${String(newSceneNumber).padStart(2, '0')}`,
      startTime: manualSceneData.startTime,
      endTime: manualSceneData.endTime,
      timeRangeStr: `${dStart} — ${dEnd}`,
      durationSeconds: duration,
      durationFormatted: `${duration}.0s`,
      thumbnailUrl: '',
      subject: `Om Gio in studio sequence (${dStart} — ${dEnd})`,
      character: 'Om Gio (Indonesian male, 28, slim fit, oval face, rectangular glasses, thin mustache, styled short black hair)',
      action: manualSceneData.action,
      bodyMovement: 'Natural weight distribution, smooth ergonomic gestures.',
      facialExpression: 'Engaging, confident, friendly creator micro-smiles.',
      eyeDirection: 'Direct lock on camera lens.',
      cameraAngle: 'Eye-level angle, medium shot.',
      cameraDistance: 'Medium shot (chest up).',
      cameraMovement: 'Cinematic slow push in.',
      lensFeel: '50mm prime cinematic lens.',
      composition: 'Golden ratio center framing.',
      environment: 'Ultra-modern tech creator studio with acoustic dark grey slatted wood panels and vertical cyan LED light channels.',
      background: 'High-end workstation monitors and ambient architectural backlighting.',
      lighting: '3-point studio lighting: softbox key light 45 degrees left, subtle warm fill right, cyan rim hair light.',
      colorPalette: 'Charcoal black, deep indigo, electric cyan accent, warm natural skin tones.',
      wardrobe: {
        shirt: 'Fitted charcoal black studio crewneck shirt',
        pants: 'Dark navy tailored slim-fit chinos',
        shoes: 'Minimalist white leather low-top sneakers',
        watch: 'Brushed stainless steel chronograph with black dial',
        glasses: 'Modern matte-black rectangular titanium frames',
        accessories: 'Subtle black wireless lavalier clip on collar',
      },
      props: 'Desk setup and dynamic boom microphone.',
      interaction: 'Gestures smoothly while articulating speech.',
      motion: 'Smooth organic 24fps film motion cadence.',
      audioDescription: 'Clean studio acoustics, warm vocal presence, gentle lo-fi synth bed at -24dB.',
      dialogueSegments: [newDialogue],
      dialogueTiming: `Start: ${dStart} | End: ${dEnd}`,
      voiceDelivery: 'Clear, articulate Indonesian creator delivery.',
      lipSyncInstructions: 'Accurate lip synchronization with the supplied dialogue. Natural mouth movement. Natural jaw movement. Natural facial expression while speaking.',
      continuityNotes: 'Identity and wardrobe locked to Master Om Gio reference.',
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

    newScene.generatedPrompt = generateGoogleFlowPrompt(
      newScene,
      project.character,
      project.recreationMode,
      project.videoMetadata?.aspectRatio || '16:9'
    );

    handleUpdateProject({
      scenes: [...project.scenes, newScene],
      transcript: [...project.transcript, newDialogue],
    });

    setIsManualSceneModalOpen(false);
    showToast(`Manual scene "${newScene.sceneLabel}" created and prompt generated!`, 'success');
  };

  // Reset to brand new empty project
  const handleNewProject = () => {
    if (confirm('Create a new project? Your current work is saved in memory.')) {
      const freshProject: Project = {
        id: `proj-${Date.now()}`,
        name: 'New Video Recreation Project',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissionConfirmed: false,
        recreationMode: 'EXACT RECREATION',
        character: OM_GIO_DEFAULT_CHARACTER,
        identityLockStrength: '95%',
        globalLocks: {
          characterLock: true,
          wardrobeLock: true,
          locationLock: true,
          lightingContinuity: true,
          visualStyleLock: true,
        },
        userBranding: {
          enabled: true,
          brandText: 'OM GIO AI',
          position: 'top-right',
          opacity: 85,
        },
        scenes: [],
        transcript: [],
        audioEvents: [],
        stats: {
          totalDuration: 0,
          totalDurationStr: '00:00:00',
          speechDuration: 0,
          speechDurationStr: '00:00:00',
          speakerCount: 0,
          dialogueCount: 0,
          wordCount: 0,
          unclearCount: 0,
          unmappedCount: 0,
          sceneCount: 0,
          promptsGeneratedCount: 0,
        },
        qualityCheck: {
          characterIdentity: true,
          sceneTiming: true,
          action: true,
          camera: true,
          cameraMovement: true,
          environment: true,
          lighting: true,
          wardrobe: true,
          expression: true,
          dialogue: true,
          dialogueTiming: true,
          speaker: true,
          audio: true,
          continuity: true,
          duration: true,
          aspectRatio: true,
        },
        missingDialogueWarnings: [],
      };
      setProject(freshProject);
      setCurrentTab('create-project');
      showToast('New project created. Please upload an authorized source video.', 'info');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#050811] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} project={project} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Studio Top Header */}
        <Header
          project={project}
          onUpdateProject={handleUpdateProject}
          onOpenExport={() => setCurrentTab('exports')}
          onNewProject={handleNewProject}
          onShowToast={showToast}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {currentTab === 'dashboard' && (
            <DashboardView
              project={project}
              onNavigate={setCurrentTab}
              onNewProject={handleNewProject}
              onShowToast={showToast}
            />
          )}

          {(currentTab === 'create-project' || currentTab === 'video-analyzer') && (
            <VideoUploader
              project={project}
              onVideoSelected={handleVideoSelected}
              onStartAnalysis={handleStartAnalysis}
              onUpdateProject={handleUpdateProject}
              onLoadPreset={handleLoadPreset}
            />
          )}

          {currentTab === 'scene-generator' && (
            <SceneGrid
              project={project}
              onViewPrompt={(scene) => setSelectedSceneForDetail(scene)}
              onEditScene={(scene) => setSelectedSceneForEdit(scene)}
              onRegenerateScene={handleRegenerateScene}
              onAddSceneManually={() => setIsManualSceneModalOpen(true)}
              onOpenExport={() => setCurrentTab('exports')}
              onOpenStoryboardModal={() => setIsStoryboardModalOpen(true)}
              onUploadCharacterPhoto={async (photoUrl) => {
                showToast('Menerapkan foto Om Gio memenuhi seluruh kolom frame 16:9...', 'info');
                const updatedCharacter = {
                  ...project.character,
                  customPhotoUrl: photoUrl,
                  customUploaded: true,
                };
                const updatedScenes = await Promise.all(
                  project.scenes.map(async (scene) => {
                    const frame = await renderOmGioSceneFrame(scene, updatedCharacter);
                    return {
                      ...scene,
                      omGioThumbnailUrl: frame,
                      thumbnailUrl: frame,
                    };
                  })
                );
                handleUpdateProject({
                  character: updatedCharacter,
                  scenes: updatedScenes,
                });
                showToast('Foto Om Gio berhasil diterapkan memenuhi seluruh kolom (16:9 Penuh)!', 'success');
              }}
              onRenderAllOmGioFrames={async () => {
                showToast('Merender ulang seluruh frame adegan memenuhi kolom 16:9 penuh...', 'info');
                const updated = await Promise.all(
                  project.scenes.map(async (scene) => {
                    const frame = await renderOmGioSceneFrame(
                      scene,
                      project.character,
                      scene.sourceThumbnailUrl || scene.thumbnailUrl
                    );
                    return {
                      ...scene,
                      omGioThumbnailUrl: frame,
                      thumbnailUrl: frame,
                      sourceThumbnailUrl: scene.sourceThumbnailUrl || scene.thumbnailUrl,
                    };
                  })
                );
                handleUpdateProject({ scenes: updated });
                showToast('Seluruh frame storyboard kini memenuhi kolom 16:9 penuh!', 'success');
              }}
              onConvertToShortFormat={() => {
                const shortProject = convertToUnder11SecondsStoryboard(project);
                setProject(shortProject);
                showToast('Storyboard berhasil dipangkas menjadi 10.5 detik (format ideal Google Veo & Shorts)!', 'success');
              }}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'transcript' && (
            <div className="space-y-6">
              <TranscriptView
                project={project}
                onUpdateProject={handleUpdateProject}
                onShowToast={showToast}
              />
              <AudioTimelineView project={project} onShowToast={showToast} />
            </div>
          )}

          {currentTab === 'character-library' && (
            <CharacterSheetView
              character={project.character}
              identityLockStrength={project.identityLockStrength}
              onUpdateIdentityLock={(strength) =>
                handleUpdateProject({ identityLockStrength: strength })
              }
              onUploadPhoto={async (photoUrl) => {
                showToast('Menerapkan Lembar Karakter Om Gio dan memperbarui seluruh frame 16:9...', 'info');
                const updatedCharacter = {
                  ...project.character,
                  customPhotoUrl: photoUrl,
                  customUploaded: true,
                };
                const updatedScenes = await Promise.all(
                  project.scenes.map(async (scene) => {
                    const frame = await renderOmGioSceneFrame(scene, updatedCharacter);
                    return {
                      ...scene,
                      omGioThumbnailUrl: frame,
                      thumbnailUrl: frame,
                    };
                  })
                );
                handleUpdateProject({
                  character: updatedCharacter,
                  scenes: updatedScenes,
                });
                showToast('Karakter Sheet Om Gio berhasil dikunci ke seluruh storyboard!', 'success');
              }}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsView
              currentProject={project}
              onSelectProject={(p) => setProject(p)}
              onNewProject={handleNewProject}
              onDeleteProject={handleNewProject}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'exports' && (
            <ExportView
              project={project}
              onUpdateProject={handleUpdateProject}
              onOpenStoryboardModal={() => setIsStoryboardModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              project={project}
              onUpdateProject={handleUpdateProject}
              onDeleteAllData={handleNewProject}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* 20-Step Pipeline Progress Modal */}
      <AnalysisProgressModal
        isOpen={isAnalyzing}
        currentStepIndex={currentStepIndex}
        currentStepName={currentStepName}
        progressPercent={progressPercent}
      />

      {/* View Prompt Modal */}
      <SceneDetailModal
        scene={selectedSceneForDetail}
        onClose={() => setSelectedSceneForDetail(null)}
        onShowToast={showToast}
      />

      {/* Edit Scene Modal (Section 39) */}
      <SceneEditorModal
        scene={selectedSceneForEdit}
        character={project.character}
        recreationMode={project.recreationMode}
        aspectRatio={project.videoMetadata?.aspectRatio || '16:9'}
        onClose={() => setSelectedSceneForEdit(null)}
        onSaveScene={(updatedScene) => {
          const updatedScenes = project.scenes.map((s) =>
            s.id === updatedScene.id ? updatedScene : s
          );
          handleUpdateProject({ scenes: updatedScenes });
          setSelectedSceneForEdit(null);
        }}
        onShowToast={showToast}
      />

      {/* Manual Scene Creation Modal (Section 55) */}
      {isManualSceneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#080d19] border border-cyan-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                CREATE SCENE MANUALLY (SECTION 55)
              </h3>
              <button
                onClick={() => setIsManualSceneModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Scene Label</label>
                <input
                  type="text"
                  value={manualSceneData.sceneName}
                  onChange={(e) =>
                    setManualSceneData({ ...manualSceneData, sceneName: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Start Time (sec)</label>
                  <input
                    type="number"
                    value={manualSceneData.startTime}
                    onChange={(e) =>
                      setManualSceneData({
                        ...manualSceneData,
                        startTime: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">End Time (sec)</label>
                  <input
                    type="number"
                    value={manualSceneData.endTime}
                    onChange={(e) =>
                      setManualSceneData({
                        ...manualSceneData,
                        endTime: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Action Description</label>
                <textarea
                  rows={2}
                  value={manualSceneData.action}
                  onChange={(e) =>
                    setManualSceneData({ ...manualSceneData, action: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-emerald-400 block mb-1">
                  Exact Dialogue (Never Summarize)
                </label>
                <textarea
                  rows={2}
                  value={manualSceneData.dialogue}
                  onChange={(e) =>
                    setManualSceneData({ ...manualSceneData, dialogue: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-serif italic"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsManualSceneModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateManualScene}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md cursor-pointer"
              >
                GENERATE PROMPT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Storyboard Print / Download Modal */}
      <VisualStoryboardModal
        isOpen={isStoryboardModalOpen}
        project={project}
        onClose={() => setIsStoryboardModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
