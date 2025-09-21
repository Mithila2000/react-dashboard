// components/WorldMiniMap.jsx
import React, { useEffect, useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMiniMap({ points = [] }) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch(GEO_URL)
      .then(r => r.json())
      .then(topo => {
        const feats = feature(topo, topo.objects.countries).features;
        setCountries(feats);
      });
  }, []);

  const { width, height } = { width: 340, height: 160 };
  const projection = useMemo(
    () => geoNaturalEarth1().fitExtent([[8, 8], [width - 8, height - 8]], { type: "Sphere" }),
    [width, height]
  );
  const path = useMemo(() => geoPath(projection), [projection]);

  return (
    <svg width="100%" height="110" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="World map">
      <rect x="0" y="0" width={width} height={height} rx="12" fill="var(--card)" />
      <g>
        {countries.map((d, i) => (
          <path
            key={i}
            d={path(d)}
            fill="#D7E5F2"
            stroke="#C9DBEA"
            strokeWidth="0.5"
          />
        ))}
      </g>
      <g>
        {points.map(p => {
          const [x, y] = projection([p.lng, p.lat]) || [0, 0];
          return <circle key={p.name} cx={x} cy={y} r="3.2" fill="#fff" stroke="#111" strokeWidth="1.6" />;
        })}
      </g>
    </svg>
  );
}
