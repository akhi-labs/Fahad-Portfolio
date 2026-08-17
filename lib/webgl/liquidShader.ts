export const vertexShader = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Classic metaball field: each droplet contributes r²/d², summed, then cut at a
// threshold. Because neighbouring contributions add up, blobs bulge toward each
// other and fuse as they close — the mercury behaviour, for free.
//
// The five droplets are separate vec2 uniforms rather than a `vec2[5]` array on
// purpose: array-uniform location lookup is the fiddliest part of the GL
// wrapper, and unrolling sidesteps it entirely for the cost of four extra
// uniforms.
//
// Alpha is non-premultiplied white and relies on the default SRC_ALPHA blend,
// which lands premultiplied values in the drawing buffer — what the compositor
// expects. CSS `mix-blend-mode: difference` then inverts whatever is behind.
export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec2 uP0;
  uniform vec2 uP1;
  uniform vec2 uP2;
  uniform vec2 uP3;
  uniform vec2 uP4;
  uniform float uRadius; // lead droplet radius in UV units
  uniform float uAspect; // width / height, keeps droplets circular
  uniform float uAlpha;  // eased 0..1 on enter/leave
  varying vec2 vUv;

  float blob(vec2 uv, vec2 p, float r) {
    vec2 d = (uv - p) * vec2(uAspect, 1.0);
    return (r * r) / (dot(d, d) + 1e-5);
  }

  void main() {
    // GL puts v=0 at the bottom; droplet positions arrive in top-down screen
    // space, so flip here rather than making every caller compensate.
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);

    float r = uRadius;
    float field =
        blob(uv, uP0, r)
      + blob(uv, uP1, r * 0.85)
      + blob(uv, uP2, r * 0.70)
      + blob(uv, uP3, r * 0.55)
      + blob(uv, uP4, r * 0.42);

    // A soft threshold band gives a liquid edge rather than a hard circle.
    float mask = smoothstep(0.85, 1.3, field) * uAlpha;

    gl_FragColor = vec4(1.0, 1.0, 1.0, mask);
  }
`;
