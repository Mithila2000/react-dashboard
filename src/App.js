import React from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import ThemeProvider from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import "./App.css"
import { CiSearch } from "react-icons/ci";

function ThemeToggle() {
  const [theme, setTheme] = React.useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );
  React.useEffect(() => {
    const obs = new MutationObserver(() =>
      setTheme(document.documentElement.getAttribute("data-theme") || "light")
    );
    obs.observe(document.documentElement, { attributes: true });
    return () => obs.disconnect();
  }, []);
  return (
    <button
      className="icon-btn"
      aria-label="Toggle theme"
      onClick={() => {
        const next = theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        setTheme(next);
      }}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}

function Header() {
  return (
    <header className="header topbar">
      {/* LEFT: icons + breadcrumbs */}
      <div className="hb-left">
        <button className="top-icon" aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="8" height="6" rx="1.5" />
            <rect x="13" y="4" width="8" height="6" rx="1.5" />
            <rect x="3" y="14" width="8" height="6" rx="1.5" />
            <rect x="13" y="14" width="8" height="6" rx="1.5" />
          </svg>
        </button>
        <button className="top-icon" aria-label="Favorites">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m12 17 6.18 3.73-1.64-7.03L21 8.27l-7.19-.62L12 1 10.19 7.65 3 8.27l4.46 5.43-1.64 7.03z" />
          </svg>
        </button>

        <nav className="crumbs" aria-label="Breadcrumb">
          <span>Dashboards</span>
          <span className="sep">/</span>
          <strong>Default</strong>
        </nav>
      </div>


      {/* RIGHT: ghost icons (theme + actions) */}
      <div className="hb-right">
         <div className="hb-search">
        <div className="search search--compact" role="search">
          <CiSearch/>
          <input aria-label="Search" placeholder="Search" />
          <kbd className="kbd">⌘/</kbd>
        </div>
      </div>
        <ThemeToggle />
        <button className="top-icon" aria-label="History">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4" />
            <path d="M12 7v5l4 2" />
          </svg>
        </button>
        <button className="top-icon" aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
            <path d="M9 17a3 3 0 0 0 6 0" />
          </svg>
        </button>
        <button className="top-icon" aria-label="Apps">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="5" cy="5" r="2.5" /><circle cx="12" cy="5" r="2.5" /><circle cx="19" cy="5" r="2.5" />
            <circle cx="5" cy="12" r="2.5" /><circle cx="12" cy="12" r="2.5" /><circle cx="19" cy="12" r="2.5" />
            <circle cx="5" cy="19" r="2.5" /><circle cx="12" cy="19" r="2.5" /><circle cx="19" cy="19" r="2.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}


function Sidebar() {
  // main links
  const navItems = [
    { to: "/", label: "Default", exact: true, icon: "pie", chevron: false },
    { to: "/ecommerce", label: "eCommerce", icon: "bag", chevron: true },
    { to: "/projects", label: "Projects", icon: "folder", chevron: true },
    { to: "/courses", label: "Online Courses", icon: "book", chevron: true }
  ];

  const pages = ["Overview", "Projects", "Campaigns", "Documents", "Followers"];

  // Favorites / Recently (you already had this)
  const [tab, setTab] = React.useState("favorites");
  const favorites = ["Overview", "Projects"];
  const recently = ["Reports", "Invoices"];

  // Collapsible “User Profile” group
  const [openProfile, setOpenProfile] = React.useState(true);

  const Icon = ({ name, className = "icon" }) => {
    switch (name) {
      case "pie":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="8.5" opacity=".6" />
            <path d="M12 3.5V12l6.5 6.5" />
          </svg>
        );
      case "bag":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="5" y="7" width="14" height="12" rx="2" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
        );
      case "folder":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 7h6l2 2h10v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        );
      case "book":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 5h8v14H6a2 2 0 0 1-2-2z" />
            <path d="M12 5h6a2 2 0 0 1 2 2v12h-8z" />
          </svg>
        );
      case "chev":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l6 6-6 6" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <aside
      className="sidebar"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--x", e.clientX - rect.left + "px");
        e.currentTarget.style.setProperty("--y", e.clientY - rect.top + "px");
      }}
    >
      <div className="logo">
        <img src="/images/profile.png" className="avatar lg" alt="" /> ByeWind
      </div>

      {/* Favorites / Recently */}
      <section className="fav-section">
        <div className="fav-tabs" role="tablist" aria-label="Sidebar quick lists">
          <button
            role="tab"
            aria-selected={tab === "favorites"}
            className={"fav-tab " + (tab === "favorites" ? "is-active" : "")}
            onClick={() => setTab("favorites")}
          >
            Favorites
          </button>
          <button
            role="tab"
            aria-selected={tab === "recently"}
            className={"fav-tab " + (tab === "recently" ? "is-active" : "")}
            onClick={() => setTab("recently")}
          >
            Recently
          </button>
        </div>
        <ul className="fav-list">
          {(tab === "favorites" ? favorites : recently).map((item) => (
            <li key={item}>
              <span className="dot" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Dashboards */}
      <nav className="nav" aria-label="Dashboards">
        <div className="nav__label">Dashboards</div>
        {navItems.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.exact}
            className={({ isActive }) => "nav__item " + (isActive ? "is-active" : "")}
          >
            {n.chevron && <Icon name="chev" className="chev" />}
            <Icon name={n.icon} />
            {n.label}
          </NavLink>
        ))}

        {/* Pages */}
        <div className="nav__label">Pages</div>

        {/* Collapsible 'User Profile' like the design */}
        <button
          className="nav__group"
          aria-expanded={openProfile}
          onClick={() => setOpenProfile((v) => !v)}
        >
          <Icon name="chev" className="chev" />
          {/* id-card icon */}
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="12" r="2" />
            <path d="M14 9h5M14 12h5M14 15h3" />
          </svg>
          User Profile
        </button>
        {openProfile && (
          <ul className="nav__sub">
            {pages.map((p) => (
              <li key={p}><a href="#">{p}</a></li>
            ))}
          </ul>
        )}

        {/* The rest (static like your screenshot) */}
        <button className="nav__group" aria-expanded="false">
          <Icon name="chev" className="chev" />
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="5" y="7" width="14" height="12" rx="2" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          Account
        </button>
        <button className="nav__group" aria-expanded="false">
          <Icon name="chev" className="chev" />
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 7h6l2 2h10v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          Corporate
        </button>
        <button className="nav__group" aria-expanded="false">
          <Icon name="chev" className="chev" />
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="6" y="5" width="12" height="14" rx="2" />
            <path d="M8 9h8M8 13h8" />
          </svg>
          Blog
        </button>
        <button className="nav__group" aria-expanded="false">
          <Icon name="chev" className="chev" />
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          </svg>
          Social
        </button>
      </nav>
    </aside>
  );
}



