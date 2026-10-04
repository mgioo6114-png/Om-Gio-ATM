import { SceneAnalysis, OmGioCharacter, RecreationMode } from '../types';

/**
 * Generates the standardized Google Flow / Veo Prompt
 * Following the strict 25+ section prompt specification from OM GIO AI Master Prompt
 */
export function generateGoogleFlowPrompt(
  scene: SceneAnalysis,
  character: OmGioCharacter,
  recreationMode: RecreationMode = 'EXACT RECREATION',
  aspectRatio: string = '16:9'
): string {
  // Combine all dialogue segments for this scene into complete, exact unsummarized text
  let exactDialogueText = '';
  let dialogueLanguage = 'Indonesian';
  let dialogueStart = scene.timeRangeStr.split('—')[0]?.trim() || '00:00';
  let dialogueEnd = scene.timeRangeStr.split('—')[1]?.trim() || '00:06';

  if (scene.dialogueSegments && scene.dialogueSegments.length > 0) {
    exactDialogueText = scene.dialogueSegments.map((d) => d.text.trim()).join(' ');
    dialogueLanguage = scene.dialogueSegments[0]?.language || 'Indonesian';
    dialogueStart = scene.dialogueSegments[0]?.formattedStartTime || dialogueStart;
    dialogueEnd = scene.dialogueSegments[scene.dialogueSegments.length - 1]?.formattedEndTime || dialogueEnd;
  } else {
    exactDialogueText = '[No spoken dialogue in this scene. Character maintains natural resting posture without speech or mouth motion.]';
  }

  // Format wardrobe line
  const wardrobeDesc = scene.wardrobe
    ? `${scene.wardrobe.shirt}, ${scene.wardrobe.pants}, ${scene.wardrobe.shoes}, ${scene.wardrobe.glasses}, ${scene.wardrobe.watch}${scene.wardrobe.accessories ? `, ${scene.wardrobe.accessories}` : ''}`
    : 'Minimalist charcoal dark navy fitted studio jacket, black inner t-shirt, rectangular glasses, silver wrist watch';

  // Mode-specific visual style enhancements
  let visualStyleBlock = `Photorealistic cinematic video.
Natural human anatomy.
Natural skin texture.
Realistic lighting.
Realistic shadows.
Natural eye movement.
Natural blinking.
Natural facial movement.
Realistic cinematic depth of field.`;

  if (recreationMode === 'CINEMATIC UPGRADE') {
    visualStyleBlock = `High-end 8K cinematic commercial aesthetic.
Anamorphic prime lens bokeh with shallow depth of field (f/1.8).
Volumetric key lighting and subtle cyan-tungsten rim separation.
Natural human anatomy and ultra-crisp skin pore texture.
Subtle organic film grain, photorealistic color grading.
Natural micro-expressions, lifelike eye saccades and natural blinking rate.`;
  } else if (recreationMode === 'INSPIRED RECREATION') {
    visualStyleBlock = `Contemporary dynamic tech creator visual aesthetic.
Clean modern digital cinematography with natural high-dynamic range.
Accurate human proportions and detailed physical materials.
Natural eye contact, dynamic expressive pacing, authentic environmental light.`;
  }

  // Lip-sync rules: strictly state whether lips move or remain still
  let lipSyncBlock = '';
  if (scene.dialogueSegments && scene.dialogueSegments.length > 0) {
    lipSyncBlock = `Accurate lip synchronization with the supplied dialogue.
Natural mouth movement.
Natural jaw movement.
Natural facial expression while speaking.
Speech-synchronized mouth movement. Natural tongue and lip placement.`;
  } else {
    lipSyncBlock = `Character is not speaking during this segment.
Mouth remains naturally closed or in resting natural facial expression.
Do not move lips or simulate phantom speech.`;
  }

  const prompt = `SCENE ${String(scene.sceneNumber).padStart(2, '0')}
TIME: ${scene.timeRangeStr}

CHARACTER REFERENCE:
Strictly anchor to the Om Gio Character Sheet (Identity Reference Sheet): 28-year-old Indonesian male, Kurus / Fit athletic slim build, Oval face shape, short jet-black hair neatly combed with modern side taper (Pendek Tersisir Rapi), thin black rectangular wireframe glasses, thin groomed mustache and subtle soul patch, warm Indonesian light-tan skin tone (Sawo Matang Cerah #D59A72).

CHARACTER & BIOMETRIC IDENTITY LOCK:
Maintain 100% anatomical and facial continuity matching the Om Gio 360 turnaround character sheet across all shots (Front, Left Profile, Right Profile, 3/4 View, Full Body). Do not alter his facial proportions, bone structure, eye shape, mustache grooming, or glasses geometry.
Identity Strength: ${character.identityStrength || '95%'}.

WARDROBE (CHARACTER SHEET SPEC):
Kaos Polos Hitam (solid matte black short-sleeve crewneck t-shirt), Celana Cargo Hitam (relaxed multi-pocket utility cargo pants), Sneakers Putih (white athletic performance running shoes), Jam Tangan Sporty Hitam (tactical black chronograph wristwatch on left wrist).

SCENE:
${scene.subject || 'Om Gio in a high-end modern professional studio setting with clean architectural elements.'}

ACTION:
${scene.action || 'Om Gio stands facing slightly off-center, gesturing smoothly with his right hand toward the display screen before looking directly back into camera.'}

BODY MOVEMENT:
${scene.bodyMovement || 'Smooth natural weight shift, subtle fluid arm gestures, natural micro-adjustments in torso posture.'}

FACIAL EXPRESSION:
${scene.facialExpression || 'Confident, engaged, clear articulate speaking expression with subtle friendly micro-smiles.'}

EYE DIRECTION:
${scene.eyeDirection || 'Direct eye contact with the camera lens, followed by brief focus on desk props, then returning to viewer.'}

CAMERA:
${scene.cameraAngle || 'Eye-level angle, medium shot framing from chest up.'}

CAMERA MOVEMENT:
${scene.cameraMovement || 'Slow cinematic push-in tracking shot on smooth mechanical slider.'}

COMPOSITION:
${scene.composition || 'Rule of thirds placement, subject positioned slightly right of center, comfortable headroom.'}

ENVIRONMENT:
Om Gio Signature Tech Creator Studio. Ultra-modern interior featuring vertical acoustic dark charcoal wood slat panels, embedded vertical cyan-blue LED neon channel accent lighting, and clean architectural lines.

BACKGROUND:
Minimalist creator workstation background with ambient backlighting from dual high-resolution studio monitors, no distracting clutter, no foreign logos or posters. Soft natural cinematic depth separation.

BRANDING & LOGOS:
Om Gio AI Studio visual identity only. Strip and omit all original source video watermarks, channel logos, sponsor banners, lower-third graphics, and hardcoded subtitle overlays from the recreation.

LIGHTING:
Soft 3-point cinematic creator lighting: large diffused key light at 45 degrees left, subtle warm fill on right, vivid electric cyan-blue rim hair separation light highlighting Om Gio's shoulders and neat hair.

WARDROBE:
${wardrobeDesc}

PROPS:
${scene.props || 'Modern aluminum wireless keyboard, studio microphone on boom arm, minimalist ceramic coffee mug.'}

MOTION:
${scene.motion || 'Natural fluid human motion, 24fps organic cinematic shutter cadence.'}

DIALOGUE / SPOKEN CONTENT:
Speaker:
Om Gio

Exact dialogue:
"${exactDialogueText}"

LANGUAGE:
${dialogueLanguage}

DIALOGUE TIMING:
Start:
${dialogueStart}

End:
${dialogueEnd}

VOICE DELIVERY:
${scene.voiceDelivery || 'Clear, confident, authoritative yet approachable Indonesian tech presenter tone with articulate phrasing.'}

LIP SYNC:
${lipSyncBlock}

AUDIO:
${scene.audioDescription || 'Subtle ambient studio room tone, low frequency warmth, clean dialogue prominence without background hiss.'}

CONTINUITY:
Maintain continuity with previous and following scenes: character posture, wardrobe locks, studio lighting index, and eyeline match.

VISUAL STYLE:
${visualStyleBlock}

NEGATIVE INSTRUCTIONS:
Do not skip dialogue.
Do not summarize dialogue.
Do not paraphrase dialogue.
Do not invent dialogue.
Do not add dialogue.
Do not change the dialogue.
Do not make the character speak during silent sections.
Do not create random voice-over.
Do not change character identity.
Do not morph the face.
Do not distort the face.
Do not distort hands.
Do not create extra fingers.
Do not create extra people.
Do not create unwanted text.
Do not create unwanted logos.
Do not reproduce any logos, text overlays, or watermarks from the original source video.
Do not recreate foreign channel branding or third-party sponsor marks.

DURATION:
${scene.durationFormatted || `${scene.durationSeconds}s`}

ASPECT RATIO:
${aspectRatio}`;

  return prompt;
}

/**
 * Combines all scene prompts into the master output format
 * requested in Section 41 (COPY ALL PROMPTS)
 */
export function formatAllPrompts(scenes: SceneAnalysis[]): string {
  return scenes
    .map((s) => {
      const header = `========================\nSCENE ${String(s.sceneNumber).padStart(2, '0')}\n========================\n`;
      return `${header}\n${s.generatedPrompt.trim()}`;
    })
    .join('\n\n\n');
}
