"use client";

import React from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { AnimatePresence, animate, motion, useIsPresent, useMotionValue, useReducedMotion } from "framer-motion";
import { motionTokens } from "./motion-tokens";
import { Button } from "../../button/button";
import { FRAMES, KINDS, VIEW, shapePath } from "./empty-states-art";
import type { Frame, Phase, SceneId } from "./empty-states-art";
import styles from "./empty-states.module.css";
import "./foundation.css";

/**
 * One product illustration for four empty states. The tabs pick a state; every shape in the drawing travels to its new
 * position, size, radius, rotation and color on a spring, outlines morph point by point, and line accents draw in a beat later.
 * Each primary action does something local and visible: filters clear into results, a retry reconnects after a short wait,
 * a mail check redraws the check, and a lost page is found in the archive. Nothing here talks to a server.
 */

type View = { scene: SceneId; phase: Phase; from: Phase };
type Copy = { title: string; line: string; action: string };

const SCENES: { id: SceneId; tab: string }[] = [
  { id: "search", tab: "No results" },
  { id: "offline", tab: "Offline" },
  { id: "inbox", tab: "Caught up" },
  { id: "map", tab: "Not found" },
];

const COPY: Record<SceneId, { idle: Copy; done: Copy; loading: string; wait: number }> = {
  search: {
    idle: { title: "Aucun résultat trouvé", line: "Essayez de modifier votre recherche,vos filtres ou réessayer plus tard.", action: "Réinitialiser" },
    done: { title: "Résultats trouvés", line: "Affichage des éléments correspondants.", action: "Rétablir" },
    loading: "", wait: 0,
  },
  offline: {
    idle: { title: "Une erreur est survenue", line: "Impossible de charger les données. Vérifiez votre connexion ou réessayez plus tard.", action: "Réessayer" },
    done: { title: "De nouveau en ligne", line: "Vos modifications sont synchronisées.", action: "Hors-ligne" },
    loading: "Vérification du réseau...", wait: 1400,
  },
  inbox: {
    idle: { title: "Tout est à jour", line: "Vous avez lu tous les messages enregistrés.", action: "Actualiser" },
    done: { title: "Aucune nouveauté", line: "Vérification effectuée à l'instant.", action: "Revérifier" },
    loading: "Chargement...", wait: 1100,
  },
  map: {
    idle: { title: "Page introuvable", line: "Le lien est cassé ou la page que vous cherchez a été déplacée.", action: "Rechercher" },
    done: { title: "Element retrouvé", line: "La page a été archivée ou déplacée récemment.", action: "Retour" },
    loading: "Recherche de la page...", wait: 1200,
  },
};

/** Shapes lead, details trail: back tiles, body, front tiles, then lines and the mark. Totals stay under 0.4s. */
const DELAY = [.05, .03, 0, .04, .07, .1, .06, .09, .11, .14];
const NUDGE = [.03, .015, 0, .02, .035, .05, .02, .04, .05, .07];
const DRIFT = 2.5;

const first = FRAMES.search.idle;
const INITIAL = first.prims.map((p, i) => ({ ...shapePath(KINDS[i], p.geo, p.fx[1], 0, 0), o: String(p.fx[0]) }));

const enter = [...motionTokens.ease.enter] as [number, number, number, number];
const standard = [...motionTokens.ease.standard] as [number, number, number, number];

/** Motion's visualDuration and bounce, turned into stiffness and damping for the vector springs below. */
function springOf({ visualDuration, bounce }: { visualDuration: number; bounce: number }) {
  const root = (2 * Math.PI) / (visualDuration * 1.2);
  return { k: root * root, c: 2 * Math.min(1, Math.max(.05, 1 - bounce)) * root };
}
const MORPH = springOf(motionTokens.spring.morph), SMOOTH = springOf(motionTokens.spring.smooth), SWAY = { k: 90, c: 19 };

type Channel = { pos: Float64Array; vel: Float64Array; target: Float64Array; queue: { at: number; values: number[] }[]; k: number; c: number; still: boolean };
const channel = (values: number[], spring: { k: number; c: number }): Channel =>
  ({ pos: Float64Array.from(values), vel: new Float64Array(values.length), target: Float64Array.from(values), queue: [], ...spring, still: true });

/** Integrates one spring vector. A new target keeps the current velocity, so shapes retarget mid-flight without a hitch. */
function advance(ch: Channel, now: number, dt: number) {
  while (ch.queue.length && ch.queue[0].at <= now) {
    const next = ch.queue.shift();
    if (next) { ch.target.set(next.values); ch.still = false; }
  }
  if (!ch.still) {
    const steps = Math.max(1, Math.ceil(dt * 240)), h = dt / steps, { pos, vel, target, k, c } = ch;
    for (let s = 0; s < steps; s++) for (let i = 0; i < pos.length; i++) { vel[i] += (-k * (pos[i] - target[i]) - c * vel[i]) * h; pos[i] += vel[i] * h; }
    let settled = true;
    for (let i = 0; i < pos.length; i++) if (Math.abs(pos[i] - target[i]) > .004 || Math.abs(vel[i]) > .02) { settled = false; break; }
    if (settled) { pos.set(target); vel.fill(0); ch.still = true; }
  }
  return !ch.still || ch.queue.length > 0;
}

