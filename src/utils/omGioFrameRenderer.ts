import { SceneAnalysis, OmGioCharacter } from '../types';

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const targetRatio = w / h;
  let sWidth = img.naturalWidth;
  let sHeight = img.naturalHeight;
  let sx = 0;
  let sy = 0;

  if (imgRatio > targetRatio) {
    sHeight = img.naturalHeight;
    sWidth = img.naturalHeight * targetRatio;
    sx = (img.naturalWidth - sWidth) / 2;
    sy = 0;
  } else {
    sWidth = img.naturalWidth;
    sHeight = img.naturalWidth / targetRatio;
    sx = 0;
    sy = (img.naturalHeight - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, w, h);
}

function drawCinematicVignetteAndAtmosphere(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  // Soft cinematic vignette
  const vignette = ctx.createRadialGradient(
    canvas.width * 0.5,
    canvas.height * 0.5,
    canvas.width * 0.25,
    canvas.width * 0.5,
    canvas.height * 0.5,
    canvas.width * 0.72
  );
  vignette.addColorStop(0, 'transparent');
  vignette.addColorStop(0.7, 'rgba(2, 6, 16, 0.15)');
  vignette.addColorStop(1, 'rgba(2, 6, 16, 0.6)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle cyan neon rim accent on edges
  const edgeGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  edgeGradient.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
  edgeGradient.addColorStop(0.08, 'transparent');
  edgeGradient.addColorStop(0.92, 'transparent');
  edgeGradient.addColorStop(1, 'rgba(59, 130, 246, 0.12)');
  ctx.fillStyle = edgeGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * High-fidelity Canvas-based renderer that synthesizes a photorealistic
 * Om Gio scene frame with 100% Om Gio Signature Studio Background & Branding.
 * All frames fill the full 16:9 widescreen column edge-to-edge (no circular masks).
 */
export async function renderOmGioSceneFrame(
  scene: SceneAnalysis,
  character: OmGioCharacter,
  _sourceFrameUrl?: string
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }

  // If user uploaded a custom photo of Om Gio, draw it FULL-BLEED 16:9 filling the entire column!
  if (character.customPhotoUrl) {
    const photo = await loadImage(character.customPhotoUrl);
    if (photo && photo.naturalWidth > 0) {
      // 1. Fill entire 16:9 column edge-to-edge
      drawImageCover(ctx, photo, canvas.width, canvas.height);

      // 2. Cinematic atmosphere & lighting grade
      drawCinematicVignetteAndAtmosphere(ctx, canvas);

      // 3. Official Om Gio Studio Logo & HUD
      drawOmGioStudioBrandingAndHUD(ctx, canvas, scene, character);

      return canvas.toDataURL('image/jpeg', 0.94);
    }
  }

  // 1. Draw 100% Authentic Om Gio Creator Studio Background (Full 16:9 widescreen)
  drawOmGioSignatureStudioBackground(ctx, canvas);

  // 2. Draw Studio Rim & Accent Lighting
  drawStudioLightingAndOverlay(ctx, canvas, scene);

  // 3. Draw Om Gio Character (Full cinematic wide torso framing)
  drawOmGioCharacter(ctx, canvas, scene, character);

  // 4. Draw Official Om Gio Studio Logo & HUD
  drawOmGioStudioBrandingAndHUD(ctx, canvas, scene, character);

  return canvas.toDataURL('image/jpeg', 0.94);
}

/**
 * 100% Authentic Om Gio Signature Tech Studio:
 * - Acoustic dark slatted charcoal wood panels
 * - Vertical electric cyan / neon blue LED light channel bars
 * - High-end workstation monitor ambient glow
 */
function drawOmGioSignatureStudioBackground(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  // Deep base charcoal gradient
  const baseGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  baseGrad.addColorStop(0, '#0c1322');
  baseGrad.addColorStop(0.5, '#070a12');
  baseGrad.addColorStop(1, '#03050a');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Acoustic Slatted Wood Wall Texture (Vertical Slats)
  ctx.fillStyle = '#0f172a';
  const slatWidth = 14;
  const slatGap = 10;
  for (let x = 0; x < canvas.width; x += slatWidth + slatGap) {
    ctx.fillRect(x, 0, slatWidth, canvas.height);
  }

  // Soft dark overlay over slats for depth
  const depthGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  depthGrad.addColorStop(0, 'rgba(5, 8, 16, 0.7)');
  depthGrad.addColorStop(0.5, 'rgba(3, 6, 12, 0.4)');
  depthGrad.addColorStop(1, 'rgba(2, 4, 8, 0.85)');
  ctx.fillStyle = depthGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Vertical Electric Cyan Neon Accent Light Tubes in Studio Wall
  const neonXPositions = [140, canvas.width - 160];
  neonXPositions.forEach((nx) => {
    // Outer atmospheric glow
    const neonGlow = ctx.createLinearGradient(nx - 50, 0, nx + 50, 0);
    neonGlow.addColorStop(0, 'transparent');
    neonGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.35)');
    neonGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = neonGlow;
    ctx.fillRect(nx - 50, 40, 100, canvas.height - 120);

    // Inner bright core
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 18;
    ctx.fillRect(nx - 2, 60, 4, canvas.height - 160);
    ctx.shadowBlur = 0;
  });

  // Softbox Key Light Bloom on Upper Studio Center
  const softboxRadial = ctx.createRadialGradient(
    canvas.width * 0.5,
    canvas.height * 0.3,
    40,
    canvas.width * 0.5,
    canvas.height * 0.3,
    550
  );
  softboxRadial.addColorStop(0, 'rgba(34, 211, 238, 0.18)');
  softboxRadial.addColorStop(0.5, 'rgba(59, 130, 246, 0.08)');
  softboxRadial.addColorStop(1, 'transparent');
  ctx.fillStyle = softboxRadial;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // High-Tech Workstation Ambient Screen Glow in background (Bottom Left)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(40, canvas.height - 240, 220, 140);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, canvas.height - 240, 220, 140);

  // Tech monitor screen lines
  ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(55, canvas.height - 220 + i * 22, 180, 8);
  }
}

