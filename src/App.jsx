import React, { useState } from "react";

const divisions = [
  {
    name: "KILIVO BUSINESS",
    description: "Commerce & More",
    color: "business",
    icon: "▣",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "KILIVO TECHNOLOGIES",
    description: "Tech for a Better World",
    color: "technology",
    icon: "</>",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "KILIVO PROJECTS",
    description: "Projects & Opportunities",
    color: "projects",
    icon: "◒",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "KILIVO IMPACT",
    description: "Community & Hope",
    color: "impact",
    icon: "♧",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=85",
  },
];

const articles = [
  {
    date: "Nov 10, 2025",
    title: "Innovation for a Better Tomorrow",
    summary: "KILIVO LABS continues to drive innovation for social good...",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85",
    alt: "Illuminated technology and circuit board",
  },
  {
    date: "Nov 05, 2025",
    title: "Community Impact in Action",
    summary: "Together we are creating lasting change...",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85",
    alt: "Friends spending time together outdoors",
  },
  {
    date: "Oct 28, 2025",
    title: "KILIVO LABS New Milestone",
    summary: "A new chapter of growth and opportunity...",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85",
    alt: "Modern glass office buildings",
  },
];

const searchItems = [
  { title: "Our Family", href: "#family" },
  { title: "Latest News & Articles", href: "#news" },
  { title: "Join KILIVO LABS", href: "#join" },
  { title: "Community Impact", href: "#impact" },
];

