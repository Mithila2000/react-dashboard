import React from "react";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import Donut from "../components/Donut";
import WorldMiniMap from "../components/WorldMiniMap";

const points = [
  { name: "New York",      coords: [-74.006, 40.7128] },
  { name: "San Francisco", coords: [-122.4194, 37.7749] },
  { name: "Sydney",        coords: [151.2093, -33.8688] },
  { name: "Singapore",     coords: [103.8198, 1.3521] },
];

// Dashboard.jsx
const Stat = ({ title, value, delta, dir = "up", span = 3, tone = "plain" }) => (
  <section
     className={`card kpi fade-in ${tone ? `kpi--${tone}` : ""}`}
    style={{ gridColumn: `span ${span}` }}
    onMouseMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--x", e.clientX - r.left + "px");
      e.currentTarget.style.setProperty("--y", e.clientY - r.top + "px");
    }}
  >
    <div className="card-title">{title}</div>
    <div className="stat">
      <div className="value">{value}</div>
      <div className={`delta ${dir === "up" ? "up" : "down"}`}>{delta}</div>
    </div>
  </section>
);


export default function Dashboard() {
  const revenueA = [12, 10, 11, 14, 18, 23];
  const revenueB = [8, 9, 10, 11, 12, 14];
  const bars = [28, 22, 24, 26, 23, 25];

  const products = [
    ["ASOS Ridley High Waist", "$79.49", "82", "$6,518.18"],
    ["Marco Lightweight Shirt", "$128.50", "37", "$4,754.50"],
    ["Half Sleeve Shirt", "$39.99", "64", "$2,559.36"],
    ["Lightweight Jacket", "$20.00", "184", "$3,480.00"],
    ["Marco Shoes", "$79.49", "64", "$1,965.81"],
  ];

  const location = [
    ["New York", "72K"],
    ["San Francisco", "39K"],
    ["Sydney", "25K"],
    ["Singapore", "61K"],
  ];

  return (
    <><h2 className="page-title">eCommerce</h2>
    <section className="dashboard-grid">
      {/* KPI row 1 (left half) */}
        
<Stat title="Customers" value="3,781" delta="+11.01%" tone="tint" />
<Stat title="Orders"    value="1,219" delta="-0.03%" dir="down" />


        {/* BAR: pin right side, span 2 rows */}
        <section
          className="card fade-in"
          style={{ gridColumn: "7 / -1", gridRow: "1 / 3", height: "100%" }}
        >
          <div className="card-title">Projections vs Actuals</div>
          <BarChart data={bars} />
        </section>

        {/* KPI row 2 (left half) */}
   <Stat title="Revenue"   value="$695"  delta="+15.03%" />
<Stat title="Growth"    value="30.1%" delta="+6.08%" tone="growth"/>


      <section className="card fade-in" style={{ gridColumn: "span 9" }}>
  <div className="chart-head">
    <div className="card-title chart-title">Revenue</div>
    <span className="chart-head__divider" aria-hidden />
    <div className="legend">
      <span className="legend__item">
        <span className="legend__dot legend__dot--a" />
        <span>Current Week</span>
        <strong>$58,211</strong>
      </span>
      <span className="legend__item">
        <span className="legend__dot legend__dot--b" />
        <span>Previous Week</span>
        <strong>$68,768</strong>
      </span>
    </div>
  </div>

  <LineChart dataA={revenueA} dataB={revenueB} />
</section>


   {/* Revenue by Location */}
<section className="card fade-in loc-card" style={{ gridColumn: "span 3" }}>
  <div className="card-title">Revenue by Location</div>

  <WorldMiniMap points={points} />

  <div className="loc-list">
    {(() => {
      const max = Math.max(...location.map(([, v]) => parseInt(v, 10)));
      return location.map(([place, v]) => {
        const pct = (parseInt(v, 10) / max) * 100;
        return (
          <div key={place} className="loc-row">
            <span className="loc-name">{place}</span>
            <span className="loc-val">{v}</span>
            <div className="loc-progress"><span style={{ width: `${pct}%` }} /></div>
          </div>
        );
      });
    })()}
  </div>
</section>


     <section className="card fade-in" style={{ gridColumn: "span 9" }}>
  <div className="card-title">Top Selling Products</div>
  <div style={{ overflow: "auto" }}>
    <table className="table products-table" role="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {products.map((row, idx) => (
          <tr key={idx}>
            {row.map((cell, i) => (
              <td key={i}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>


      <section className="card fade-in donut-card" style={{ gridColumn: "span 3" }}>
  <div className="card-title">Total Sales</div>

  {/** Donut **/}
  <Donut items={[
    { label: "Direct",    value: 300.56, color: "#111111" },
    { label: "Affiliate", value: 135.18, color: "#86EFAC" },
    { label: "Sponsored", value: 154.02, color: "#8b5cf6" },
    { label: "E-mail",    value:  48.96, color: "#93c5fd" },
  ]} />

  {/** Legend **/}
  <div className="sales-legend">
    {[
      ["Direct",    "$300.56", "#111111"],
      ["Affiliate", "$135.18", "#86EFAC"],
      ["Sponsored", "$154.02", "#8b5cf6"],
      ["E-mail",    "$48.96",  "#93c5fd"],
    ].map(([name, amt, col]) => (
      <div key={name} className="sales-row">
        <div className="sales-left">
          <span className="sales-dot" style={{ background: col }} />
          <span>{name}</span>
        </div>
        <div className="sales-amt">{amt}</div>
      </div>
    ))}
  </div>
</section>

    </section>
    </>
  );
}
