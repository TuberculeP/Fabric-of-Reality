import { deg2rad, sleep } from "./ext/helpers";
import { GUI } from "dat.gui";
//import { createNoise2D } from "simplex-noise";
import PerlinNoise from "perlin-noise-2d";
/*
const noise2D = createNoise2D();

const perlint = (x: number, y: number, target: number): number => {
  return Math.floor(Math.abs(noise2D(x, y) * target));
};
*/

const canvas = document.querySelector<HTMLCanvasElement>("canvas");

const ctx = canvas?.getContext("2d");

if (!ctx) throw new Error("don't");

const params = {
  columns: 53,
  speed: 50,
  brightness: 75,
  saturation: 300,
  floor: 0,
  getCtxSize: function () {
    return ctx.canvas.width;
  },
  getSize: function () {
    return this.getCtxSize() / this.columns;
  },
};

const perlin_r = new PerlinNoise(100, 100, 1);
const perlin_g = new PerlinNoise(100, 100, 2);
const perlin_b = new PerlinNoise(100, 100, 3);
const perlin_s = new PerlinNoise(100, 100, 4);
const perlin_t = new PerlinNoise(100, 100, 5);

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
          ctx.save();
          ctx.scale(0.9, 0.9);
          const delta =
            10 +
            10 *
              perlin_s.perlin(
                (i + time) / params.columns,
                (j + time) / params.columns
              );
          if (
            Math.floor(perlin_t.perlin(i / delta, j / delta) * 10) >=
            params.floor * 10
          ) {
            ctx.rotate(deg2rad(45));
            ctx.scale(0.7, 0.7);
          }
          const r = Math.floor(
            perlin_r.perlin(i / delta, j / delta) * params.saturation + params.brightness
          );
          const g = Math.floor(
            perlin_g.perlin((i + time / delta) / delta, j / delta) *
              params.saturation +
              params.brightness
          );
          const b = Math.floor(
            perlin_b.perlin(j / delta, (i + time / delta) / delta) *
              params.saturation +
              params.brightness
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
    time += 1;
  }
};

const debug = new GUI({
  autoPlace: true,
});

const folder = debug.addFolder("settings");
folder.add(params, "speed", 0, 1000, 1);
folder.add(params, "columns", 1, 99, 1);
folder.add(params, "brightness", 0, 128, 1);
folder.add(params, "saturation", 0, 500, 1);
folder.add(params, "floor", -1, 1, 0.01);
main();
