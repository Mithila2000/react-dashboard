import React from "react";

const DEFAULT_ITEMS = [
  { label: "Direct",    value: 300.56, color: "var(--text)" },  // soft lavender
  { label: "Affiliate", value: 135.18, color: "#BAEDBD" },  // soft green
  { label: "Sponsored", value: 154.02, color: "#95A4FC" },  // periwinkle
  { label: "E-mail",    value:  48.96, color: "#B1E3FF" },  // light blue
];

export default function Donut({ items = DEFAULT_ITEMS }) {
  // keep the SVG comfortably inside the card
  const width = 220, height = 170;
  const cx = width / 2, cy = 88;

  const r = 56;         // radius of the ring
  const stroke = 20;    // total thickness of ring
  const EDGE = 6;       // “rim” thickness that creates the dark outline
  const GAP = 3;        // tiny gap between segments (like the ref)
  const C = 2 * Math.PI * r;

  const total = items.reduce((s, it) => s + it.value, 0);
  const pct = ((items[0]?.value ?? 0) / (total || 1)) * 100;

  let offset = 0;

  return (
    <div className="donut">
      <svg
        className="donut__svg"
        viewBox={`0 0 ${width} ${height}`}
        aria-label="Total Sales split"
      >
        {/* faint track */}
        <g transform={`translate(${cx},${cy}) rotate(-90)`}>
          <circle
            r={r}
            cx="0"
            cy="0"
            fill="none"
            stroke="rgba(17,17,17,.10)"
            strokeWidth={stroke}
          />

          {items.map((it) => {
            const len = (it.value / total) * C;
            const dash = Math.max(0, len - GAP);

            // dark rim (sits underneath, a bit thicker)
            const rim = (
              <circle
                key={`${it.label}-rim`}
                r={r}
                cx="0"
                cy="0"
                fill="none"
                stroke="var(--surface)"       // dark in dark mode, light in light mode
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${C}`}
                strokeDashoffset={-offset}
              />
            );

            // colored arc (slightly thinner) so rim peeks around the ends
            const arc = (
              <circle
                key={it.label}
                r={r}
                cx="0"
                cy="0"
                fill="none"
                stroke={it.color}
                strokeWidth={stroke - EDGE}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${C}`}
                strokeDashoffset={-offset}
              />
            );

            offset += len;
            return [rim, arc];
          })}
        </g>

        {/* inner cutout */}
        <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="var(--surface)" />
      </svg>

      {/* center badge—kept inside the card */}
      <div className="donut__badge">{pct.toFixed(1)}%</div>
    </div>
  );
}
