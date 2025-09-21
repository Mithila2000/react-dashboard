import React from "react";
import { CiSearch } from "react-icons/ci";

const ROWS = [
  ["#CM9801","Natali Craig","Landing Page","Meadow Lane Oakland","Just now","In Progress"],
  ["#CM9802","Kate Morrison","CRM Admin pages","Larry San Francisco","A minute ago","Complete"],
  ["#CM9803","Drew Cano","Client Project","Bagwell Avenue Ocala","1 hour ago","Pending"],
  ["#CM9804","Orlando Diggs","Admin Dashboard","Washburn Baton Rouge","Yesterday","Approved"],
  ["#CM9805","Andi Lane","App Landing Page","Nest Lane Olivette","Feb 2, 2023","Rejected"],
];

const dotColor = (s) => ({
  "In Progress": "var(--primary)",
  Complete: "var(--success)",
  Pending: "var(--accent)",
  Approved: "var(--warning)",
  Rejected: "var(--text-weak)",
}[s] || "var(--text-weak)");

export default function Orders() {
  // search text
  const [q, setQ] = React.useState("");
  // selected row IDs (use Order ID as stable key)
  const [selected, setSelected] = React.useState(() => new Set());
  // header checkbox ref (to set .indeterminate)
  const masterRef = React.useRef(null);

  // visible rows after search
  const visible = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return ROWS;
    return ROWS.filter((r) => r.join(" ").toLowerCase().includes(term));
  }, [q]);

  // keep master checkbox checked/indeterminate in sync with visible selection
  React.useEffect(() => {
    const ids = visible.map((r) => r[0]);
    const selectedCount = ids.reduce((n, id) => n + (selected.has(id) ? 1 : 0), 0);
    const all = ids.length > 0 && selectedCount === ids.length;
    const some = selectedCount > 0 && selectedCount < ids.length;
    if (masterRef.current) {
      masterRef.current.checked = all;
      masterRef.current.indeterminate = some;
    }
  }, [visible, selected]);

  // toggle one row
  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // select/deselect all visible
  const onMasterChange = (e) => {
    const ids = visible.map((r) => r[0]);
    setSelected((prev) => {
      const next = new Set(prev);
      if (e.target.checked) {
        ids.forEach((id) => next.add(id));
      } else {
        ids.forEach((id) => next.delete(id));
      }
      return next;
    });
  };

  return (
    <section className="orders">
      <div className="orders__head">
        <h3>Order List</h3>

        <div className="orders__actions">
          <div className="orders__actions_left">
            <button className="orders__icon" aria-label="Add">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
            </button>
            <button className="orders__icon" aria-label="Filter">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3 5h18v2H3V5Zm4 6h10v2H7v-2Zm4 6h2v2h-2v-2Z"/></svg>
            </button>
            <button className="orders__icon" aria-label="Sort">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="m10 20-6-6l1.4-1.4L9 15.2V4h2v11.2l3.6-3.6L16 14l-6 6Z"/></svg>
            </button>
          </div>

          <div className="orders__search">
            <CiSearch />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              aria-label="Search orders"
            />
          </div>
        </div>
      </div>

      <div className="orders__tablewrap">
        <table className="orders__table" role="grid">
          <thead>
            <tr>
              <th style={{ width: 32 }}>
                <input
                  ref={masterRef}
                  type="checkbox"
                  aria-label="Select all"
                  onChange={onMasterChange}
                />
              </th>
              <th>Order ID</th>
              <th>User</th>
              <th>Project</th>
              <th>Address</th>
              <th>Date</th>
              <th style={{ textAlign: "right" }}>Status</th>
            </tr>
          </thead>

          <tbody>
            {visible.map((r) => {
              const id = r[0];
              const isSel = selected.has(id);
              return (
                <tr
                  key={id}
                  className={isSel ? "is-selected" : undefined}
                  onClick={() => toggle(id)}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggle(id)}
                      aria-label={`Select ${id}`}
                    />
                  </td>

                  <td className="mono">{id}</td>

                  <td>
                    <div className="cell-user">
                      <img src="/images/profile.png" className="avatar lg" alt="" />
                      {r[1]}
                    </div>
                  </td>

                  <td>{r[2]}</td>
                  <td className="truncate">{r[3]}</td>

                  <td className="cell-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                      <path fill="currentColor" d="M7 2h2v2h6V2h2v2h3v16H4V4h3zM6 8v10h12V8H6z" />
                    </svg>
                    {r[4]}
                  </td>

                  <td className="cell-status">
                    <span className="status" style={{ color: dotColor(r[5]) }}>
                      <i className="status__dot" style={{ background: dotColor(r[5]) }} />
                      {r[5]}
                    </span>
                  </td>
                </tr>
              );
            })}

            {visible.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 24, color: "var(--text-weak)" }}>
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="orders__pager">
        <button className="orders__pgbtn" aria-label="Prev">‹</button>
        <button className="orders__pgbtn is-active">1</button>
        <button className="orders__pgbtn">2</button>
        <button className="orders__pgbtn">3</button>
        <button className="orders__pgbtn" aria-label="Next">›</button>
      </div>
    </section>
  );
}
