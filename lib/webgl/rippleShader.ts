export const vertexShader = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Radial ripple centred on the pointer.
//
// Three things keep this from reading as a gimmick:
//   1. coverUv() reproduces CSS `object-fit: cover`. Without it the texture is
//      stretched to the card while the <img> underneath is cropped, so the
//      framing visibly jumps the moment the canvas fades in.
//   2. Two sine components at different frequencies, so it reads as water
//      rather than one clean ring.
//   3. A ~1% RGB split along the displacement, which catches the light on
//      screenshot edges. Displacement stays small on purpose.
export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D tMap;
  uniform vec2 uMouse;        // pointer position in 0..1 UV space
  uniform float uStrength;    // 0..1, eased on enter/leave
  uniform float uTime;
  uniform float uPlaneAspect; // card width / height
  uniform float uImageAspect; // texture width / height
  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    float r = uImageAspect / uPlaneAspect;
    vec2 s = r > 1.0 ? vec2(1.0 / r, 1.0) : vec2(1.0, r);
    return (uv - 0.5) * s + 0.5;
  }

  void main() {
    vec2 delta = vUv - uMouse;
    delta.x *= uPlaneAspect;

    float dist = length(delta);
    float falloff = smoothstep(0.45, 0.0, dist);

    float ring = sin(dist * 26.0 - uTime * 3.2);
    float swell = sin(dist * 12.0 - uTime * 1.8) * 0.5;
    float amp = (ring + swell) * 0.010 * falloff * uStrength;

    vec2 dir = normalize(delta + 1e-5);
    vec2 disp = dir * amp;

    // Matches the CSS hover zoom so the two states line up.
    vec2 uv = (vUv - 0.5) * (1.0 - 0.055 * uStrength) + 0.5;

    vec3 color;
    color.r = texture2D(tMap, coverUv(uv + disp * 1.06)).r;
    color.g = texture2D(tMap, coverUv(uv + disp)).g;
    color.b = texture2D(tMap, coverUv(uv + disp * 0.94)).b;

    gl_FragColor = vec4(color, 1.0);
  }
`;
