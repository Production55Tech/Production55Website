import { useEffect, useRef } from "react";

/* ── Images (edit these, or pass baseSrc / glowSrc / alt as props) ───── */
const ALT = "";

/* ── Feel (same meaning as in HighlightHoverText) ────────────────────── */
const RADIUS = 800; // px  – how far the glow reaches from the cursor
const OFFSET = 300; // ms  – ripple delay between the cursor and the farthest edge
const RISE = 200; //   ms  – fade-in time constant
const FALL = 600; //   ms  – fade-out time constant

/* ── Performance knobs ───────────────────────────────────────────────── */
const CELL = 24; //      px per field cell (bigger = cheaper, coarser falloff)
const MAX_CELLS = 96; // cap per axis, so huge images never get a huge grid
const MAX_DPR = 2; //    canvas backing store never exceeds 2x (biggest GPU lever)
const STEPS = 32; //     ripple-delay buckets (~9ms each, finer than a frame)
const HISTORY = 128; //  pointer history slots (>= 500ms even at 240Hz)
const SETTLE = 0.002; // a cell this close to its target snaps onto it (exact rest state)
const HOVER_ONLY = true; //  touch-only devices keep the plain <img>: no GL context, no textures
const LOOKAHEAD = "200px"; // start fetching the glow image / creating GL this close to the viewport

// The "object-fit: cover" crop is resolved per vertex (3 per draw), not per pixel:
// the vertex shader turns the canvas UV into the image UV and the fragment shader just
// receives it as a plain varying, so every texture fetch stays a simple, prefetchable read.
const VERT = `#version 300 es
uniform vec4 u; // cover mapping: xy = scale, zw = offset
out vec2 t;     // canvas-space UV (intensity field)
out vec2 c;     // image-space UV (cover-cropped, used for both images)
void main() {
  // one oversized triangle covering the screen, no vertex buffer needed
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  t = vec2(p.x, 1.0 - p.y);
  c = t * u.xy + u.zw;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D a; // base image
uniform sampler2D b; // glow image
uniform sampler2D f; // coarse intensity field (R8, bilinear-upscaled by the GPU)
in vec2 t;
in vec2 c;
out vec4 o;
void main() {
  o = mix(texture(a, c), texture(b, c), texture(f, t).r);
}`;

const clamp = (n, lo, hi) => (n < lo ? lo : n > hi ? hi : n);

const loaded = (im) =>
  im.decode
    ? im.decode()
    : new Promise((res, rej) => {
        im.onload = res;
        im.onerror = rej;
      });

