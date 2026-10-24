import React, { useState } from "react";

const systems = [
  {
    id: "safari",
    category: "Travel & Transport",
    name: "KILIVOSAFARI BOOKING SYSTEM",
    description: "Planned for intercity bus bookings & fleet management.",
    icon: "bus",
    color: "teal",
    apps: ["Desktop App", "Conductor App", "Owner App", "Agent App"],
    details: "Product details, features, and downloads will be shared when this system is available.",
  },
  {
    id: "shule",
    category: "Education",
    name: "SHULEBORA SYSTEM",
    description: "Planned for school admissions, fees, exams & reporting.",
    icon: "school",
    color: "purple",
    apps: ["Desktop App", "Owner App", "Agent App"],
    details: "Product details, features, and downloads will be shared when this system is available.",
  },
  {
    id: "duka",
    category: "Retail",
    name: "DUKABORA POS",
    description: "Planned point of sale & inventory for shops and retailers.",
    icon: "shop",
    color: "orange",
    apps: ["Desktop App", "Owner App", "Agent App"],
    details: "Product details, features, and downloads will be shared when this system is available.",
  },
  {
    id: "afya",
    category: "Health",
    name: "AFYABORA CLINIC SYSTEM",
    description: "Planned for clinic appointments, patients & prescriptions.",
    icon: "health",
    color: "pink",
    apps: ["Desktop App", "Owner App", "Agent App"],
    details: "Product details, features, and downloads will be shared when this system is available.",
  },
];