type Nodes = { paths: SVGPathElement[]; ghosts: SVGPathElement[]; main: SVGGElement; ghost: SVGGElement };

/** One animation frame loop drives every shape through refs. It sleeps once everything has settled. */
function createEngine(nodes: Nodes, start: Frame) {
  const geo = start.prims.map(p => channel(p.geo, MORPH));
  const fx = start.prims.map(p => channel(p.fx, SMOOTH));
  const sway = channel([0, 0], SWAY);
  const written = INITIAL.map(item => ({ d: item.d, o: item.o, dash: item.dash }));
  let frame = start, raf = 0, last = 0, parallax = false;

  const paint = () => {
    const ox = sway.pos[0] * DRIFT, oy = sway.pos[1] * DRIFT;
    nodes.paths.forEach((node, i) => {
      const { d, dash } = shapePath(KINDS[i], geo[i].pos, fx[i].pos[1], ox, oy);
      const o = String(Math.round(Math.min(1, Math.max(0, fx[i].pos[0])) * 1000) / 1000);
      if (d !== written[i].d) { node.setAttribute("d", d); written[i].d = d; }
      if (o !== written[i].o) { node.setAttribute("opacity", o); written[i].o = o; }
      if (dash !== written[i].dash) { node.setAttribute("stroke-dasharray", dash); written[i].dash = dash; }
    });
  };
  const tick = (time: number) => {
    raf = 0;
    const now = time / 1000, dt = last ? Math.min(.034, Math.max(0, now - last)) : 1 / 60;
    last = now;
    let busy = advance(sway, now, dt);
    for (let i = 0; i < geo.length; i++) busy = advance(geo[i], now, dt) || busy;
    for (let i = 0; i < fx.length; i++) busy = advance(fx[i], now, dt) || busy;
    paint();
    if (busy) raf = requestAnimationFrame(tick); else last = 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

  const pointer = (x: number, y: number) => {
    sway.queue = [];
    sway.target.set(parallax ? [x, y] : [0, 0]);
    sway.still = false;
    kick();
  };

  return {
    pointer,
    go(next: Frame, sceneChanged: boolean, reduced: boolean) {
      if (reduced) {
        // Crossfade without travel: freeze the old drawing in a ghost layer, snap to the new one, and fade between them.
        nodes.paths.forEach((node, i) => {
          const ghost = nodes.ghosts[i];
          ghost.setAttribute("d", node.getAttribute("d") ?? "");
          ghost.setAttribute("opacity", node.getAttribute("opacity") ?? "1");
          ghost.setAttribute("stroke-dasharray", node.getAttribute("stroke-dasharray") ?? "none");
          ghost.dataset.tone = frame.prims[i].tone;
        });
        next.prims.forEach((p, i) => {
          for (const [ch, values] of [[geo[i], p.geo], [fx[i], p.fx]] as const) { ch.queue = []; ch.target.set(values); ch.pos.set(values); ch.vel.fill(0); ch.still = true; }
        });
        frame = next;
        paint();
        animate(nodes.ghost, { opacity: [1, 0] }, { duration: motionTokens.duration.standard, ease: standard });
        animate(nodes.main, { opacity: [0, 1] }, { duration: motionTokens.duration.standard, ease: standard });
        return;
      }
      const now = performance.now() / 1000, delays = sceneChanged ? DELAY : NUDGE;
      next.prims.forEach((p, i) => {
        geo[i].queue = [{ at: now + delays[i], values: p.geo }];
        if (sceneChanged && p.redraw) fx[i].queue = [{ at: now, values: [p.fx[0], 0] }, { at: now + delays[i] + .18, values: p.fx }];
        else fx[i].queue = [{ at: now + delays[i] + (p.fx[1] > fx[i].target[1] + .01 ? .12 : 0), values: p.fx }];
      });
      frame = next;
      kick();
    },
    setParallax(on: boolean) { parallax = on; if (!on) pointer(0, 0); },
    destroy() { if (raf) cancelAnimationFrame(raf); raf = 0; },
  };
}

interface EmptyStatesProps {
  defaultScene?: SceneId;
}

export function EmptyStates({ defaultScene = "map" }: EmptyStatesProps) {
  const uid = useId();
  const reduced = useReducedMotion() ?? false;

  // Utilise directement la scene voulue dès le premier render
  const [view, setView] = useState<View>({ scene: defaultScene, phase: "idle", from: "idle" });
  const [announcement, setAnnouncement] = useState("");

  const paths = useRef<(SVGPathElement | null)[]>([]);
  const ghosts = useRef<(SVGPathElement | null)[]>([]);
  const mainLayer = useRef<SVGGElement>(null);
  const ghostLayer = useRef<SVGGElement>(null);
  const engine = useRef<ReturnType<typeof createEngine> | null>(null);
  const shown = useRef({ scene: view.scene, phase: view.phase });
  const pending = useRef({ timer: 0 });
  const copyInner = useRef<HTMLDivElement>(null);
  const copyHeight = useMotionValue<number | "auto">("auto");
  const armedUntil = useRef(0);

  const frame = FRAMES[view.scene][view.phase];
  const text = COPY[view.scene];
  const copy: Copy = view.phase === "loading" ? { ...text[view.from === "done" ? "done" : "idle"], line: text.loading } : text[view.phase === "done" ? "done" : "idle"];
  const copyKey = `${copy.title}|${copy.line}`;

  // Récupération dynamique des formes selon la scène initiale
  const initialFrame = FRAMES[defaultScene].idle;
  const initialShapes = useRef(
      initialFrame.prims.map((p, i) => ({
        ...shapePath(KINDS[i], p.geo, p.fx[1], 0, 0),
        o: String(p.fx[0]),
      }))
  ).current;

  useEffect(() => {
    const main = mainLayer.current, ghost = ghostLayer.current;
    const nodes = paths.current.filter(Boolean) as SVGPathElement[], ghostNodes = ghosts.current.filter(Boolean) as SVGPathElement[];
    if (!main || !ghost || nodes.length !== KINDS.length || ghostNodes.length !== KINDS.length) return;

    // Initialisation exacte sur la scène demandée sans repasser par search
    const instance = createEngine({ paths: nodes, ghosts: ghostNodes, main, ghost }, initialFrame);
    engine.current = instance;
    const bag = pending.current;
    return () => { instance.destroy(); engine.current = null; window.clearTimeout(bag.timer); };
  }, []);

  useEffect(() => {
    const fine = typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    engine.current?.setParallax(fine && !reduced);
  }, [reduced]);

  useEffect(() => {
    const prev = shown.current;
    if (prev.scene === view.scene && prev.phase === view.phase) return;
    shown.current = { scene: view.scene, phase: view.phase };
    engine.current?.go(FRAMES[view.scene][view.phase], prev.scene !== view.scene, reduced);
  }, [view.scene, view.phase, reduced]);

  useLayoutEffect(() => { armedUntil.current = performance.now() + 700; }, [copyKey]);
  useEffect(() => {
    const node = copyInner.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    let measured = false;
    const observer = new ResizeObserver(([entry]) => {
      const next = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
      if (!measured || reduced || performance.now() > armedUntil.current) { measured = true; copyHeight.jump(next); return; }
      animate(copyHeight, next, motionTokens.spring.smooth);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, copyHeight]);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    engine.current?.pointer(((event.clientX - rect.left) / rect.width - .5) * 2, ((event.clientY - rect.top) / rect.height - .5) * 2);
  }

  const rise = reduced
      ? { initial: { opacity: 0 }, exit: { opacity: 0, transition: { duration: motionTokens.duration.exit } } }
      : { initial: { opacity: 0, y: 8, filter: `blur(${motionTokens.blur.soft}px)` }, exit: { opacity: 0, y: -6, filter: `blur(${motionTokens.blur.soft}px)`, transition: { duration: motionTokens.duration.exit, ease: standard } } };
  const shownText = { opacity: 1, y: 0, filter: "blur(0px)" };
  const textIn = (delay: number) => ({ duration: reduced ? motionTokens.duration.standard : motionTokens.duration.considered, ease: enter, delay: reduced ? 0 : delay });

  return (
      <section className={styles.root} aria-label="Empty states">
        <div className={styles.card}>
          <div className={styles.panel} role="tabpanel" id={`${uid}-panel`}>
            <div className={styles.stage} onPointerMove={onPointerMove} onPointerLeave={() => engine.current?.pointer(0, 0)}>
              <svg className={styles.art} viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} role="img" aria-label={frame.label}>
                <g ref={ghostLayer} opacity={0} aria-hidden="true">
                  {KINDS.map((kind, i) => <path key={i} ref={node => { ghosts.current[i] = node; }} className={styles.shape} data-kind={kind} d="" />)}
                </g>
                <g ref={mainLayer}>
                  {initialShapes.map((item, i) => (
                      <path key={i} ref={node => { paths.current[i] = node; }} className={styles.shape} data-kind={KINDS[i]} data-tone={frame.prims[i].tone} d={item.d} opacity={item.o} strokeDasharray={item.dash} style={{ transitionDelay: `${DELAY[i]}s` }} />
                  ))}
                </g>
              </svg>
            </div>

            <div className={styles.copy}>
              <motion.div className={styles.copyFrame} style={{ height: copyHeight }}>
                <div ref={copyInner} className={styles.copyInner}>
                  <h2 className={styles.title}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span key={copy.title} className={styles.swap} initial={rise.initial} animate={shownText} exit={rise.exit} transition={textIn(.06)}>{copy.title}</motion.span>
                    </AnimatePresence>
                  </h2>
                  <p className={styles.line}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span key={copy.line} className={styles.swap} initial={rise.initial} animate={shownText} exit={rise.exit} transition={textIn(.06 + motionTokens.stagger.word)}>{copy.line}</motion.span>
                    </AnimatePresence>
                  </p>
                </div>
              </motion.div>
            </div>
            <p className={styles.srOnly} aria-live="polite">{announcement}</p>
          </div>
        </div>
      </section>
  );
}

export default EmptyStates;
