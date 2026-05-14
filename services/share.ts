// Gera cards compartilháveis (1080x1920) via Canvas e oferece Share API / download.
import { APP_NAME } from '../constants';

const W = 1080;
const H = 1920;

export interface CardSpec {
  title: string;
  body: string;
  footer?: string;
  palette: [string, string];
  emoji?: string;
  badge?: string;
}

const wrapText = (
  ctx: CanvasRenderingContext2D, text: string, x: number, y: number,
  maxW: number, lineH: number,
): number => {
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > maxW && i > 0) {
      ctx.fillText(line.trim(), x, yy);
      line = words[i] + ' ';
      yy += lineH;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, yy);
  return yy;
};

export const renderCard = async (spec: CardSpec): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Gradiente de fundo
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, spec.palette[0]);
  grad.addColorStop(1, spec.palette[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Card branco central
  const PAD = 80;
  const cardX = PAD; const cardY = 280;
  const cardW = W - PAD * 2; const cardH = H - 560;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.beginPath();
  // @ts-ignore roundRect existe em browsers modernos
  ctx.roundRect(cardX, cardY, cardW, cardH, 60);
  ctx.fill();

  // Badge opcional
  if (spec.badge) {
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    // @ts-ignore
    ctx.roundRect(cardX + 60, cardY + 60, 320, 80, 40);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px system-ui,sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(spec.badge, cardX + 100, cardY + 115);
  }

  // Emoji grande
  if (spec.emoji) {
    ctx.font = '200px system-ui,Apple Color Emoji,Segoe UI Emoji,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(spec.emoji, W / 2, cardY + 320);
  }

  // Title
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 56px system-ui,sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(spec.title, W / 2, cardY + 440);

  // Body (wrap)
  ctx.fillStyle = '#1e293b';
  ctx.font = '500 56px Georgia,serif';
  const bodyY = wrapText(ctx, `"${spec.body}"`, cardX + 80, cardY + 580, cardW - 160, 80);

  // Footer
  ctx.fillStyle = '#64748b';
  ctx.font = '400 36px system-ui,sans-serif';
  ctx.fillText(spec.footer || `@${APP_NAME.toLowerCase()}.app · pt-BR`, W / 2, cardY + cardH - 80);

  // Logo / marca embaixo
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 44px system-ui,sans-serif';
  ctx.fillText(APP_NAME, W / 2, H - 140);
  ctx.fillStyle = '#475569';
  ctx.font = '400 32px system-ui,sans-serif';
  ctx.fillText('cuidado emocional diário', W / 2, H - 90);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob(b => resolve(b!), 'image/png', 0.92);
  });
};

export const shareOrDownload = async (
  blob: Blob,
  filename: string,
  text: string,
): Promise<'shared' | 'downloaded'> => {
  const file = new File([blob], filename, { type: 'image/png' });
  const nav: any = navigator;
  if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
    await nav.share({ files: [file], text });
    return 'shared';
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'downloaded';
};