function Brand({ light = false }) {
  return (
    <a className={`brand${light ? " brand--light" : ""}`} href="#top" aria-label="KILIVO LABS home">
      <svg className="brand-mark" viewBox="0 0 96 96" aria-hidden="true">
        <path d="M24 16h15v64H24zM39 47l31-31h20L53 49l38 31H68L39 58z" />
        <path className="brand-swoosh" d="m40 52 48-27-5 9-38 28z" />
      </svg>
      <span className="brand-copy">
        <strong>KILIVO LABS</strong>
        <small>Build. Innovate. Empower.</small>
      </span>
    </a>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.3 19v-1.6a5.7 5.7 0 0 1 11.4 0V19H3.3Z" />
      <path d="M16 5.2a3 3 0 0 1 0 5.7m2 2.3a4.7 4.7 0 0 1 2.7 4.2V19h-4" />
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
      <section aria-labelledby="contact-dialog-title" aria-modal="true" className="contact-dialog" role="dialog">
        <button className="dialog-close" type="button" onClick={onClose} aria-label="Close dialog">×</button>
        {submitted ? (
          <div className="success-state">
            <span className="success-mark" aria-hidden="true">✓</span>
            <h2 id="contact-dialog-title">Thanks for reaching out</h2>
            <p>This demo does not send or store messages. Connect a backend to receive requests.</p>
            <button className="button button--primary" type="button" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <p className="eyebrow">KILIVO LABS</p>
            <h2 id="contact-dialog-title">{title}</h2>
            <p className="dialog-intro">Be part of a forward-thinking community that builds, innovates and gives back.</p>
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
                <textarea name="message" rows="3" placeholder="Tell us a little about your interest" required />
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
  const [dialogTitle, setDialogTitle] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = searchItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  function openContact(title) {
    setDialogTitle(title);
    setMenuOpen(false);
  }

  return (
    <div className="site-shell" id="top">
      <header className="site-header">
        <Brand />
        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`main-nav${menuOpen ? " main-nav--open" : ""}`} aria-label="Main navigation">
          <a className="nav-home" href="#top" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About <span aria-hidden="true">⌄</span></a>
          <a href="#family" onClick={() => setMenuOpen(false)}>Our Family <span aria-hidden="true">⌄</span></a>
          <a href="#news" onClick={() => setMenuOpen(false)}>News &amp; Media <span aria-hidden="true">⌄</span></a>
          <a href="#impact" onClick={() => setMenuOpen(false)}>Community Impact <span aria-hidden="true">⌄</span></a>
          <a href="#join" onClick={() => setMenuOpen(false)}>Join Us <span aria-hidden="true">⌄</span></a>
        </nav>
        <div className="header-actions">
          <button
            aria-expanded={searchOpen}
            aria-label={searchOpen ? "Close search" : "Open search"}
            className="search-button"
            onClick={() => setSearchOpen(!searchOpen)}
            type="button"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
          </button>
          <button className="button button--primary button--member" type="button" onClick={() => openContact("Become a Member")}>
            <PersonIcon /> <span>Become a Member</span>
          </button>
        </div>
        {searchOpen && (
          <div className="search-panel">
            <label htmlFor="site-search">Search KILIVO LABS</label>
            <input
              autoFocus
              id="site-search"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search..."
              value={searchQuery}
            />
            {searchQuery.trim() && (
              <ul>
                {searchResults.length ? searchResults.map((item) => (
                  <li key={item.href}><a href={item.href} onClick={() => setSearchOpen(false)}>{item.title} <span aria-hidden="true">→</span></a></li>
                )) : <li className="no-results">No matching sections found.</li>}
              </ul>
            )}
          </div>
        )}
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <h1 id="hero-title">Together for a<br />Brighter Future</h1>
            <p className="hero-description">
              <strong>KILIVO LABS</strong> is a forward-thinking organization committed to innovation, community impact, and empowering people through technology.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#about"><span aria-hidden="true">ⓘ</span> Learn More</a>
              <button className="button button--outline" type="button" onClick={() => openContact("Join Our Community")}>
                <PersonIcon /> Join Our Community
              </button>
            </div>
          </div>
          <div className="hero-dots" aria-label="Slide 1 of 3">
            <span className="is-active" /><span /><span />
          </div>
        </section>

        <div className="page-content">
          <section className="family-section" id="family">
            <div className="section-title-row">
              <div className="section-heading">
                <span className="section-rule" aria-hidden="true" />
                <h2>Our Family</h2>
                <p>Four Unique Identities. One Greater Purpose.</p>
              </div>
              <a className="button button--outline button--compact" href="#divisions">Explore All Divisions <span aria-hidden="true">→</span></a>
            </div>
            <div className="division-grid" id="divisions">
              {divisions.map((division) => (
                <a
                  className={`division-card division-card--${division.color}`}
                  href="#join"
                  key={division.name}
                  style={{ backgroundImage: `linear-gradient(90deg, var(--card-wash), var(--card-wash)), url("${division.image}")` }}
                >
                  <span className="division-icon" aria-hidden="true">{division.icon}</span>
                  <span className="division-copy">
                    <strong>{division.name}</strong>
                    <small>{division.description}</small>
                  </span>
                  <span className="division-arrow" aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </section>

          <div className="lower-content">
            <section className="news-section" id="news">
              <div className="section-title-row news-title-row">
                <div className="section-heading">
                  <span className="section-rule" aria-hidden="true" />
                  <h2>Latest News &amp; Articles</h2>
                </div>
                <a className="button button--outline button--compact" href="#news">View All News <span aria-hidden="true">→</span></a>
              </div>
              <div className="article-grid">
                {articles.map((article) => (
                  <article className="article-card" key={article.title}>
                    <a className="article-image" href="#news" aria-label={`Read ${article.title}`}>
                      <img src={article.image} alt={article.alt} />
                      <time>{article.date}</time>
                    </a>
                    <div className="article-copy">
                      <h3><a href="#news">{article.title}</a></h3>
                      <p>{article.summary}</p>
                      <a className="read-more" href="#news">Read More <span aria-hidden="true">→</span></a>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="community-column">
              <section className="join-card" id="join">
                <div className="join-copy">
                  <h2>Join KILIVO LABS</h2>
                  <p>Be part of a forward-thinking community that builds, innovates and gives back.</p>
                  <button className="button button--yellow" type="button" onClick={() => openContact("Apply for Membership")}>
                    <PersonIcon /> Apply for Membership <span aria-hidden="true">→</span>
                  </button>
                </div>
                <div className="community-symbol" aria-hidden="true">
                  <PersonIcon />
                  <span />
                </div>
              </section>
              <section className="impact-card" id="impact">
                <div>
                  <h2>Support Our Community Impact</h2>
                  <p>Contribute to projects that uplift our society.</p>
                  <button className="button button--outline button--compact" type="button" onClick={() => openContact("Make a Contribution")}>
                    <span aria-hidden="true">♥</span> Make a Contribution <span aria-hidden="true">→</span>
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <footer className="site-footer" id="about">
        <Brand light />
        <nav aria-label="Footer navigation">
          <a href="#about">About</a><a href="#family">Our Family</a><a href="#news">News &amp; Media</a>
          <a href="#impact">Community Impact</a><a href="#join">Contact Us</a>
        </nav>
        <div className="social-links" aria-label="Social media">
          <a href="#join" aria-label="YouTube">▶</a><a href="#join" aria-label="LinkedIn">in</a>
          <a href="#join" aria-label="X">𝕏</a><a href="#join" aria-label="Facebook">f</a>
        </div>
        <p className="footer-tagline">Together for a Brighter Future.</p>
      </footer>

      {dialogTitle && <ContactDialog title={dialogTitle} onClose={() => setDialogTitle("")} />}
    </div>
  );
}

export default App;