export default function HighlightHoverImage({
  className = "",
  baseSrc = "",
  glowSrc = "",
  alt = ALT,
}) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !img || !canvas) return;

    // No hover -> no effect. Leave the plain <img> and spend nothing.
    if (HOVER_ONLY && !window.matchMedia("(hover: hover)").matches) return;

    let gl = null; //            created lazily, on first approach to the viewport
    let alive = true;
    let started = false;
    let glReady = false;
    let onScreen = false;
    let raf = 0;
    let prev = 0;
    let lastMove = -1e9;

    // GL objects
    let prog = null;
    let texA = null;
    let texB = null;
    let texF = null;
    let uCover = null;
    let glow = null;

    // coarse field grid (cell centres in CSS px, local to the canvas)
    let gw = 0;
    let gh = 0;
    let xs = null;
    let ys = null;
    let v = null; //     Float32 intensity per cell
    let bytes = null; // Uint8 copy that gets uploaded

    // latest pointer sample (written by events, consumed once per frame)
    let px = 0;
    let py = 0;
    let pa = 0;
    let dirty = false;
    let cx = -9999; // last active cursor position, local px
    let cy = -9999;

    // pointer history ring buffer (no per-frame allocation)
    const ht = new Float64Array(HISTORY);
    const hx = new Float32Array(HISTORY);
    const hy = new Float32Array(HISTORY);
    const ha = new Uint8Array(HISTORY);
    let head = 0;
    let size = 1;
    // Seed slot: "inactive since forever". Without it the very first hover has nothing
    // older to fall back on, every ripple bucket sees an active cursor, and the whole
    // radius lights at once instead of rippling outward.
    ht[0] = -Infinity;

    // per-frame bucketed history samples (index 0 = now, STEPS = OFFSET ms ago)
    const bx = new Float32Array(STEPS + 1);
    const by = new Float32Array(STEPS + 1);
    const ba = new Uint8Array(STEPS + 1);

    /* ── GL setup ─────────────────────────────────────────────────── */
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(s) || "shader compile failed");
      return s;
    };

    const setTexParams = (filter) => {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    const imageTexture = (source, unit) => {
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.generateMipmap(gl.TEXTURE_2D); // clean downscaling, no shimmer
      setTexParams(gl.LINEAR_MIPMAP_LINEAR);
      return tex;
    };

    const uploadField = () => {
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, texF);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, gw, gh, 0, gl.RED, gl.UNSIGNED_BYTE, bytes);
    };

    // "object-fit: cover, centered": crop the image to the canvas aspect ratio.
    // Depends only on the canvas ratio, so it is refreshed on canvas resize and on (re)build.
    const setCover = () => {
      if (!uCover || !canvas.width || !canvas.height || !img.naturalWidth || !img.naturalHeight)
        return;
      const ca = canvas.width / canvas.height;
      const ia = img.naturalWidth / img.naturalHeight;
      let sx = 1;
      let sy = 1;
      if (ca > ia) sy = ia / ca; // box is wider than the image: crop top/bottom
      else sx = ca / ia; //         box is taller than the image: crop left/right
      gl.uniform4f(uCover, sx, sy, (1 - sx) / 2, (1 - sy) / 2);
    };

    const build = () => {
      const vs = compile(gl.VERTEX_SHADER, VERT);
      const fs = compile(gl.FRAGMENT_SHADER, FRAG);
      prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(prog) || "program link failed");
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.useProgram(prog);
      gl.uniform1i(gl.getUniformLocation(prog, "a"), 0);
      gl.uniform1i(gl.getUniformLocation(prog, "b"), 1);
      gl.uniform1i(gl.getUniformLocation(prog, "f"), 2);
      uCover = gl.getUniformLocation(prog, "u");

      texA = imageTexture(img, 0);
      texB = imageTexture(glow, 1);

      texF = gl.createTexture();
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, texF);
      setTexParams(gl.LINEAR);
      if (gw) uploadField();
      gl.viewport(0, 0, canvas.width, canvas.height);
      setCover(); // a fresh program starts with zeroed uniforms (also covers context restore)
    };

    const release = () => {
      if (!gl) return;
      if (prog) gl.deleteProgram(prog);
      if (texA) gl.deleteTexture(texA);
      if (texB) gl.deleteTexture(texB);
      if (texF) gl.deleteTexture(texF);
      prog = texA = texB = texF = uCover = null;
    };

    const draw = () => gl.drawArrays(gl.TRIANGLES, 0, 3);

    const showCanvas = () => {
      canvas.style.visibility = "visible";
      img.style.opacity = "0"; // stays in layout (size, alt text), just not painted
    };
    const showFallback = () => {
      canvas.style.visibility = "hidden";
      img.style.opacity = "";
    };

    /* ── layout: canvas backing store + field grid ───────────────── */
    const layout = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const pw = Math.round(r.width * dpr);
      const ph = Math.round(r.height * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw; // clears the buffer, so redraw below in the same task
        canvas.height = ph;
        gl.viewport(0, 0, pw, ph);
        setCover(); // new canvas ratio -> new crop (one uniform upload, only on resize)
      }

      const nx = clamp(Math.round(r.width / CELL), 4, MAX_CELLS);
      const ny = clamp(Math.round(r.height / CELL), 4, MAX_CELLS);
      if (nx !== gw || ny !== gh) {
        gw = nx;
        gh = ny;
        v = new Float32Array(gw * gh);
        bytes = new Uint8Array(gw * gh);
        xs = new Float32Array(gw);
        ys = new Float32Array(gh);
        uploadField();
      }
      for (let i = 0; i < gw; i++) xs[i] = ((i + 0.5) * r.width) / gw;
      for (let j = 0; j < gh; j++) ys[j] = ((j + 0.5) * r.height) / gh;

      draw();
    };

    /* ── pointer history ─────────────────────────────────────────── */
    const push = (t, x, y, a) => {
      head = (head + 1) % HISTORY;
      ht[head] = t;
      hx[head] = x;
      hy[head] = y;
      ha[head] = a;
      if (size < HISTORY) size++;
    };

    // Resolve "where was the cursor d ms ago" for STEPS+1 delays once per frame.
    // Delays only grow with k, so one backwards walk through the history is enough.
    const sampleBuckets = (now) => {
      let n = 0;
      for (let k = 0; k <= STEPS; k++) {
        const time = now - (k / STEPS) * OFFSET;
        let i = (head - n + HISTORY) % HISTORY;
        while (n < size - 1 && ht[i] > time) {
          n++;
          i = (head - n + HISTORY) % HISTORY;
        }
        bx[k] = hx[i];
        by[k] = hy[i];
        ba[k] = ha[i];
      }
    };

    /* ── frame loop (runs only while something is changing) ──────── */
    const frame = (now) => {
      raf = 0;
      if (!alive || !glReady || !onScreen) return;

      const dt = Math.max(0, Math.min(now - prev, 50));
      prev = now;

      if (dirty) {
        dirty = false;
        if (pa) {
          const r = canvas.getBoundingClientRect(); // once per frame, not per event
          cx = px - r.left;
          cy = py - r.top;
        }
        push(now, cx, cy, pa);
        lastMove = now;
      }

      sampleBuckets(now);

      const aRise = 1 - Math.exp(-dt / RISE); // per frame, not per cell
      const aFall = 1 - Math.exp(-dt / FALL);
      const invR = 1 / RADIUS;
      let busy = false;
      let changed = false;

      for (let j = 0; j < gh; j++) {
        const y = ys[j];
        const dyc = y - cy;
        const row = j * gw;
        for (let i = 0; i < gw; i++) {
          const x = xs[i];
          const dxc = x - cx;
          const d = Math.sqrt(dxc * dxc + dyc * dyc) * invR;
          const k = ((d < 1 ? d : 1) * STEPS + 0.5) | 0;

          let target = 0;
          if (ba[k]) {
            const dx = x - bx[k];
            const dy = y - by[k];
            const t = 1 - Math.sqrt(dx * dx + dy * dy) * invR;
            if (t > 0) target = t * t * (3 - 2 * t);
          }

          const idx = row + i;
          const cur = v[idx];
          let nv = cur + (target - cur) * (target > cur ? aRise : aFall);
          if (nv - target > SETTLE || target - nv > SETTLE) busy = true;
          else nv = target; // settled: land exactly, so rest is the pure base image
          v[idx] = nv;

          const q = (nv * 255 + 0.5) | 0;
          if (q !== bytes[idx]) {
            bytes[idx] = q;
            changed = true;
          }
        }
      }

      if (changed) {
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, texF);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gw, gh, gl.RED, gl.UNSIGNED_BYTE, bytes);
        draw();
      }

      if (busy || now - lastMove < OFFSET + 50) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || !alive || !glReady || !onScreen) return;
      prev = performance.now();
      raf = requestAnimationFrame(frame);
    };

    /* ── events ──────────────────────────────────────────────────── */
    const onMove = (e) => {
      px = e.clientX;
      py = e.clientY;
      pa = 1;
      dirty = true;
      wake();
    };
    const onLeave = () => {
      pa = 0;
      dirty = true;
      wake();
    };
    const onLost = (e) => {
      e.preventDefault(); // allow restoration
      glReady = false;
      cancelAnimationFrame(raf);
      raf = 0;
      showFallback();
    };
    const onRestored = () => {
      if (!alive) return;
      try {
        build();
      } catch {
        return;
      }
      glReady = true;
      draw();
      showCanvas();
      wake();
    };

    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointercancel", onLeave);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    const ro = new ResizeObserver(() => {
      if (glReady) layout();
    });
    ro.observe(canvas);

    /* ── lazy start: load the glow image and create GL on first approach ── */
    const start = () => {
      if (started) return;
      started = true;

      gl = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power", // trivial shader: don't wake the discrete GPU
      });
      if (!gl) return; // no WebGL2 -> the plain <img> simply stays

      glow = new Image();
      glow.crossOrigin = "anonymous";
      glow.src = glowSrc;

      Promise.all([loaded(img), loaded(glow)])
        .then(() => {
          if (!alive) return;
          const max = gl.getParameter(gl.MAX_TEXTURE_SIZE);
          if (
            Math.max(img.naturalWidth, img.naturalHeight, glow.naturalWidth, glow.naturalHeight) >
            max
          )
            return;
          build();
          glReady = true;
          layout(); // sizes the canvas and draws the resting frame
          showCanvas(); // same task as the draw -> no flash
          if (dirty) wake(); // pointer was already inside while loading
        })
        .catch(() => {
          /* a load or GL failure just leaves the plain <img> in place */
        });
    };

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[entries.length - 1].isIntersecting;
        if (!onScreen) return;
        start();
        wake();
      },
      { rootMargin: LOOKAHEAD },
    );
    io.observe(wrap);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointercancel", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      release(); // not loseContext(): React StrictMode remounts reuse this canvas
      showFallback();
    };
  }, [baseSrc, glowSrc]);

  return (
    <div ref={wrapRef} className={className}>
      <div className="relative h-full w-full">
        <img
          ref={imgRef}
          src={baseSrc}
          alt={alt}
          crossOrigin="anonymous"
          decoding="async"
          draggable={false}
          className="block h-full w-full select-none object-none"
        />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="invisible absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
