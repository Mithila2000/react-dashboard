// BarChart.jsx
import React from "react";

export default function BarChart({ data = [] }) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun"].slice(0, data.length);

  // Canvas + paddings
  const width = 560, height = 220;
  const pad = { left: 64, right: 16, top: 18, bottom: 36 };
  const axisGap = 8; // little space between Y-axis labels and first bar

  // Scale to neat ticks (0,10,20,30…)
  const max = Math.max(1, ...data);
  const maxTick = Math.ceil(max / 10) * 10;

  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  // Bars: compute gap so bars span the full width
  const n = Math.max(1, data.length);
  const workW = innerW - axisGap;     // usable width for bars + gaps
  const idealBarW = 28;               // target bar width
  const minGap = 10;                  // don't let bars touch the axis/grid

  let barW = idealBarW;
  let gap = (workW - n * barW) / (n - 1 || 1);   // distribute remaining space

  // If the ideal layout would create negative/too-small gaps,
  // fix the gap and solve bar width instead.
  if (gap < minGap) {
    gap = minGap;
    barW = (workW - gap * (n - 1)) / n;
  }

  // Colors
  const baseFill = "#A8C5DA"; // actuals
  const capFill  = "#D9D9D9"; // projection cap
  const grid     = "var(--ring)";
  const label    = "var(--text-weak)";

  // Y ticks
  const ticks = [0, maxTick / 3, (2 * maxTick) / 3, maxTick];

  // Path with ONLY rounded top corners (bottom is square)
  const roundedTopPath = (x, y, w, h, r) => {
    const rr = Math.min(r, h);
    return `
      M ${x} ${y + h}
      L ${x} ${y + rr}
      A ${rr} ${rr} 0 0 1 ${x + rr} ${y}
      L ${x + w - rr} ${y}
      A ${rr} ${rr} 0 0 1 ${x + w} ${y + rr}
      L ${x + w} ${y + h}
      Z
    `;
  };

  return (
    <svg className="chart-bars" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Projections vs Actuals">
      {/* grid + labels */}
      {ticks.map((t, i) => {
        const y = pad.top + innerH - (t / maxTick) * innerH;
        return (
          <g key={i}>
            <line x1={pad.left} x2={width - pad.right} y1={y} y2={y}
                  stroke={grid} strokeWidth={1} strokeLinecap="round"
                  opacity={i === 0 ? 1 : 0.5} />
            <text x={pad.left - 12} y={y + 4} textAnchor="end" fontSize="12" fill={label}>
              {i === 0 ? "0" : `${Math.round(t)}M`}
            </text>
          </g>
        );
      })}

      {/* bars */}
      {data.map((v, i) => {
        const fullH   = (v / maxTick) * innerH;
        const actualH = fullH * 0.8;                 // base (square)
        const capH    = Math.max(4, fullH - actualH);// cap (rounded top)
        const x       = pad.left + axisGap + i * (barW + gap);
        const yBase   = pad.top + innerH - actualH;
        const yCap    = pad.top + innerH - fullH;

        return (
          <g key={i}>
            {/* base - square corners */}
            <rect x={x} y={yBase} width={barW} height={actualH} fill={baseFill} />
            {/* cap - ONLY rounded top */}
            <path d={roundedTopPath(x, yCap, barW, capH, 8)} fill={capFill} />
            {/* month label */}
            <text x={x + barW / 2} y={height - pad.bottom + 18}
                  textAnchor="middle" fontSize="12" fill={label}>
              {months[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