function ProductIcon({ name }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    "aria-hidden": true,
    focusable: false,
  };

  if (name === "bus") {
    return (
      <svg {...common}>
        <rect x="11" y="8" width="26" height="26" rx="5" stroke="currentColor" strokeWidth="3" />
        <path d="M15 14h18v10H15zM14 30h20M16 35v4m16-4v4M15 29h.1m18 0h.1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "school") {
    return (
      <svg {...common}>
        <path d="m5 18 19-10 19 10-19 10L5 18Z" fill="currentColor" />
        <path d="M13 23v8c5 5 17 5 22 0v-8M41 19v12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="41" cy="34" r="2.5" fill="currentColor" />
      </svg>
    );
  }
  if (name === "shop") {
    return (
      <svg {...common}>
        <path d="M9 21h30v19H9zM6 17l4-10h28l4 10a5 5 0 0 1-9 3 5 5 0 0 1-9 0 5 5 0 0 1-9 0 5 5 0 0 1-9-3Z" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M17 40V28h9v12" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M24 40S7 30 7 18a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 12-17 22-17 22Z" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="m17 24 5 5 10-11" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeviceIcon() {
  return (
    <svg viewBox="0 0 20 16" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="16" height="11" rx="1" />
      <path d="M1 15h18" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M4 2.5v11L13 8 4 2.5Z" />
    </svg>
  );
}

function ContactDialog({ title, onClose }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        aria-labelledby="contact-dialog-title"
        aria-modal="true"
        className="contact-dialog"
        role="dialog"
      >
        <button className="dialog-close" type="button" onClick={onClose} aria-label="Close dialog">
          ×
        </button>
        {submitted ? (
          <div className="success-state">
            <span className="success-mark" aria-hidden="true">✓</span>
            <h2 id="contact-dialog-title">Thanks for reaching out</h2>
            <p>This frontend demo does not send or store messages. Connect a backend to receive requests.</p>
            <button className="button button--primary" type="button" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <p className="eyebrow">KILIVO LABS</p>
            <h2 id="contact-dialog-title">{title}</h2>
            <p className="dialog-intro">Tell us what you need and we’ll help you find the right system.</p>
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                Your name
                <input autoFocus name="name" placeholder="e.g. Amina" required />
              </label>
              <label>
                Email address
                <input name="email" type="email" placeholder="you@example.com" required />
              </label>
              <label>
                How can we help?
                <textarea name="message" rows="3" placeholder="Tell us a little about your needs" required />
              </label>
              <button className="button button--primary" type="submit">Send request</button>
              <p className="form-note">Demo only — your message will not be sent or saved.</p>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

function App() {
  const [selectedSystem, setSelectedSystem] = useState("safari");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");

  function openContact(title) {
    setDialogTitle(title);
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#" aria-label="Kilivo Labs home">
          <svg className="brand-mark" viewBox="0 0 56 56" aria-hidden="true">
            <path d="M16 10 30 3l16 8v34l-16 8-14-7-8-9V19l8-9Z" />
            <path d="M18 19h12l8-6m-20 6 9 9h13m-22 0 9 10h13m-22 0 9-10m0 0 9-8m-9 18 9-10m4-15h7m-7 15h7m-7 10h7" />
            <circle cx="43" cy="13" r="2.5" />
            <circle cx="43" cy="28" r="2.5" />
            <circle cx="43" cy="43" r="2.5" />
            <circle cx="18" cy="19" r="2" />
            <circle cx="18" cy="38" r="2" />
          </svg>
          <span className="brand-copy">
            <strong>KILIVO LABS</strong>
            <small>We Build Systems For Everything</small>
          </span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#systems">Products</a>
          <a href="#solutions">Solutions</a>
          <a href="#apps">Docs</a>
          <a href="#contact">Pricing</a>
          <a href="#about">About</a>
        </nav>
        <div className="header-actions">
          <button className="button button--outline button--small" type="button" onClick={() => openContact("Sign in")}>Sign in</button>
          <button className="button button--primary button--small" type="button" onClick={() => openContact("Contact Kilivo Labs")}>Contact</button>
        </div>
      </header>

      <main>
        <section className="hero" id="solutions">
          <div className="hero-content">
            <p className="hero-kicker">BUILT FOR EAST AFRICA</p>
            <h1>Practical systems for transport, education, retail &amp; health</h1>
            <p className="hero-description">
              We’re preparing software systems for Tanzania and East Africa. Product details and launch updates will be shared as they become available.
            </p>
            <div className="hero-actions">
              <button className="button button--primary button--hero" type="button" onClick={() => openContact("Request a system")}>
                <span aria-hidden="true">ϟ</span> Request a System
              </button>
              <button className="button button--outline button--hero" type="button" onClick={() => openContact("Contact us")}>
                <span aria-hidden="true">✉</span> Contact Us
              </button>
            </div>
            <ul className="trust-points">
              <li><span aria-hidden="true">◈</span> For Tanzania &amp; East Africa</li>
              <li><span aria-hidden="true">◈</span> Four planned product areas</li>
              <li><span aria-hidden="true">◈</span> Availability updates here</li>
            </ul>
          </div>
        </section>

        <section className="systems-section" id="systems">
          <div className="section-heading">
            <p className="eyebrow">SOFTWARE THAT WORKS FOR YOU</p>
            <h2>Planned Systems</h2>
            <p>Explore the products we’re planning. Availability and product details will be announced here.</p>
          </div>

          <div className="systems-grid">
            {systems.map((system) => {
              const isSelected = selectedSystem === system.id;
              return (
                <article className={`system-card ${isSelected ? "system-card--selected" : ""}`} key={system.id}>
                  <div className="card-category">
                    <span>Product · {system.category}</span>
                    <span className="availability-badge">Not yet available</span>
                    {isSelected && (
                      <button
                        type="button"
                        aria-label={`Close ${system.name} details`}
                        onClick={() => {
                          setSelectedSystem(null);
                          setDetailsOpen(false);
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <button
                    className="system-card-main"
                    type="button"
                    aria-expanded={isSelected && detailsOpen}
                    onClick={() => {
                      if (isSelected) {
                        setDetailsOpen(!detailsOpen);
                      } else {
                        setSelectedSystem(system.id);
                        setDetailsOpen(true);
                      }
                    }}
                  >
                    <span className={`product-icon product-icon--${system.color}`}>
                      <ProductIcon name={system.icon} />
                    </span>
                    <span className="system-copy">
                      <strong>{system.name}</strong>
                      <span>{system.description}</span>
                    </span>
                  </button>
                  {isSelected && detailsOpen && (
                    <div className="system-details">
                      <p>{system.details}</p>
                    </div>
                  )}
                  <div className="system-apps">
                    {system.apps.map((app, index) => {
                      const isDesktop = index === 0;
                      const isConductor = system.id === "safari" && index === 1;
                      const variant = isDesktop
                        ? "desktop"
                        : isConductor
                          ? "conductor"
                          : index === 1 || (system.id === "safari" && index === 2)
                            ? "owner"
                            : "agent";
                      return (
                        <span className={`app-chip app-chip--${variant}`} key={app}>
                          {isDesktop ? <DeviceIcon /> : <PlayIcon />}
                          <span>{app}</span>
                          <small className="chip-status">Not yet available</small>
                        </span>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mobile-apps" id="apps">
            <h3>Mobile apps</h3>
            <p>Not yet available</p>
            <div className="play-store-badge" aria-label="Coming soon to Google Play">
              <span className="play-store-mark" aria-hidden="true">▶</span>
              <span className="play-store-copy">
                <small>Coming soon to</small>
                <strong>Google Play</strong>
              </span>
            </div>
          </div>

          <div className="bottom-actions" id="contact">
            <button className="button button--outline" type="button" onClick={() => openContact("Request custom integration")}>Request Custom Integration</button>
            <button className="button button--primary" type="button" onClick={() => openContact("Talk to sales")}>Talk to Sales</button>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="about">
        <span>© {new Date().getFullYear()} KILIVO LABS</span>
        <span>Built in Tanzania · For East Africa</span>
      </footer>

      {dialogTitle && <ContactDialog title={dialogTitle} onClose={() => setDialogTitle("")} />}
    </div>
  );
}

export default App;