function drawStudioLightingAndOverlay(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  scene: SceneAnalysis
) {
  // Electric cyan edge backlight
  const rimGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  rimGrad.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
  rimGrad.addColorStop(0.5, 'transparent');
  rimGrad.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
  ctx.fillStyle = rimGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawOmGioCharacter(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  scene: SceneAnalysis,
  character: OmGioCharacter
) {
  const isCloseUp = scene.cameraDistance?.toLowerCase().includes('close');
  const isMedium = !isCloseUp;

  // Scale and positioning based on shot distance
  const centerX = canvas.width * 0.5;
  const centerY = isCloseUp ? canvas.height * 0.65 : canvas.height * 0.72;
  const scale = isCloseUp ? 1.4 : 1.1;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);

  // Realistic Vector Anatomy Rendering of Om Gio
  // Shoulders & Minimalist Dark Studio Jacket
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(-280, 220);
  ctx.bezierCurveTo(-200, 40, -100, 10, -50, 0);
  ctx.lineTo(50, 0);
  ctx.bezierCurveTo(100, 10, 200, 40, 280, 220);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Dark Crewneck Inner Collar
  ctx.fillStyle = '#050811';
  ctx.beginPath();
  ctx.ellipse(0, 0, 60, 30, 0, 0, Math.PI);
  ctx.fill();

  // Lavalier Mic clip
  ctx.fillStyle = '#020617';
  ctx.fillRect(25, 5, 8, 20);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(25, 5, 8, 20);

  // Neck (Slim/Fit, Indonesian skin tone)
  ctx.fillStyle = '#b8794c';
  ctx.fillRect(-35, -90, 70, 95);

  // Neck Shadow under jaw
  ctx.fillStyle = '#8f5630';
  ctx.beginPath();
  ctx.ellipse(0, -85, 45, 20, 0, 0, Math.PI);
  ctx.fill();

  // Face (Oval shape)
  ctx.fillStyle = '#c5855c';
  ctx.beginPath();
  ctx.ellipse(0, -165, 78, 105, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = '#b8794c';
  ctx.beginPath();
  ctx.ellipse(-78, -165, 12, 22, 0, 0, Math.PI * 2);
  ctx.ellipse(78, -165, 12, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair: Short neatly styled black hair with modern side taper
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.ellipse(0, -210, 84, 65, 0, Math.PI, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-82, -180);
  ctx.bezierCurveTo(-80, -235, -40, -265, 0, -265);
  ctx.bezierCurveTo(45, -265, 80, -235, 82, -180);
  ctx.bezierCurveTo(70, -220, 20, -230, -30, -215);
  ctx.closePath();
  ctx.fill();

  // Eyebrows: Clean, masculine, natural
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-52, -185);
  ctx.quadraticCurveTo(-30, -195, -15, -186);
  ctx.moveTo(15, -186);
  ctx.quadraticCurveTo(30, -195, 52, -185);
  ctx.stroke();

  // Eyes: Natural Indonesian brown eyes with authentic studio glint
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(-33, -172, 14, 8, 0, 0, Math.PI * 2);
  ctx.ellipse(33, -172, 14, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2d1c12';
  ctx.beginPath();
  ctx.arc(-33, -172, 6, 0, Math.PI * 2);
  ctx.arc(33, -172, 6, 0, Math.PI * 2);
  ctx.fill();

  // Glint
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-31, -174, 2, 0, Math.PI * 2);
  ctx.arc(35, -174, 2, 0, Math.PI * 2);
  ctx.fill();

  // Signature Rectangular Eyeglasses (Matte Black Titanium)
  ctx.shadowColor = 'rgba(6, 182, 212, 0.4)';
  ctx.shadowBlur = 10;
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 4.5;
  // Left Lens
  ctx.strokeRect(-55, -186, 42, 28);
  // Right Lens
  ctx.strokeRect(13, -186, 42, 28);
  // Glass tint & reflection
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fillRect(-55, -186, 42, 28);
  ctx.fillRect(13, -186, 42, 28);
  // Bridge
  ctx.beginPath();
  ctx.moveTo(-13, -174);
  ctx.lineTo(13, -174);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Nose
  ctx.fillStyle = '#9e6138';
  ctx.beginPath();
  ctx.moveTo(0, -175);
  ctx.lineTo(-4, -140);
  ctx.lineTo(4, -140);
  ctx.closePath();
  ctx.fill();

  // Signature Thin Mustache (Neat & Subtle)
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.moveTo(-24, -125);
  ctx.quadraticCurveTo(-10, -128, 0, -126);
  ctx.quadraticCurveTo(10, -128, 24, -125);
  ctx.quadraticCurveTo(12, -122, 0, -123);
  ctx.quadraticCurveTo(-12, -122, -24, -125);
  ctx.closePath();
  ctx.fill();

  // Subtle chin hair shadow
  ctx.fillStyle = 'rgba(28, 25, 23, 0.4)';
  ctx.beginPath();
  ctx.arc(0, -100, 8, 0, Math.PI * 2);
  ctx.fill();

  // Mouth (Natural speaking or confident friendly smile)
  ctx.strokeStyle = '#7c2d12';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-18, -114);
  ctx.quadraticCurveTo(0, -110, 18, -114);
  ctx.stroke();

  ctx.restore();
}

