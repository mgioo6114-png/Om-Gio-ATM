import JSZip from 'jszip';
import { Project, SceneAnalysis, OmGioCharacter } from '../types';
import { renderOmGioSceneFrame } from './omGioFrameRenderer';
import { formatAllPrompts } from './promptGenerator';

/**
 * Downloads a data URL or blob as a direct file
 */
export function triggerFileDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Ensures a high-resolution 16:9 data URL exists for a scene frame
 */
export async function getSceneImageDataUrl(
  scene: SceneAnalysis,
  character: OmGioCharacter
): Promise<string> {
  if (scene.omGioThumbnailUrl && scene.omGioThumbnailUrl.startsWith('data:image')) {
    return scene.omGioThumbnailUrl;
  }
  // Render high-res 16:9 frame
  return await renderOmGioSceneFrame(scene, character);
}

/**
 * Downloads a single scene's 16:9 image directly for Google Flow / Veo
 */
export async function downloadSingleSceneImage(
  scene: SceneAnalysis,
  character: OmGioCharacter
): Promise<void> {
  const dataUrl = await getSceneImageDataUrl(scene, character);
  const cleanLabel = scene.sceneLabel.replace(/[^a-zA-Z0-9_-]/g, '_');
  triggerFileDownload(dataUrl, `${cleanLabel}_OmGio_16x9_GoogleFlow.jpg`);
}

/**
 * Bundles all scene images into a single ZIP file with a prompts.txt included
 */
export async function downloadAllSceneImagesZip(
  project: Project,
  onProgress?: (progressText: string) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('om_gio_storyboard_images');

  onProgress?.('Generating 16:9 images for all scenes...');

  for (let i = 0; i < project.scenes.length; i++) {
    const scene = project.scenes[i];
    onProgress?.(`Processing image for ${scene.sceneLabel} (${i + 1}/${project.scenes.length})...`);
    const dataUrl = await getSceneImageDataUrl(scene, project.character);
    // Strip data:image/jpeg;base64,
    const base64Data = dataUrl.split(',')[1];
    if (base64Data && folder) {
      const padNum = String(scene.sceneNumber).padStart(2, '0');
      folder.file(`Scene_${padNum}_OmGio_16x9.jpg`, base64Data, { base64: true });
    }
  }

  // Also include prompts.txt inside the ZIP
  const allPrompts = formatAllPrompts(project.scenes);
  folder?.file('google_flow_prompts.txt', allPrompts);

  onProgress?.('Compressing ZIP package...');
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  triggerFileDownload(url, `${project.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_Images_GoogleFlow.zip`);
  URL.revokeObjectURL(url);
}

/**
 * Generates a single high-resolution Master Storyboard Image Document (.png)
 * combining all scenes, frames, timestamps, and dialogues onto one infographic canvas.
 */
export async function exportStoryboardAsMasterImage(
  project: Project,
  onProgress?: (progressText: string) => void
): Promise<void> {
  onProgress?.('Rendering Master Storyboard Image Document...');

  const width = 1920;
  const padding = 60;
  const headerHeight = 240;
  const cardGap = 40;
  const cardWidth = width - padding * 2;
  const frameWidth = 640;
  const frameHeight = 360; // 16:9
  const cardHeight = frameHeight + 80;

  const totalHeight = headerHeight + project.scenes.length * (cardHeight + cardGap) + padding * 2;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, totalHeight);
  bgGrad.addColorStop(0, '#060a12');
  bgGrad.addColorStop(0.5, '#090d18');
  bgGrad.addColorStop(1, '#03050a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, totalHeight);

  // Subtle grid lines
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
  ctx.lineWidth = 1;
  for (let y = 0; y < totalHeight; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Header
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(padding, padding, cardWidth, 180);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(padding, padding, cardWidth, 180);

  // Logo & Title
  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 24px monospace';
  ctx.fillText('OM GIO AI STUDIO — VISUAL STORYBOARD DOCUMENT', padding + 40, padding + 60);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText(project.name, padding + 40, padding + 110);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px monospace';
  ctx.fillText(
    `CHARACTER: Om Gio (28yo Indonesian Male) | ID_LOCK: ${project.identityLockStrength} | TOTAL SCENES: ${project.scenes.length} | READY FOR GOOGLE FLOW & VEO`,
    padding + 40,
    padding + 150
  );

  let currentY = headerHeight + padding + 20;

  for (let i = 0; i < project.scenes.length; i++) {
    const scene = project.scenes[i];
    onProgress?.(`Drawing ${scene.sceneLabel} onto document...`);

    // Scene Card Container
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(padding, currentY, cardWidth, cardHeight);
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(padding, currentY, cardWidth, cardHeight);

    // Load and draw 16:9 Scene Image
    const dataUrl = await getSceneImageDataUrl(scene, project.character);
    const img = await new Promise<HTMLImageElement>((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = dataUrl;
    });

    const imgX = padding + 20;
    const imgY = currentY + 40;
    ctx.drawImage(img, imgX, imgY, frameWidth, frameHeight);

    // Frame border
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.strokeRect(imgX, imgY, frameWidth, frameHeight);

    // Scene Info (Right Side)
    const textX = imgX + frameWidth + 40;
    let textY = currentY + 60;

    // Badge
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 26px monospace';
    ctx.fillText(`${scene.sceneLabel} (${scene.timeRangeStr})`, textX, textY);

    textY += 35;
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`DURATION: ${scene.durationFormatted} | CAMERA: ${scene.cameraAngle || 'Medium close-up'}`, textX, textY);

    textY += 40;
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('ACTION & SUBJECT:', textX, textY);

    textY += 25;
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '15px sans-serif';
    wrapText(ctx, scene.action || scene.subject, textX, textY, cardWidth - frameWidth - 100, 24);

    textY += 60;
    if (scene.dialogueSegments && scene.dialogueSegments.length > 0) {
      const diag = scene.dialogueSegments[0];
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`SPOKEN DIALOGUE (${diag.formattedStartTime} — ${diag.formattedEndTime}):`, textX, textY);

      textY += 28;
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'italic 17px serif';
      wrapText(ctx, `"${diag.text}"`, textX, textY, cardWidth - frameWidth - 100, 26);
    }

    currentY += cardHeight + cardGap;
  }

  onProgress?.('Exporting image file...');
  const masterDataUrl = canvas.toDataURL('image/png');
  triggerFileDownload(
    masterDataUrl,
    `${project.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_Master_Storyboard_Document.png`
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
}
