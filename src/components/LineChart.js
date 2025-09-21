// LineChart.jsx
import React from "react";

export default function LineChart({ dataA = [], dataB = [] }) {
  const monthsAll = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const n = Math.max(dataA.length, dataB.length);
  const months = monthsAll.slice(0, n);

  // Canvas
  const width = 760, height = 240;
  const pad = { left: 56, right: 20, top: 28, bottom: 40 };

  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  // Scale (nice rounded top like 30M)
  const maxVal = Math.max(1, ...dataA, ...dataB);
  const maxTick = Math.ceil(maxVal / 10) * 10;

  const xStep = n > 1 ? innerW / (n - 1) : innerW;
  const x = (i) => pad.left + i * xStep;
  const y = (v) => pad.top + innerH - (v / maxTick) * innerH;

  // --- Smooth path helpers (Catmull–Rom → cubic) ---
  const getCtrl = (p0, p1, p2, t = 0.2) => {
    const d01 = Math.hypot(p1.x - p0.x, p1.y - p0.y) || 1;
    const d12 = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
    const fa = (t * d01) / (d01 + d12);
    const fb = (t * d12) / (d01 + d12);
    return {
      c1: { x: p1.x - fa * (p2.x - p0.x), y: p1.y - fa * (p2.y - p0.y) },
      c2: { x: p1.x + fb * (p2.x - p0.x), y: p1.y + fb * (p2.y - p0.y) },
    };
  };

  const toPath = (arr) => {
    const pts = arr.map((v, i) => ({ x: x(i), y: y(v) }));
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 2] ?? pts[i - 1];
      const p1 = pts[i - 1];
      const p2 = pts[i];
      const p3 = pts[i + 1] ?? p2;
      const { c2 } = getCtrl(p0, p1, p2);
      const { c1 } = getCtrl(p1, p2, p3);
      d += ` C ${c2.x} ${c2.y}, ${c1.x} ${c1.y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const pathA = toPath(dataA);
  const pathB = toPath(dataB);

  // Colors to match the ref
  const colA = "#111111";          // current week (dark)
  const colB = "#9DB9D6";          // previous week (soft blue)
  const grid = "var(--ring)";
  const label = "var(--text-weak)";

  const ticks = [0, maxTick / 3, (2 * maxTick) / 3, maxTick];

  return (
    <svg
      className="chart-line"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Revenue trend"
    >
      {/* gradients for subtle area fill */}
      <defs>
        <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colA} stopOpacity="0.10" />
          <stop offset="100%" stopColor={colA} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colB} stopOpacity="0.20" />
          <stop offset="100%" stopColor={colB} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* horizontal grid + Y labels */}
      {ticks.map((t, i) => {
        const yy = y(t);
        return (
          <g key={i}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={yy}
              y2={yy}
              stroke={grid}
              strokeWidth="1"
              opacity={i === ticks.length - 1 ? 1 : 0.5}
            />
            <text
              x={pad.left - 10}
              y={yy + 4}
              textAnchor="end"
              fontSize="12"
              fill={label}
            >
              {i === 0 ? "0" : `${Math.round(t)}M`}
            </text>
          </g>
        );
      })}

      {/* X labels */}
      {months.map((m, i) => (
        <text
          key={m}
          x={x(i)}
          y={height - pad.bottom + 22}
          textAnchor="middle"
          fontSize="12"
          fill={label}
        >
          {m}
        </text>
      ))}

      {/* area fills (very subtle) */}
      {pathB && (
        <path
          d={`${pathB} L ${pad.left + innerW} ${pad.top + innerH} L ${pad.left} ${pad.top + innerH} Z`}
          fill="url(#gradB)"
          stroke="none"
        />
      )}
      {pathA && (
        <path
          d={`${pathA} L ${pad.left + innerW} ${pad.top + innerH} L ${pad.left} ${pad.top + innerH} Z`}
          fill="url(#gradA)"
          stroke="none"
        />
      )}

      {/* lines */}
      {pathB && (
        <path
          d={pathB}
          stroke={colB}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      )}
      {pathA && (
        <path
          d={pathA}
          stroke={colA}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* end dot on current week */}
      {dataA.length > 0 && (
        <circle
          r="4.5"
          cx={x(dataA.length - 1)}
          cy={y(dataA[dataA.length - 1])}
          fill={colA}
        />
      )}
    </svg>
  );
}
