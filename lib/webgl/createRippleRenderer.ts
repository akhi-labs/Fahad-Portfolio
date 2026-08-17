import { Mesh, Program, Renderer, Texture, Triangle } from 'ogl';
import { fragmentShader, vertexShader } from './rippleShader';

export type RippleRenderer = {
  canvas: HTMLCanvasElement;
  /** Loads (or reuses) a texture and sizes the drawing buffer. Resolves once
   *  the image is decoded and the first frame has been drawn. */
  show: (src: string, width: number, height: number) => Promise<void>;
  resize: (width: number, height: number) => void;
  setMouse: (u: number, v: number) => void;
  setStrength: (value: number) => void;
  destroy: () => void;
};

type CachedTexture = { texture: Texture; aspect: number };

/**
 * One WebGL context shared by every work card. Returns null when WebGL is
 * unavailable so callers can fall back to the plain CSS hover.
 */
export function createRippleRenderer(): RippleRenderer | null {
  let renderer: Renderer;
  try {
    renderer = new Renderer({
      alpha: true,
      antialias: false,
      // The canvas only ever covers one card, but capping DPR still saves a
      // lot of fill rate on high-density displays for a decorative effect.
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
  } catch {
    return null;
  }

  const gl = renderer.gl;
  if (!gl) return null;

  const canvas = gl.canvas as HTMLCanvasElement;
  const textures = new Map<string, CachedTexture>();

  const program = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    uniforms: {
      tMap: { value: new Texture(gl) },
      uMouse: { value: [0.5, 0.5] },
      uStrength: { value: 0 },
      uTime: { value: 0 },
      uPlaneAspect: { value: 1 },
      uImageAspect: { value: 1 },
    },
  });

  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  let raf = 0;
  let running = false;
  let contextLost = false;
  const start = performance.now();

  // The pointer target is chased rather than snapped to, so the ripple trails
  // the cursor slightly instead of teleporting with it.
  const target: [number, number] = [0.5, 0.5];
  const current: [number, number] = [0.5, 0.5];
  const CHASE = 0.12;

  const frame = () => {
    if (!running || contextLost) return;
    current[0] += (target[0] - current[0]) * CHASE;
    current[1] += (target[1] - current[1]) * CHASE;
    program.uniforms.uMouse.value = current;
    program.uniforms.uTime.value = (performance.now() - start) / 1000;
    renderer.render({ scene: mesh });
    raf = requestAnimationFrame(frame);
  };

  const startLoop = () => {
    if (running || contextLost) return;
    running = true;
    raf = requestAnimationFrame(frame);
  };

  const stopLoop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // preventDefault is required for the browser to attempt restoration.
  const onLost = (e: Event) => {
    e.preventDefault();
    contextLost = true;
    stopLoop();
  };
  const onRestored = () => {
    contextLost = false;
    textures.clear();
  };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  const resize = (width: number, height: number) => {
    if (width <= 0 || height <= 0) return;
    renderer.setSize(width, height);
    program.uniforms.uPlaneAspect.value = width / height;
  };

  const loadTexture = (src: string) =>
    new Promise<CachedTexture | null>((resolve) => {
      const cached = textures.get(src);
      if (cached) return resolve(cached);

      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        if (contextLost) return resolve(null);
        const entry: CachedTexture = {
          texture: new Texture(gl, { image }),
          aspect: image.naturalWidth / image.naturalHeight,
        };
        textures.set(src, entry);
        resolve(entry);
      };
      image.onerror = () => resolve(null);
      image.src = src;
    });

  return {
    canvas,
    async show(src, width, height) {
      if (contextLost) return;
      const entry = await loadTexture(src);
      if (!entry || contextLost) return;
      program.uniforms.tMap.value = entry.texture;
      program.uniforms.uImageAspect.value = entry.aspect;
      resize(width, height);
      startLoop();
    },
    resize,
    setMouse(u, v) {
      target[0] = u;
      target[1] = v;
      // Land on the pointer for the first sample so the ripple doesn't sweep
      // across the card from wherever the last hover ended.
      if (!running) {
        current[0] = u;
        current[1] = v;
      }
    },
    setStrength(value) {
      program.uniforms.uStrength.value = value;
      if (value <= 0.001) stopLoop();
      else startLoop();
    },
    destroy() {
      stopLoop();
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      textures.clear();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
