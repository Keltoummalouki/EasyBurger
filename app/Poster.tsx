"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import BurgerScene from "./BurgerScene";

const navLinks = [["La carte", "#menu"], ["Les moments", "#moments"], ["Les avis", "#avis"]] as const;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={diagonal ? "arrow-diagonal" : undefined}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function Pin() {
  return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19.5 10c0 5.2-7.5 11-7.5 11s-7.5-5.8-7.5-11a7.5 7.5 0 1 1 15 0Z" stroke="currentColor" strokeWidth="1.9"/><circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8"/></svg>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const dismiss = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", dismiss);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", dismiss);
    };
  }, [open]);
  return (
    <header ref={header} className="site-head">
      <div className="head-inner">
        <a className="wordmark" href="#accueil" aria-label="Easy Burger, accueil">
          <span className="word-easy">easy</span><span className="word-burger">BURGER</span>
        </a>
        <nav className="head-nav" aria-label="Navigation principale">
          {navLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="head-actions">
          <a className="address-link" href="#adresse"><Pin /> Nous trouver</a>
          <button ref={toggle} className="nav-toggle" type="button" aria-label={open ? "Fermer la navigation" : "Ouvrir la navigation"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">{open ? <path d="m5 5 14 14M19 5 5 19" /> : <path d="M3 7h18M3 12h18M3 17h18"/>}</svg>
          </button>
        </div>
      </div>
      {open && <nav id="mobile-nav" aria-label="Navigation mobile" className="mobile-nav">{navLinks.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<Arrow /></a>)}</nav>}
    </header>
  );
}

function SmashStamp() {
  const outline = Array.from({ length: 56 }, (_, i) => {
    const a = i * Math.PI / 28;
    const r = i % 2 ? 47 : 50;
    return [(52 + Math.cos(a) * r).toFixed(2), (52 + Math.sin(a) * r).toFixed(2)].join(",");
  }).join(" ");
  return <svg className="smash-stamp" viewBox="0 0 104 104" aria-label="Smashé minute" role="img">
    <polygon points={outline} fill="#FFDE55" />
    <g fill="currentColor" textAnchor="middle" fontFamily="Barlow Condensed, sans-serif" fontWeight="900">
      <text x="52" y="45" fontSize="23.5">SMASHÉ</text><text x="52" y="64" fontSize="21.6">MINUTE</text>
    </g>
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m43 74 6 2 14-4M45 25l-2-3m9 2v-4m7 5 3-3"/></g>
  </svg>;
}

function PointerNote() {
  return <div className="pointer-note" aria-hidden="true">
    <svg viewBox="0 0 65 35" width="60" height="32" fill="none"><path d="M60 29C38 34 17 26 9 7m-3 9L8 5l12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    <span>Double Easy</span>
  </div>;
}

export function Hero() {
  const [exploded, setExploded] = useState(false);
  const stamp = useRef<HTMLDivElement>(null);
  const wiggle = useRef<ReturnType<typeof animate> | null>(null);
  useEffect(() => () => { wiggle.current?.cancel(); }, []);
  function toggleLayers() {
    setExploded(!exploded);
    if (!stamp.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    wiggle.current?.cancel();
    wiggle.current = animate(stamp.current, { rotate: [0, -11, 4, 0], duration: 480, ease: "outQuad" });
  }
  return (
    <section className="poster-hero" id="accueil" aria-labelledby="hero-title">
      <div className="poster-rays" aria-hidden="true"/>
      <div className="hero-wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title"><span>LE SMASH</span><span className="cream-line">DE CASA<span className="hero-period">.</span></span></h1>
            <p>Du bœuf smashé sur la plaque, du cheddar fondant et un bun doré. Bienvenue chez Easy Burger.</p>
            <a className="menu-cta" href="#menu">Voir la carte <Arrow /></a>
          </div>
          <div className="hero-visual">
            <div ref={stamp} className="stamp-wrap"><SmashStamp /></div>
            <svg className="sizzle-lines" viewBox="0 0 61 57" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="5" strokeLinecap="round"><path d="m6 29 19 10M23 8l11 22M45 4l-1 17"/></g></svg>
            <div className="hero-art" id="burger-en-3d"><BurgerScene exploded={exploded}/></div>
            <PointerNote />
          </div>
        </div>
        <div className="hero-rail">
          <a href="#adresse" className="hero-place"><Pin /><span>Casablanca, Maroc</span></a>
          <button type="button" className="layer-button" aria-controls="burger-en-3d" aria-pressed={exploded} onClick={toggleLayers}>
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" strokeLinecap="round"><path d="m10 2 7 4-7 4-7-4 7-4Zm-7 8 7 4 7-4m-14 4 7 4 7-4"/></g></svg>
            {exploded ? "Réassembler le burger" : "Déplier le burger"}<span className="layer-indicator">3D</span>
          </button>
        </div>
      </div>
    </section>
  );
}

const stripWords = ["SMASH BURGERS", "CASABLANCA", "EASY BURGER", "SMASHÉ MINUTE"];
export function PosterStrip() {
  return <div className="poster-strip" aria-hidden="true"><div className="strip-track">
    {Array.from({ length: 4 }, (_, index) => stripWords.map(word => <div className="strip-item" key={index + word}>{word}<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="m8 0 4 0-.65 6.4L16 2.2l2.6 3.1-5.35 3.5 6.75.1v4l-6.5-1.1 4.4 5.2-3.1 2.45-3.5-5.75-.2 6.3H7.4l.95-6.6-4.8 4.7-2.5-3.1 5.4-3.75L0 11.3V7.5l6.55 1L2.1 3.3 5.15 1l3.6 5.75Z"/></svg></div>))}
  </div></div>;
}

export function ScrollMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ duration: 0.85, anchors: true, smoothWheel: true });
      const frame = (s: number) => lenis.raf(s * 1000);
      gsap.ticker.add(frame);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.to(".strip-track", {
        x: -160, ease: "none",
        scrollTrigger: { trigger: ".poster-strip", start: "top bottom", end: "bottom top", scrub: true },
      });
      return () => { gsap.ticker.remove(frame); lenis.destroy(); };
    });
    return () => media.revert();
  }, []);
  return null;
}
