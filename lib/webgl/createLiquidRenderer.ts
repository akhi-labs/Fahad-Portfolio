import { Mesh, Program, Renderer, Triangle } from 'ogl';
import { fragmentShader, vertexShader } from './liquidShader';

const POINTS = 5;
// Per-60fps-frame catch-up. The lead droplet is deliberately near-instant so
// the puddle sits under the cursor rather than trailing it; the softer values
// behind it are what stretch the chain on fast moves and let it fuse back
// together at rest.
const CHASE = [0.72, 0.3, 0.2, 0.14, 0.1];

const BASE_RADIUS = 0.175;

export type LiquidRenderer = {
  canvas: HTMLCanvasElement;
  resize: (width: number, height: number) => void;
  /** Pointer position in 0..1 UV space, origin top-left. */
  setPointer: (u: number, v: number) => void;
  /** Drops the whole chain onto a point so it doesn't sweep in from the edge. */
  snapTo: (u: number, v: number) => void;
  setAlpha: (value: number) => void;
  start: () => void;
  stop: () => void;
  destroy: () => void;
};

export function createLiquidRenderer(): LiquidRenderer | null {
  let renderer: Renderer;
  try {
    renderer = new Renderer({
      alpha: true,
      antialias: false,
      // Purely decorative, so cap the cost on high-density displays.
      dpr: Math.min(window.devicePixelRatio || 1, 1.75),
    });
  } catch {
    return null;
  }

  const gl = renderer.gl;
  if (!gl) return null;

  const canvas = gl.canvas as HTMLCanvasElement;
  // One [x, y] pair per droplet, kept as separate uniforms (see the shader).
  const points: [number, number][] = Array.from({ length: POINTS }, () => [0.5, 0.5]);
  const target: [number, number] = [0.5, 0.5];

  const program = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    transparent: true,
    uniforms: {
      uP0: { value: points[0] },
      uP1: { value: points[1] },
      uP2: { value: points[2] },
      uP3: { value: points[3] },
      uP4: { value: points[4] },
      uRadius: { value: BASE_RADIUS },
      uAspect: { value: 1 },
      uAlpha: { value: 0 },
    },
  });

  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  let raf = 0;
  let running = false;
  let lost = false;
  let last = 0;
  const start0 = performance.now();

  const frame = () => {
    if (!running || lost) return;

    // Frame-rate independent catch-up: a raw `p += (t - p) * k` chases twice as
    // fast on a 120Hz display as on 60Hz, so the feel of the lag would change
    // with the monitor. Clamped so a background tab resuming doesn't jump.
    const now = performance.now();
    const steps = Math.min(last ? (now - last) / 16.667 : 1, 4);
    last = now;
    const catchUp = (i: number) => 1 - Math.pow(1 - CHASE[i], steps);

    // Lead droplet follows the pointer; the rest follow their predecessor.
    const lead = catchUp(0);
    points[0][0] += (target[0] - points[0][0]) * lead;
    points[0][1] += (target[1] - points[0][1]) * lead;
    for (let i = 1; i < POINTS; i++) {
      const k = catchUp(i);
      points[i][0] += (points[i - 1][0] - points[i][0]) * k;
      points[i][1] += (points[i - 1][1] - points[i][1]) * k;
    }

    // Slow breathing so a resting puddle never looks frozen.
    const t = (performance.now() - start0) / 1000;
    program.uniforms.uRadius.value = BASE_RADIUS + Math.sin(t * 1.1) * 0.0065;

    renderer.render({ scene: mesh });
    raf = requestAnimationFrame(frame);
  };

  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    running = false;
    cancelAnimationFrame(raf);
  };
  const onRestored = () => {
    lost = false;
  };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  return {
    canvas,
    resize(width, height) {
      if (width <= 0 || height <= 0) return;
      renderer.setSize(width, height);
      program.uniforms.uAspect.value = width / height;
    },
    setPointer(u, v) {
      target[0] = u;
      target[1] = v;
    },
    snapTo(u, v) {
      target[0] = u;
      target[1] = v;
      for (const point of points) {
        point[0] = u;
        point[1] = v;
      }
    },
    setAlpha(value) {
      program.uniforms.uAlpha.value = value;
    },
    start() {
      if (running || lost) return;
      running = true;
      last = 0; // Resets the delta so a restart never sees a huge gap.
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
