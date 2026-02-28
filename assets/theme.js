(function () {
  const theme = {
    bg: '#050b14',
    surface: '#0f1a2b',
    cyan: '#22d3ee',
    emerald: '#34d399',
    border: '#334155',
    textSoft: '#cbd5e1',
    textMuted: '#94a3b8',
    grid: 'rgba(148,163,184,0.15)',
    amber: '#f59e0b',
    line: 'rgba(34,211,238,0.15)'
  };

  window.ThemePalette = theme;

  function readNumber(canvas, key, fallback) {
    const raw = canvas.dataset[key];
    if (raw == null || raw === '') return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }

  function createParticlesRenderer(canvas, ctx) {
    const particleCount = readNumber(canvas, 'particleCount', 120);
    const particleSize = readNumber(canvas, 'particleSize', 2.8);
    const particleSpeed = readNumber(canvas, 'particleSpeed', 1);
    const linkDistance = readNumber(canvas, 'linkDistance', 120);

    let particles = [];

    return {
      reset(width, height) {
        particles = Array.from({ length: particleCount }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * particleSpeed,
          vy: (Math.random() - 0.5) * particleSpeed
        }));
      },
      draw(width, height) {
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < particleCount; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.fillStyle = theme.emerald;
          ctx.beginPath();
          ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
          ctx.fill();

          for (let j = i + 1; j < particleCount; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < linkDistance) {
              ctx.strokeStyle = theme.line;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }
    };
  }

  function createMathGridRenderer(canvas, ctx) {
    const gridSize = readNumber(canvas, 'gridSize', 52);
    let mouseX = 0.5;
    let mouseY = 0.5;

    window.addEventListener('mousemove', (event) => {
      mouseX = event.clientX / Math.max(window.innerWidth, 1);
      mouseY = event.clientY / Math.max(window.innerHeight, 1);
    });

    return {
      reset() {},
      draw(width, height, time) {
        const t = time * 0.001;

        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = 1;

        for (let x = 0; x <= width; x += gridSize) {
          const bend = Math.sin(t + x * 0.02 + mouseX * 3) * 6;
          ctx.strokeStyle = `rgba(34,211,238,${0.06 + 0.06 * Math.sin(t + x * 0.01)})`;
          ctx.beginPath();
          ctx.moveTo(x, bend);
          ctx.lineTo(x, height + bend);
          ctx.stroke();
        }

        for (let y = 0; y <= height; y += gridSize) {
          const bend = Math.cos(t + y * 0.018 + mouseY * 3) * 6;
          ctx.strokeStyle = `rgba(52,211,153,${0.05 + 0.05 * Math.cos(t + y * 0.012)})`;
          ctx.beginPath();
          ctx.moveTo(0, y + bend);
          ctx.lineTo(width, y + bend);
          ctx.stroke();
        }

        const centerY = height * 0.5;
        const ampA = 32 + mouseY * 20;
        const ampB = 22 + mouseX * 18;

        ctx.lineWidth = 1.6;
        ctx.strokeStyle = 'rgba(34,211,238,0.65)';
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const y = centerY + Math.sin(x * 0.02 + t * 2.2) * ampA;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.strokeStyle = 'rgba(245,158,11,0.55)';
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const y = centerY + Math.cos(x * 0.018 - t * 1.7) * ampB;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };
  }

  function createParametricRenderer(canvas, ctx) {
    return {
      reset() {},
      draw(width, height, time) {
        const t = time * 0.001;
        const cx = width * 0.5;
        const cy = height * 0.5;
        const scale = Math.min(width, height) * 0.24;

        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(100,116,139,0.18)';
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(width, cy);
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, height);
        ctx.stroke();

        for (let r = scale * 0.35; r <= scale * 1.25; r += scale * 0.23) {
          ctx.strokeStyle = 'rgba(148,163,184,0.10)';
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        const curves = [
          { a: 3, b: 2, phase: t * 0.9, color: 'rgba(34,211,238,0.72)' },
          { a: 5, b: 4, phase: t * 0.7 + Math.PI / 3, color: 'rgba(52,211,153,0.62)' },
          { a: 7, b: 3, phase: t * 0.5 + Math.PI / 6, color: 'rgba(245,158,11,0.50)' }
        ];

        curves.forEach((curve) => {
          ctx.lineWidth = 1.6;
          ctx.strokeStyle = curve.color;
          ctx.beginPath();
          for (let i = 0; i <= 800; i++) {
            const p = (i / 800) * Math.PI * 2;
            const x = cx + Math.sin(curve.a * p + curve.phase) * scale;
            const y = cy + Math.cos(curve.b * p) * scale * 0.82;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });
      }
    };
  }

  function createVectorFieldRenderer(canvas, ctx) {
    const tracerCount = readNumber(canvas, 'tracerCount', 180);
    const tracerSpeed = readNumber(canvas, 'tracerSpeed', 0.9);
    const arrowGap = readNumber(canvas, 'fieldGap', 90);

    let tracers = [];

    function field(x, y, width, height, time) {
      const nx = (x / width) * 2 - 1;
      const ny = (y / height) * 2 - 1;
      const t = time * 0.0006;

      const vx = Math.sin(ny * 3.1 + t) + Math.cos(nx * 2.2 - t * 0.8);
      const vy = Math.cos(nx * 3.0 - t * 1.2) - Math.sin(ny * 2.4 + t * 0.7);

      const mag = Math.hypot(vx, vy) || 1;
      return {
        x: (vx / mag) * tracerSpeed,
        y: (vy / mag) * tracerSpeed
      };
    }

    function drawArrow(x, y, vx, vy) {
      const len = 10;
      const ex = x + vx * len;
      const ey = y + vy * len;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      const angle = Math.atan2(vy, vx);
      const wing = 4;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - Math.cos(angle - 0.45) * wing, ey - Math.sin(angle - 0.45) * wing);
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - Math.cos(angle + 0.45) * wing, ey - Math.sin(angle + 0.45) * wing);
      ctx.stroke();
    }

    return {
      reset(width, height) {
        tracers = Array.from({ length: tracerCount }, () => ({
          x: Math.random() * width,
          y: Math.random() * height
        }));
      },
      draw(width, height, time) {
        ctx.fillStyle = 'rgba(5,11,20,0.22)';
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(148,163,184,0.14)';
        for (let gx = arrowGap * 0.5; gx < width; gx += arrowGap) {
          for (let gy = arrowGap * 0.5; gy < height; gy += arrowGap) {
            const v = field(gx, gy, width, height, time);
            drawArrow(gx, gy, v.x * 1.3, v.y * 1.3);
          }
        }

        ctx.lineWidth = 1.4;
        for (let i = 0; i < tracers.length; i++) {
          const tracer = tracers[i];
          const prevX = tracer.x;
          const prevY = tracer.y;

          const v = field(tracer.x, tracer.y, width, height, time);
          tracer.x += v.x;
          tracer.y += v.y;

          if (tracer.x < 0) tracer.x = width;
          if (tracer.x > width) tracer.x = 0;
          if (tracer.y < 0) tracer.y = height;
          if (tracer.y > height) tracer.y = 0;

          ctx.strokeStyle = 'rgba(52,211,153,0.30)';
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(tracer.x, tracer.y);
          ctx.stroke();

          if (i % 14 === 0) {
            ctx.fillStyle = 'rgba(34,211,238,0.55)';
            ctx.beginPath();
            ctx.arc(tracer.x, tracer.y, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };
  }

  function createContourRenderer(canvas, ctx) {
    const gap = readNumber(canvas, 'contourGap', 26);
    return {
      reset() {},
      draw(width, height, time) {
        const t = time * 0.001;
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = 1.1;
        for (let y = -20; y <= height + 20; y += gap) {
          ctx.strokeStyle = `rgba(34,211,238,${0.12 + 0.07 * Math.sin(t + y * 0.015)})`;
          ctx.beginPath();
          for (let x = 0; x <= width; x += 8) {
            const wave = Math.sin(x * 0.014 + y * 0.02 + t * 1.4) * 9 +
              Math.cos(x * 0.008 - t * 1.1) * 5;
            const py = y + wave;
            if (x === 0) ctx.moveTo(x, py);
            else ctx.lineTo(x, py);
          }
          ctx.stroke();
        }
      }
    };
  }

  function createOrbitRingsRenderer(canvas, ctx) {
    return {
      reset() {},
      draw(width, height, time) {
        const t = time * 0.001;
        const cx = width * 0.5;
        const cy = height * 0.5;
        const base = Math.min(width, height) * 0.12;

        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        const rings = [1, 1.65, 2.35, 3.05];
        rings.forEach((m, idx) => {
          const r = base * m;
          ctx.strokeStyle = idx % 2 ? 'rgba(52,211,153,0.24)' : 'rgba(34,211,238,0.24)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        });

        const orbits = [
          { r: base, speed: 1.8, color: 'rgba(34,211,238,0.85)', size: 3.2 },
          { r: base * 1.65, speed: -1.2, color: 'rgba(52,211,153,0.80)', size: 3 },
          { r: base * 2.35, speed: 0.9, color: 'rgba(245,158,11,0.78)', size: 2.8 },
          { r: base * 3.05, speed: -0.65, color: 'rgba(148,163,184,0.72)', size: 2.6 }
        ];

        ctx.fillStyle = 'rgba(34,211,238,0.35)';
        ctx.beginPath();
        ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
        ctx.fill();

        orbits.forEach((o, i) => {
          const a = t * o.speed + i * 1.2;
          const x = cx + Math.cos(a) * o.r;
          const y = cy + Math.sin(a) * o.r;

          ctx.strokeStyle = 'rgba(100,116,139,0.2)';
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.stroke();

          ctx.fillStyle = o.color;
          ctx.beginPath();
          ctx.arc(x, y, o.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    };
  }

  function createRadarRenderer(canvas, ctx) {
    return {
      reset() {},
      draw(width, height, time) {
        const t = time * 0.001;
        const cx = width * 0.5;
        const cy = height * 0.5;
        const maxR = Math.min(width, height) * 0.45;
        const sweep = (t * 0.9) % (Math.PI * 2);

        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        for (let r = maxR * 0.2; r <= maxR; r += maxR * 0.2) {
          ctx.strokeStyle = 'rgba(52,211,153,0.16)';
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(34,211,238,0.12)';
        ctx.beginPath();
        ctx.moveTo(cx - maxR, cy);
        ctx.lineTo(cx + maxR, cy);
        ctx.moveTo(cx, cy - maxR);
        ctx.lineTo(cx, cy + maxR);
        ctx.stroke();

        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
        grd.addColorStop(0, 'rgba(34,211,238,0.22)');
        grd.addColorStop(1, 'rgba(34,211,238,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(cx, cy, maxR, sweep - 0.35, sweep + 0.03);
        ctx.lineTo(cx, cy);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(34,211,238,0.65)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(sweep) * maxR, cy + Math.sin(sweep) * maxR);
        ctx.stroke();

        for (let i = 0; i < 10; i++) {
          const a = i * 0.63 + (i % 2 ? 0.6 : 0);
          const r = maxR * (0.25 + ((i * 17) % 65) / 100);
          const pulse = Math.max(0, Math.cos(sweep - a));
          if (pulse < 0.92) continue;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          ctx.fillStyle = `rgba(245,158,11,${0.35 + pulse * 0.5})`;
          ctx.beginPath();
          ctx.arc(x, y, 2 + pulse * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
  }

  function createMatrixRenderer(canvas, ctx) {
    const cols = [];
    const glyphs = '01+-*/=<>[]{}()';
    const fontSize = readNumber(canvas, 'matrixSize', 15);

    return {
      reset(width, height) {
        const count = Math.floor(width / fontSize);
        cols.length = 0;
        for (let i = 0; i < count; i++) {
          cols.push({
            x: i * fontSize,
            y: Math.random() * height,
            speed: 1 + Math.random() * 2.2
          });
        }
      },
      draw(width, height) {
        ctx.fillStyle = 'rgba(5,11,20,0.22)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
        for (let i = 0; i < cols.length; i++) {
          const c = cols[i];
          const ch = glyphs[(Math.random() * glyphs.length) | 0];
          ctx.fillStyle = i % 6 === 0 ? 'rgba(34,211,238,0.8)' : 'rgba(52,211,153,0.62)';
          ctx.fillText(ch, c.x, c.y);
          c.y += c.speed;
          if (c.y > height + fontSize) c.y = -fontSize;
        }
      }
    };
  }

  function createRenderer(mode, canvas, ctx) {
    if (mode === 'math-grid' || mode === 'grid-oscilloscope') return createMathGridRenderer(canvas, ctx);
    if (mode === 'parametric') return createParametricRenderer(canvas, ctx);
    if (mode === 'vector-field') return createVectorFieldRenderer(canvas, ctx);
    if (mode === 'contour') return createContourRenderer(canvas, ctx);
    if (mode === 'orbit-rings') return createOrbitRingsRenderer(canvas, ctx);
    if (mode === 'radar') return createRadarRenderer(canvas, ctx);
    if (mode === 'matrix') return createMatrixRenderer(canvas, ctx);
    return createParticlesRenderer(canvas, ctx);
  }

  function initThemeBackground() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas || canvas.dataset.themeInit === '1') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.dataset.themeInit = '1';
    const mode = canvas.dataset.bgMode || 'particles';

    let renderer = createRenderer(mode, canvas, ctx);

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (renderer.reset) renderer.reset(canvas.width, canvas.height);
    }

    function draw(time) {
      renderer.draw(canvas.width, canvas.height, time || 0);
      requestAnimationFrame(draw);
    }

    resize();
    draw(0);

    window.addEventListener('resize', resize);
  }

  window.initParticleBackground = initThemeBackground;
  window.initThemeBackground = initThemeBackground;

  document.addEventListener('DOMContentLoaded', function () {
    initThemeBackground();
  });
})();
