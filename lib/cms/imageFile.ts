// 이미지 파일 첨부: 브라우저에서 파일을 읽어 줄인 뒤 data URL로 바꾼다. 서버로 올리지 않는다.
import { IMAGE_DATA_MAX } from "./html";

export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
export const MAX_FILE_BYTES = 5 * 1024 * 1024;

// 줄여도 data URL이 상한을 넘으면 더 작은 폭으로 다시 시도한다.
const WIDTH_STEPS = [1200, 900, 640, 420];

export function fitSize(width: number, height: number, maxWidth: number): { width: number; height: number } {
  if (width <= maxWidth) return { width, height };
  const scale = maxWidth / width;
  return { width: maxWidth, height: Math.max(1, Math.round(height * scale)) };
}

// 받을 수 있는 파일이면 빈 문자열, 아니면 사용자에게 보여 줄 안내를 돌려준다.
export function checkImageFile(file: { type: string; size: number }): string {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return "PNG, JPG, WebP, GIF 파일만 첨부할 수 있어요.";
  if (file.size > MAX_FILE_BYTES) return "5MB 이하의 파일만 첨부할 수 있어요.";
  return "";
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode"));
    };
    img.src = url;
  });
}

// 파일을 줄여서 data URL로 만든다. PNG는 투명을 살리려고 PNG로, 나머지는 JPEG로 저장한다(애니메이션 GIF는 첫 장면만 남는다).
// 안내할 문장이 있는 실패는 Error의 message로 던진다.
export async function fileToImageData(file: File): Promise<string> {
  const problem = checkImageFile(file);
  if (problem) throw new Error(problem);
  let img: HTMLImageElement;
  try {
    img = await loadImage(file);
  } catch {
    throw new Error("이미지를 읽지 못했어요. 다른 파일을 골라 주세요.");
  }
  const keepAlpha = file.type === "image/png";
  for (const maxWidth of WIDTH_STEPS) {
    const { width, height } = fitSize(img.naturalWidth, img.naturalHeight, maxWidth);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("이 브라우저에서는 이미지를 줄일 수 없어요.");
    if (!keepAlpha) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(img, 0, 0, width, height);
    const data = keepAlpha ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.85);
    if (data.length <= IMAGE_DATA_MAX) return data;
  }
  throw new Error("이미지가 너무 커요. 더 작은 파일을 첨부해 주세요.");
}