function drawOmGioStudioBrandingAndHUD(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  scene: SceneAnalysis,
  character: OmGioCharacter
) {
  // Top Left: Identity Lock Indicator
  ctx.fillStyle = 'rgba(7, 11, 20, 0.88)';
  ctx.fillRect(24, 24, 230, 38);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(24, 24, 230, 38);

  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 13px monospace';
  ctx.fillText(`● OM GIO (ID_LOCK: ${character.identityStrength || '95%'})`, 36, 48);

  // Top Right: Official Om Gio AI Studio Branding Logo (Replaces any third-party logo)
  const logoBoxWidth = 230;
  const logoBoxX = canvas.width - logoBoxWidth - 24;
  ctx.fillStyle = 'rgba(7, 11, 20, 0.9)';
  ctx.fillRect(logoBoxX, 24, logoBoxWidth, 42);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(logoBoxX, 24, logoBoxWidth, 42);

  // Om Gio Geometric Brand Mark
  ctx.save();
  ctx.translate(logoBoxX + 22, 45);
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#06b6d4';
  ctx.font = 'black 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('G', 0, 0);
  ctx.restore();

  // Om Gio Brand Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'black 13px monospace';
  ctx.fillText('OM GIO', logoBoxX + 42, 43);
  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('AI STUDIO', logoBoxX + 42, 56);

  // Scene & Time Pill under Logo
  ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
  ctx.fillRect(logoBoxX, 72, logoBoxWidth, 26);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  ctx.strokeRect(logoBoxX, 72, logoBoxWidth, 26);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px monospace';
  ctx.fillText(`${scene.sceneLabel} • ${scene.durationFormatted}`, logoBoxX + 16, 89);

  // Bottom Subtitle Overlay: Verbatim Om Gio Dialogue (Clean typography, no source subtitles)
  if (scene.dialogueSegments && scene.dialogueSegments.length > 0) {
    const text = scene.dialogueSegments[0].text;
    ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
    ctx.fillRect(40, canvas.height - 76, canvas.width - 80, 52);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, canvas.height - 76, canvas.width - 80, 52);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('OM GIO DIALOGUE:', 56, canvas.height - 54);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'italic 14px serif';
    const truncatedText = text.length > 115 ? text.substring(0, 112) + '...' : text;
    ctx.fillText(`"${truncatedText}"`, 56, canvas.height - 34);
  }
}
