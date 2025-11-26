import { createCanvas } from "canvas";

const canvas = createCanvas(1024, 1024);
const ctx = canvas.getContext("2d");

export function generateImage(text = "Hello") {
  // canvas初期化
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 背景
  ctx.fillStyle = "#2c3e50";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // テキスト
  ctx.fillStyle = "#ecf0f1";
  ctx.font = "64px sans-serif";
  ctx.fillText(text, 50, 512);

  return canvas.toBuffer("image/png");
}
