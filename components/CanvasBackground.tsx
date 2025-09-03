
import React, { useRef, useEffect, useState } from 'react';

const CanvasBackground: React.FC = () => {
    const gradRef = useRef<HTMLCanvasElement>(null);
    const roseRef = useRef<HTMLCanvasElement>(null);
    const partRef = useRef<HTMLCanvasElement>(null);
    const [running, setRunning] = useState(true);
    const [boost, setBoost] = useState(0);

    useEffect(() => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            setRunning(false);
            return;
        }

        const DPR = Math.min(window.devicePixelRatio || 1, 2);
        const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
        const rand = (a: number, b: number) => Math.random() * (b - a) + a;
        const TAU = Math.PI * 2;

        const grad = gradRef.current;
        const rose = roseRef.current;
        const part = partRef.current;
        if (!grad || !rose || !part) return;

        const ctxG = grad.getContext('2d');
        const ctxR = rose.getContext('2d');
        const ctxP = part.getContext('2d');
        if (!ctxG || !ctxR || !ctxP) return;

        let W = 0, H = 0;
        const resize = () => {
            W = window.innerWidth;
            H = window.innerHeight;
            [grad, rose, part].forEach(c => {
                c.width = W * DPR;
                c.height = H * DPR;
                c.style.width = W + 'px';
                c.style.height = H + 'px';
            });
            ctxG.setTransform(DPR, 0, 0, DPR, 0, 0);
            ctxR.setTransform(DPR, 0, 0, DPR, 0, 0);
            ctxP.setTransform(DPR, 0, 0, DPR, 0, 0);
            initParticles();
        };

        const orbs = Array.from({ length: 4 }, (_, i) => ({
            x: rand(0, window.innerWidth), y: rand(0, window.innerHeight),
            r: rand(200, 420),
            vx: rand(-0.2, 0.2), vy: rand(-0.15, 0.15),
            hue: [48, 210, 230, 55][i % 4],
        }));

        const drawGradient = () => {
            ctxG.clearRect(0, 0, W, H);
            ctxG.globalCompositeOperation = 'lighter';
            orbs.forEach(o => {
                o.x += o.vx; o.y += o.vy;
                if (o.x < -o.r || o.x > W + o.r) o.vx *= -1;
                if (o.y < -o.r || o.y > H + o.r) o.vy *= -1;
                const r = o.r + boost * 60;
                const g = ctxG.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
                const a1 = 0.18 + boost * 0.05;
                g.addColorStop(0, `hsla(${o.hue}, 80%, 65%, ${a1})`);
                g.addColorStop(1, `hsla(${o.hue}, 80%, 55%, 0)`);
                ctxG.fillStyle = g;
                ctxG.beginPath();
                ctxG.arc(o.x, o.y, r, 0, TAU);
                ctxG.fill();
            });
            ctxG.globalCompositeOperation = 'source-over';
        };

        let roseAngle = 0;
        const drawRose = () => {
            const cx = W / 2, cy = H / 2;
            const R = Math.min(W, H) * (W > 768 ? 0.28 : 0.38);
            const k = 5 / 8;
            ctxR.clearRect(0, 0, W, H);
            ctxR.save();
            ctxR.translate(cx, cy);
            ctxR.rotate(roseAngle);
            ctxR.beginPath();
            for (let a = 0; a <= TAU * 8; a += 0.005) {
                const r = R * Math.cos(k * a);
                ctxR.lineTo(r * Math.cos(a), r * Math.sin(a));
            }
            ctxR.strokeStyle = 'rgba(241,216,139,.4)';
            ctxR.lineWidth = 0.8;
            ctxR.globalCompositeOperation = 'lighter';
            ctxR.stroke();
            ctxR.restore();
            roseAngle += 0.0008 * (1 + boost);
        };

        const P: { x: number, y: number, vx: number, vy: number, size: number }[] = [];
        const initParticles = () => {
            P.length = 0;
            const count = (W > 1200 ? 150 : W > 800 ? 110 : 70);
            for (let i = 0; i < count; i++) {
                P.push({
                    x: rand(0, W), y: rand(0, H),
                    vx: rand(-0.4, 0.4), vy: rand(-0.35, 0.35),
                    size: rand(0.6, 1.6)
                });
            }
        };

        const drawParticles = () => {
            ctxP.clearRect(0, 0, W, H);
            const linkDist = W > 900 ? 140 : 110;
            P.forEach((p, i) => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
                const dx = (W / 2 - p.x) * 0.0005, dy = (H / 2 - p.y) * 0.0005;
                p.vx += dx; p.vy += dy;
                p.vx = clamp(p.vx, -0.6, 0.6); p.vy = clamp(p.vy, -0.6, 0.6);
                ctxP.beginPath();
                ctxP.arc(p.x, p.y, p.size, 0, TAU);
                ctxP.fillStyle = 'rgba(255,255,255,.7)';
                ctxP.fill();
                for (let j = i + 1; j < P.length; j++) {
                    const q = P[j];
                    const d2 = (p.x - q.x)**2 + (p.y - q.y)**2;
                    if (d2 < linkDist**2) {
                        const a = 1 - Math.sqrt(d2) / linkDist;
                        ctxP.strokeStyle = `rgba(139,184,255,${0.2 * a + 0.05 * boost})`;
                        ctxP.lineWidth = 1;
                        ctxP.beginPath();
                        ctxP.moveTo(p.x, p.y);
                        ctxP.lineTo(q.x, q.y);
                        ctxP.stroke();
                    }
                }
            });
        };

        let rafId: number | null = null;
        let localRunning = !prefersReduced;

        const loop = () => {
            if (!localRunning) return;
            drawGradient();
            drawRose();
            drawParticles();
            rafId = requestAnimationFrame(loop);
        };
        
        setRunning(!prefersReduced);
        resize();
        window.addEventListener('resize', resize);
        if (!prefersReduced) {
          rafId = requestAnimationFrame(loop);
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                localRunning = false;
                if (rafId) cancelAnimationFrame(rafId);
            } else if (!prefersReduced) {
                localRunning = true;
                if(rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(loop);
            }
            setRunning(!document.hidden && !prefersReduced);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('resize', resize);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [boost]);

    const toggleAnimation = () => setRunning(prev => !prev);
    const toggleBoost = () => setBoost(prev => (prev ? 0 : 1));

    return (
        <>
            <canvas id="canvas-grad" ref={gradRef} aria-hidden="true" className="fixed inset-0 w-full h-full z-0 block"></canvas>
            <canvas id="canvas-rose" ref={roseRef} aria-hidden="true" className="fixed inset-0 w-full h-full z-0 block opacity-25"></canvas>
            <canvas id="canvas-particles" ref={partRef} aria-hidden="true" className="fixed inset-0 w-full h-full z-0 block"></canvas>
            <div className="fixed right-3.5 bottom-3.5 z-50 flex gap-2 items-center" role="group" aria-label="Canvas controls">
                <button className="chip" onClick={toggleAnimation} type="button" aria-pressed={!running}>
                    {running ? 'Pause Animation' : 'Resume Animation'}
                </button>
                <button className="chip" onClick={toggleBoost} type="button">
                    {boost ? 'Calm Glow' : 'Boost Glow'}
                </button>
                <style>{`
                    .chip {
                        border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04);
                        padding: 8px 10px; border-radius: 12px; font-size: 12.5px; cursor: pointer; user-select: none;
                    }
                    .chip:focus {
                        outline: 2px solid #9ad7ff;
                    }
                `}</style>
            </div>
        </>
    );
};

export default CanvasBackground;