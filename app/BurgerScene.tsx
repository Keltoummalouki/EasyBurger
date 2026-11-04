"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type * as Three from "three";
import profiles from "./burger-profiles.json";

// Dimensions and centres are in the same image space as the first-paint poster.
const ingredients = [
  { id: "crown", width: 985, height: 345, x: 7, y: 186.5, openX: -30, openY: 482, twist: -0.04 },
  { id: "pickles", width: 954, height: 126, x: -5, y: 42, openX: 21, openY: 179, twist: 0.07 },
  { id: "upper-smash", width: 1045, height: 201, x: 0, y: -40.5, openX: -12, openY: -49, twist: -0.035 },
  { id: "lower-smash", width: 1017, height: 201, x: 0, y: -176.5, openX: 16, openY: -307, twist: 0.03 },
  { id: "heel", width: 960, height: 167, x: -4, y: -275.5, openX: 2, openY: -551, twist: -0.02 },
] as const;

type Ingredient = (typeof ingredients)[number];
type Frame = { width: number; height: number; scale: number; progress: number; tilt: number; yaw: number; pitch: number };
type Surface = { paint: (frame: Frame) => void; dispose: () => void };
const mix = (start: number, end: number, progress: number) => start + (end - start) * progress;
const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

function geometryFromSilhouette(T: typeof Three, layer: Ingredient) {
  // Each measured silhouette row becomes a closed elliptical cross-section.
  // Projecting the front photograph onto the volume preserves its irregular edges.
  const rows = profiles[layer.id];
  const segments = 96;
  const vertices: number[] = [];
  const uv: number[] = [];
  const faces: number[] = [];
  rows.forEach(([left, right], row) => {
    const v = row / (rows.length - 1);
    const center = (left + right) / 2000;
    const radius = (right - left) / 2000;
    for (let col = 0; col <= segments; col++) {
      const theta = (col / segments) * Math.PI * 2;
      const u = center + radius * Math.sin(theta);
      vertices.push((u - 0.5) * layer.width, (0.5 - v) * layer.height, radius * layer.width * Math.cos(theta) * 0.77);
      uv.push(u, 1 - v);
      if (col < segments && row < rows.length - 1) {
        const a = row * (segments + 1) + col;
        const b = a + segments + 1;
        faces.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  });
  const geometry = new T.BufferGeometry();
  geometry.setAttribute("position", new T.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
  geometry.setIndex(faces);
  return geometry;
}

function webglSurface(T: typeof Three, host: HTMLDivElement, images: HTMLImageElement[]): Surface | null {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", { antialias: true, alpha: true, powerPreference: "low-power" });
  if (!context) return null;
  const renderer = new T.WebGLRenderer({ canvas, context, antialias: true, alpha: true });
  const camera = new T.OrthographicCamera(-1, 1, 1, -1, 1, 6000);
  camera.position.z = 2200;
  const scene = new T.Scene();
  const stack = new T.Group();
  scene.add(stack);
  const meshes = ingredients.map((layer, index) => {
    const map = new T.Texture(images[index]);
    map.colorSpace = T.SRGBColorSpace;
    map.needsUpdate = true;
    const material = new T.MeshBasicMaterial({ map, transparent: true, depthTest: false, depthWrite: false, toneMapped: false });
    const mesh = new T.Mesh(geometryFromSilhouette(T, layer), material);
    mesh.renderOrder = ingredients.length - index;
    stack.add(mesh);
    return mesh;
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  canvas.style.cssText = "display:block;width:100%;height:100%";
  host.appendChild(canvas);
  let previousWidth = 0;
  let previousHeight = 0;
  return {
    paint({ width, height, scale, progress, tilt, yaw, pitch }) {
      if (previousWidth !== width || previousHeight !== height) {
        previousWidth = width;
        previousHeight = height;
        renderer.setSize(width, height, false);
        camera.left = -width / 2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = -height / 2;
        camera.updateProjectionMatrix();
      }
      stack.scale.setScalar(scale);
      stack.rotation.set(pitch, yaw, tilt, "ZXY");
      meshes.forEach((mesh, i) => {
        const layer = ingredients[i];
        mesh.position.set(mix(layer.x, layer.openX, progress), mix(layer.y, layer.openY, progress), 0);
        mesh.rotation.z = layer.twist * progress;
        mesh.rotation.y = (i - 2) * progress * 0.043;
      });
      renderer.render(scene, camera);
    },
    dispose() {
      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.map?.dispose();
        mesh.material.dispose();
      });
      renderer.dispose();
      canvas.remove();
    },
  };
}

function flatSurface(host: HTMLDivElement, images: HTMLImageElement[]): Surface | null {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  canvas.style.cssText = "display:block;width:100%;height:100%";
  host.appendChild(canvas);
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  return {
    paint({ width, height, scale, progress, tilt }) {
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      ctx.rotate(-tilt);
      for (let i = ingredients.length - 1; i >= 0; i--) {
        const layer = ingredients[i];
        ctx.save();
        ctx.translate(mix(layer.x, layer.openX, progress), -mix(layer.y, layer.openY, progress));
        ctx.rotate(-layer.twist * progress);
        ctx.drawImage(images[i], -layer.width / 2, -layer.height / 2, layer.width, layer.height);
        ctx.restore();
      }
    },
    dispose() { canvas.remove(); },
  };
}

export default function BurgerScene({ exploded = false, className }: { exploded?: boolean; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const opened = useRef(exploded);
  const wake = useRef<() => void>(() => {});

  useEffect(() => {
    opened.current = exploded;
    wake.current();
  }, [exploded]);

  useEffect(() => {
    const host = hostRef.current;
    const poster = posterRef.current;
    if (!host || !poster) return;
    const hero = host.closest("[data-burger-scroll], section, header") ?? host;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let disposed = false;
    let visible = true;
    let surface: Surface | null = null;
    let bitmaps: HTMLImageElement[] = [];
    let raf = 0;
    let lastTime = 0;
    let progress = 0;
    let targetX = 0;
    let targetY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let width = host.clientWidth;
    let height = host.clientHeight;
    let startY = 0;
    let distance = 1;

    function requestFrame() {
      if (visible && !disposed && !raf && surface) raf = requestAnimationFrame(draw);
    }
    function draw(time: number) {
      raf = 0;
      if (!surface || !poster || !width || !height) return;
      const scroll = reduced.matches ? 0 : clamp((window.scrollY - startY) / distance);
      const goal = Math.max(Number(opened.current), scroll);
      const blend = reduced.matches ? 1 : 1 - Math.exp(-Math.min(48, time - lastTime || 16) / 97);
      lastTime = time;
      progress = mix(progress, goal, blend);
      pointerX = mix(pointerX, reduced.matches ? 0 : targetX, blend);
      pointerY = mix(pointerY, reduced.matches ? 0 : targetY, blend);
      const scale = Math.min(width / mix(1110, 1130, progress), height / mix(820, 1380, progress));
      surface.paint({
        width, height, scale, progress,
        tilt: mix(7 * Math.PI / 180, -0.022, progress),
        yaw: progress * 0.14 + pointerX * 0.085,
        pitch: progress * 0.027 - pointerY * 0.036,
      });
      poster.style.visibility = "hidden";
      if (Math.abs(goal - progress) + Math.abs((reduced.matches ? 0 : targetX) - pointerX) + Math.abs((reduced.matches ? 0 : targetY) - pointerY) > 0.001) requestFrame();
    }
    function measure() {
      if (!host) return;
      width = host.clientWidth;
      height = host.clientHeight;
      const rect = hero.getBoundingClientRect();
      startY = rect.top + window.scrollY;
      distance = Math.max(1, Math.min(rect.height * 0.68, window.innerHeight * 0.72));
      requestFrame();
    }
    function point(event: PointerEvent) {
      if (!host || !finePointer.matches || reduced.matches || !visible || event.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      const nextX = inside ? x * 2 - 1 : 0;
      const nextY = inside ? y * 2 - 1 : 0;
      if (nextX === targetX && nextY === targetY) return;
      targetX = nextX;
      targetY = nextY;
      requestFrame();
    }
    function loseContext(event: Event) {
      event.preventDefault();
      if (!host || !poster || disposed) return;
      surface?.dispose();
      surface = flatSurface(host, bitmaps);
      poster.style.visibility = "visible";
      requestFrame();
    }
    const size = new ResizeObserver(measure);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestFrame();
    });
    size.observe(host);
    visibility.observe(host);
    window.addEventListener("scroll", requestFrame, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", point, { passive: true });
    reduced.addEventListener("change", requestFrame);
    host.addEventListener("webglcontextlost", loseContext, true);
    wake.current = requestFrame;
    measure();

    async function prepare() {
      if (!host) return;
      bitmaps = await Promise.all(ingredients.map(async (layer) => {
        const image = new window.Image();
        image.src = `/burger/${layer.id}.webp`;
        await image.decode();
        return image;
      }));
      if (disposed) return;
      if (!reduced.matches) {
        try {
          const T = await import("three");
          if (disposed) return;
          surface = webglSurface(T, host, bitmaps);
        } catch { /* GPU-less browsers use the same photographic layers in Canvas 2D. */ }
      }
      if (!surface) surface = flatSurface(host, bitmaps);
      requestFrame();
    }
    void prepare().catch(() => { /* Keep the server-rendered poster if an asset fails to decode. */ });
    return () => {
      disposed = true;
      wake.current = () => {};
      cancelAnimationFrame(raf);
      size.disconnect();
      visibility.disconnect();
      window.removeEventListener("scroll", requestFrame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", point);
      reduced.removeEventListener("change", requestFrame);
      host.removeEventListener("webglcontextlost", loseContext, true);
      surface?.dispose();
      poster.style.visibility = "visible";
    };
  }, []);

  return (
    <div role="img" aria-label="Interprétation 3D d’un double smash burger au cheddar" className={className} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Image unoptimized preload ref={posterRef} src="/burger/stack.webp" alt="" fill sizes="(max-width: 700px) 100vw, 55vw" style={{ objectFit: "contain" }} />
      <div ref={hostRef} aria-hidden="true" style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}
