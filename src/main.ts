import { deg2rad, sleep, randint } from "./ext/helpers";
import { GUI } from "dat.gui";
import { createNoise2D } from "simplex-noise";

const noise2D = createNoise2D();

const perlint = (x: number, y: number, target: number): number => {
  return Math.floor(Math.abs(noise2D(x, y) * target));
};

const canvas = document.querySelector<HTMLCanvasElement>("canvas");

const ctx = canvas?.getContext("2d");

if (!ctx) throw new Error("don't");

const params = {
  columns: 53,
  speed: 100,
  getCtxSize: function () {
    return ctx.canvas.width;
  },
  getSize: function () {
    return this.getCtxSize() / this.columns;
  },
  rMode: 1,
  gMode: 2,
  bMode: 3,
};

const drawRectangle = (color: string) => {
  const size = params.getSize();
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.fill();
  ctx.closePath();
};

const main = async (): Promise<void> => {
  let time = 0;
  while (true) {
    const radius = Math.floor(params.columns / 2);

    const ctxSize = params.getCtxSize();
    const size = params.getSize();

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctxSize, ctxSize);
    ctx.translate(size / 2, size / 2);
    for (let i = 0; i < params.columns; i++) {
      for (let j = 0; j < params.columns; j++) {
        if (Math.sqrt((i - radius) ** 2 + (j - radius) ** 2) < radius) {
          const isRotated = Math.random() > 0.5;
          ctx.save();
          ctx.scale(0.9, 0.9);
          if (isRotated) {
            ctx.rotate(deg2rad(45));
            ctx.scale(0.7, 0.7);
          }
          const rTable =
            params.rMode === 1 ? [i, i] : params.rMode === 2 ? [j, j] : [i, j];
          const r = perlint(
            (rTable[0] + time) / (perlint(time / 10, time / 10, 10) + 10),
            (rTable[1] + time) / (perlint(time / 10, time / 10, 10) + 10),
            255
          );

          const gTable =
            params.gMode === 1 ? [i, i] : params.gMode === 2 ? [j, j] : [i, j];
          const g = perlint(
            (gTable[0] + time) / (perlint(time / 10, time / 10, 10) + 10),
            (gTable[1] + time) / (perlint(time / 10, time / 10, 10) + 10),
            255
          );

          const bTable =
            params.bMode === 1 ? [i, i] : params.bMode === 2 ? [j, j] : [i, j];
          const b = perlint(
            (bTable[0] + time) / (perlint(time / 10, time / 10, 10) + 10),
            (bTable[1] + time) / (perlint(time / 10, time / 10, 10) + 10),
            255
          );

          drawRectangle(`rgb(${r}, ${g}, ${b})`);
          ctx.restore();
        }

        ctx.translate(size, 0);
      }
      ctx.translate(-size * params.columns, size);
    }
    // reset
    ctx.translate(-size / 2, -ctxSize - size / 2);
    await sleep(params.speed);
    time += 1 + params.speed / 1000;
  }
};

const debug = new GUI({
  autoPlace: true,
});

const folder = debug.addFolder("settings");
folder.add(params, "speed", 0, 1000, 1);
folder.add(params, "columns", 1, 99, 1);
const colorFolder = folder.addFolder("Color Modes");
colorFolder.add(params, "rMode", 1, 3, 1);
colorFolder.add(params, "gMode", 1, 3, 1);
colorFolder.add(params, "bMode", 1, 3, 1);

main();