// ⬇️ Replace RailCard, Notifications, Activities, Contacts with these:

function RailSection({ title, children }) {
  return (
    <section className="rail-section">
      <h3 className="rail-title">{title}</h3>
      <div className="rail-list">{children}</div>
    </section>
  );
}

function Notifications() {
  const items = [
    "You have a bug that needs attention",
    "New user registered",
    "You have a bug that needs attention",
  ];
  return (
    <RailSection title="Notifications">
      {items.map((t, i) => (
        <div key={i} className="rail-row">
          <span className="rail-ic">
            {/* bell */}
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
              <path fill="currentColor" d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2m6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1z"/>
            </svg>
          </span>
          <div className="rail-col">
            <div className="rail-title-sm">{t}</div>
            <div className="rail-meta">Just now</div>
          </div>
        </div>
      ))}
    </RailSection>
  );
}

function Activities() {
  const items = [
    "Released a new version",
    "Submitted a bug",
    "Modified data in Page X",
    "Deleted a page in Project X",
  ];
  return (
    <RailSection title="Activities">
      {items.map((t, i) => (
        <div key={i} className="rail-row">
          <span className="rail-ic rail-ic--alt">
            <img src="/images/profile.png"  className="rail-avatar"/>
          </span>
          <div className="rail-col">
            <div className="rail-title-sm">{t}</div>
            <div className="rail-meta">1 hr ago</div>
          </div>
        </div>
      ))}
    </RailSection>
  );
}

function Contacts() {
  const people = [
    "Natali Craig","Drew Cano","Orlando Diggs",
    "Andi Lane","Kate Morrison","Koray Okumus"
  ];
  return (
    <RailSection title="Contacts">
      {people.map((p, i) => (
        <div key={i} className="rail-row">
          <img src="/images/profile.png" className="rail-avatar" aria-hidden />
          <div className="rail-title-sm">{p}</div>
        </div>
      ))}
    </RailSection>
  );
}


export default function App() {
  const location = useLocation();
  const isOrdersRoute = ["/projects", "/courses"].includes(location.pathname); // routes that render <Orders/>

  return (
    <ThemeProvider>
      <div className={"container-app" + (isOrdersRoute ? " layout-wide" : "")}>
        <Sidebar />
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ecommerce" element={<Dashboard />} />
            <Route path="/projects" element={<Orders />} />
            <Route path="/courses" element={<Orders />} />
          </Routes>
        </main>

        {/* Hide the right rail on Orders */}
        {!isOrdersRoute && (
          <aside className="rail" aria-label="Right Rail">
            <Notifications />
            <Activities />
            <Contacts />
          </aside>
        )}
      </div>
    </ThemeProvider>
  );
}
