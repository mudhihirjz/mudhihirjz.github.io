import React, { useRef, useState } from "react";

const divisions = [
  {
    name: "KILIVO BUSINESS",
    description: "Commerce & More",
    color: "business",
    icon: (
      <svg viewBox="0 0 48 48" focusable="false">
        <path fill="currentColor" d="M17 8a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v4h8a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4h8V8Zm4 4h6V8h-6v4ZM9 18v6h30v-6H9Zm0 10v10h30V28H9Zm13 2h4v4h-4v-4Z" />
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "KILIVO TECHNOLOGIES",
    description: "Tech for a Better World",
    color: "technology",
    icon: (
      <svg viewBox="0 0 48 48" focusable="false">
        <path d="m16 12-11 12 11 12M32 12l11 12-11 12M28 9l-8 30" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "KILIVO PROJECTS",
    description: "Projects & Opportunities",
    color: "projects",
    icon: (
      <svg viewBox="0 0 48 48" focusable="false">
        <path fill="currentColor" d="M5 31h38v3a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-3Zm3-3a16 16 0 0 1 32 0v1H8v-1Zm14-15v13h4V13a2 2 0 0 0-4 0Zm-9 5v8h4v-8a2 2 0 0 0-4 0Zm18 0v8h4v-8a2 2 0 0 0-4 0Z" />
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "KILIVO IMPACT",
    description: "Community & Hope",
    color: "impact",
    icon: (
      <svg viewBox="0 0 48 48" focusable="false">
        <path fill="currentColor" d="M24 24.5 13.8 14.8A6.2 6.2 0 0 1 22.6 6l1.4 1.5L25.4 6a6.2 6.2 0 0 1 8.8 8.8L24 24.5Z" />
        <path d="M5 24c3.5-3 6.2-3.1 9.2-.2l5.2 5.1c1.8 1.8 4.7 1.8 6.5 0l1.3-1.3a3 3 0 0 1 4.3 0 3 3 0 0 1 0 4.2l-7.4 7.4a4 4 0 0 1-5.7 0L5 26.6V24Zm38 0c-3.5-3-6.2-3.1-9.2-.2l-1.5 1.5a6.5 6.5 0 0 1 2.1 1.4 6 6 0 0 1 1.7 3.2l6.9-6.1V24Z" fill="currentColor" />
      </svg>
    ),
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

function Brand({ light = false, href = "#top" }) {
  return (
    <a className={`brand${light ? " brand--light" : ""}`} href={href} aria-label="KILIVO LABS home">
      <img
        className="brand-mark"
        src={light ? "/logos/company-logo-white.png" : "/logos/company-logo-blue.png"}
        alt=""
      />
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

function ContactDialog({ title, onClose, applicationMode = false }) {
  const [submitted, setSubmitted] = useState(false);
  const [applicationType, setApplicationType] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  function getFormLink() {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("application", applicationType);
    return url.toString();
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-labelledby="contact-dialog-title" aria-modal="true" className="contact-dialog" role="dialog">
        <button className="dialog-close" type="button" onClick={onClose} aria-label="Close dialog">×</button>
        {submitted ? (
          <div className="success-state">
            {applicationMode ? (
              <>
                <span className="success-mark" aria-hidden="true">✉</span>
                <h2 id="contact-dialog-title">Demo email prepared</h2>
                <p>A sample email for the {applicationType === "kilivo_member" ? "KILIVO Member" : "Community Impact"} form is shown for <strong>{email}</strong>.</p>
                <div className="demo-email">
                  <p className="eyebrow">KILIVO LABS · APPLICATION LINK</p>
                  <p>Click below to open your application form in the browser.</p>
                  <a className="button button--primary" href={getFormLink()} target="_blank" rel="noreferrer">
                    Open application form
                  </a>
                </div>
                <p className="form-note">Demo only — no email was sent and no information was saved.</p>
              </>
            ) : (
              <>
                <span className="success-mark" aria-hidden="true">✓</span>
                <h2 id="contact-dialog-title">Thanks for reaching out</h2>
                <p>This demo does not send or store messages. Connect a backend to receive requests.</p>
              </>
            )}
            <button className="button button--primary" type="button" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <p className="eyebrow">{applicationMode ? "MEMBERSHIP APPLICATION" : "KILIVO LABS"}</p>
            <h2 id="contact-dialog-title">{applicationMode ? "Choose your application" : title}</h2>
            <p className="dialog-intro">
              {applicationMode
                ? "Choose an application type and enter your email to preview the link-request flow."
                : "Be part of a forward-thinking community that builds, innovates and gives back."}
            </p>
            {applicationMode ? (
              <form className="contact-form" onSubmit={handleSubmit}>
                <fieldset className="application-options">
                  <legend>What would you like to apply for?</legend>
                  <label className={`application-option${applicationType === "kilivo_member" ? " is-selected" : ""}`}>
                    <input
                      type="radio"
                      name="applicationType"
                      value="kilivo_member"
                      checked={applicationType === "kilivo_member"}
                      onChange={(event) => setApplicationType(event.target.value)}
                      required
                    />
                    <span><strong>Kilivo Member</strong><small>Join the KILIVO LABS membership community.</small></span>
                  </label>
                  <label className={`application-option${applicationType === "community_impact" ? " is-selected" : ""}`}>
                    <input
                      type="radio"
                      name="applicationType"
                      value="community_impact"
                      checked={applicationType === "community_impact"}
                      onChange={(event) => setApplicationType(event.target.value)}
                      required
                    />
                    <span><strong>Community Impact</strong><small>Apply to participate in community impact initiatives.</small></span>
                  </label>
                </fieldset>
                {applicationType && (
                  <>
                    <label>
                      Email address
                      <input
                        autoFocus
                        autoComplete="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                    </label>
                    <button className="button button--primary" type="submit">Request application form</button>
                    <p className="form-note">Demo only — this will preview an email; it will not be sent or saved.</p>
                  </>
                )}
              </form>
            ) : (
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
            )}
          </>
        )}
      </section>
    </div>
  );
}

const applicationSteps = ["Personal Info", "Details", "Additional Info", "Review & Submit"];
const allowedAttachmentTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
const maxAttachmentSize = 5 * 1024 * 1024;

function ApplicationFormPage({ applicationType }) {
  const isMemberApplication = applicationType === "kilivo_member";
  const title = isMemberApplication ? "KILIVO Member Application Form" : "Community Impact Application Form";
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ areas: [] });
  const [attachment, setAttachment] = useState(null);
  const [fileError, setFileError] = useState("");
  const [complete, setComplete] = useState(false);
  const formRef = useRef(null);

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function updateArea(event) {
    const { checked, value } = event.target;
    setValues((current) => ({
      ...current,
      areas: checked
        ? [...current.areas, value]
        : current.areas.filter((area) => area !== value),
    }));
  }

  function updateAttachment(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = `.${file.name.split(".").pop().toLowerCase()}`;
    if (!allowedAttachmentTypes.includes(extension)) {
      setAttachment(null);
      setFileError("Choose a PDF, DOC, DOCX, JPG, or PNG file.");
      event.target.value = "";
      return;
    }
    if (file.size > maxAttachmentSize) {
      setAttachment(null);
      setFileError("The file must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setAttachment(file);
    setFileError("");
  }

  function nextStep() {
    if (formRef.current?.reportValidity()) {
      setStep((current) => Math.min(current + 1, applicationSteps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setComplete(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const reviewItems = isMemberApplication
    ? [
        ["Full Name", values.fullName],
        ["Email Address", values.email],
        ["Phone Number", values.phone],
        ["Gender", values.gender],
        ["Date of Birth", values.dateOfBirth],
        ["Department / Division", values.division],
        ["Position / Role", values.position],
        ["Highest Education Level", values.education],
        ["Skills / Expertise", values.skills],
      ]
    : [
        ["Full Name", values.fullName],
        ["Email Address", values.email],
        ["Phone Number", values.phone],
        ["Location", values.location],
        ["Type of Support", values.supportType],
        ["Areas of Interest", values.areas?.join(", ")],
        ["Your Message", values.message],
      ];

  return (
    <div className="application-page">
      <header className="application-header">
        <Brand href="/" />
        <span className="secure-badge"><span aria-hidden="true">✓</span> Secure Application</span>
      </header>
      <section className={`application-hero${isMemberApplication ? " application-hero--member" : " application-hero--impact"}`}>
        <div>
          <p className="eyebrow">KILIVO LABS</p>
          <h1>{title}</h1>
          <p>{isMemberApplication ? "Join our forward-thinking team and be part of something greater." : "Together for a Better Tomorrow."}</p>
        </div>
      </section>

      <div className="application-progress" aria-label="Application progress">
        {applicationSteps.map((label, index) => (
          <div className={`progress-step${index === step ? " is-active" : ""}${index < step ? " is-complete" : ""}`} key={label} aria-current={index === step ? "step" : undefined}>
            <span>{index < step ? "✓" : index + 1}</span>
            <small>{label}</small>
          </div>
        ))}
      </div>

      <main className="application-content">
        {complete ? (
          <section className="application-complete" aria-live="polite">
            <span className="success-mark" aria-hidden="true">✓</span>
            <h2>Application demo complete</h2>
            <p>Your {isMemberApplication ? "KILIVO Member" : "Community Impact"} form has been completed in this preview. It has not been sent or saved.</p>
            <a className="button button--primary" href="/">Return to KILIVO LABS</a>
          </section>
        ) : (
          <form className="application-form" ref={formRef} onSubmit={handleSubmit}>
            {step === 0 && (
              <section className="application-section">
                <h2><span aria-hidden="true">{isMemberApplication ? "♙" : "♥"}</span> Personal Information</h2>
                <p>{isMemberApplication ? "Please provide your basic details" : "Tell us about yourself"}</p>
                <div className="application-fields">
                  <label>Full Name *
                    <input autoFocus name="fullName" autoComplete="name" value={values.fullName || ""} onChange={updateField} placeholder="Enter your full name" required />
                  </label>
                  <label>Email Address *
                    <input name="email" type="email" autoComplete="email" value={values.email || ""} onChange={updateField} placeholder="you@example.com" required />
                  </label>
                  <label>Phone Number *
                    <input name="phone" type="tel" autoComplete="tel" value={values.phone || ""} onChange={updateField} placeholder="+255 7XX XXX XXX" required />
                  </label>
                  {isMemberApplication ? (
                    <>
                      <label>Gender *
                        <select name="gender" value={values.gender || ""} onChange={updateField} required>
                          <option value="">Select gender</option><option>Female</option><option>Male</option><option>Prefer not to say</option>
                        </select>
                      </label>
                      <label>Date of Birth *
                        <input name="dateOfBirth" type="date" value={values.dateOfBirth || ""} onChange={updateField} required />
                      </label>
                    </>
                  ) : (
                    <label>Location *
                      <select name="location" value={values.location || ""} onChange={updateField} required>
                        <option value="">Select your region</option>
                        <option>Arusha</option><option>Dar es Salaam</option><option>Dodoma</option><option>Geita</option>
                        <option>Iringa</option><option>Kagera</option><option>Kilimanjaro</option><option>Mbeya</option>
                        <option>Mwanza</option><option>Other</option>
                      </select>
                    </label>
                  )}
                </div>
              </section>
            )}

            {step === 1 && (
              <section className="application-section">
                <h2><span aria-hidden="true">{isMemberApplication ? "▣" : "♡"}</span> {isMemberApplication ? "Professional Details" : "Contribution Details"}</h2>
                <p>{isMemberApplication ? "Tell us about your professional background" : "How would you like to support our community impact?"}</p>
                <div className="application-fields">
                  {isMemberApplication ? (
                    <>
                      <label>Department / Division *
                        <select name="division" value={values.division || ""} onChange={updateField} required>
                          <option value="">Select department</option>
                          <option>KILIVO Business</option><option>KILIVO Technologies</option><option>KILIVO Projects</option><option>KILIVO Impact</option>
                        </select>
                      </label>
                      <label>Position / Role *
                        <input name="position" value={values.position || ""} onChange={updateField} placeholder="Enter your position" required />
                      </label>
                      <label>Highest Education Level *
                        <select name="education" value={values.education || ""} onChange={updateField} required>
                          <option value="">Select education level</option>
                          <option>Secondary School</option><option>Certificate</option><option>Diploma</option><option>Bachelor's Degree</option><option>Master's Degree</option><option>Doctorate</option><option>Other</option>
                        </select>
                      </label>
                      <label>Skills / Expertise
                        <input name="skills" value={values.skills || ""} onChange={updateField} placeholder="e.g. Programming, Project Management" />
                      </label>
                    </>
                  ) : (
                    <>
                      <label>Type of Support *
                        <select name="supportType" value={values.supportType || ""} onChange={updateField} required>
                          <option value="">Select support type</option><option>Volunteer</option><option>Donate resources</option><option>Partner with us</option><option>Share expertise</option><option>Other</option>
                        </select>
                      </label>
                      <fieldset className="interest-options">
                        <legend>Area of Interest</legend>
                        {["Education", "Health", "Environment", "Others"].map((area) => (
                          <label key={area}><input type="checkbox" value={area} checked={values.areas?.includes(area) || false} onChange={updateArea} /> {area}</label>
                        ))}
                        {values.areas?.includes("Others") && (
                          <input aria-label="Specify other area of interest" name="otherArea" value={values.otherArea || ""} onChange={updateField} placeholder="Specify other area..." />
                        )}
                      </fieldset>
                    </>
                  )}
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="application-section">
                <h2><span aria-hidden="true">↗</span> Additional Information</h2>
                {!isMemberApplication && (
                  <label className="application-wide-field">Your Message (Optional)
                    <textarea name="message" rows="5" value={values.message || ""} onChange={updateField} placeholder="Tell us more about your interest or ideas..." />
                  </label>
                )}
                <label className="upload-field">
                  Supporting Documents (Optional)
                  <span>You may attach a CV, certificates, proposal, or other relevant documents.</span>
                  <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={updateAttachment} />
                  <small>PDF, DOC, DOCX, JPG, PNG · Max 5 MB</small>
                  {attachment && <small className="selected-file">Selected: {attachment.name}</small>}
                  {fileError && <small className="file-error" role="alert">{fileError}</small>}
                </label>
                <p className="application-demo-note">Preview only — attachments and form details will not be uploaded or saved.</p>
              </section>
            )}

            {step === 3 && (
              <section className="application-section">
                <h2><span aria-hidden="true">✓</span> Review Your Application</h2>
                <p>Check your details before completing the preview.</p>
                <dl className="application-review">
                  {reviewItems.filter(([, value]) => value).map(([label, value]) => (
                    <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                  ))}
                  {attachment && <div><dt>Supporting Document</dt><dd>{attachment.name}</dd></div>}
                </dl>
                <p className="application-demo-note">This is a demo. Submitting will not send or store your information.</p>
              </section>
            )}

            <div className="application-actions">
              <button className="button button--outline" type="button" onClick={previousStep} disabled={step === 0}>← Back</button>
              {step < applicationSteps.length - 1
                ? <button className="button button--primary" type="button" onClick={nextStep}>Continue →</button>
                : <button className="button button--primary" type="submit">Submit Application</button>}
            </div>
          </form>
        )}
      </main>
      <footer className="application-footer">© KILIVO LABS · Build. Innovate. Empower.</footer>
    </div>
  );
}

function App() {
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogApplicationMode, setDialogApplicationMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = searchItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );
  const requestedApplication = new URLSearchParams(window.location.search).get("application");

  if (requestedApplication === "kilivo_member" || requestedApplication === "community_impact") {
    return <ApplicationFormPage applicationType={requestedApplication} />;
  }

  function openContact(title, applicationMode = false) {
    setDialogTitle(title);
    setDialogApplicationMode(applicationMode);
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
          <button className="button button--primary button--member" type="button" onClick={() => openContact("Become a Member", true)}>
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

      <main className="main-wrapper">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <h1 id="hero-title">Together for a<br />Brighter Future</h1>
            <p className="hero-description">
              <strong>KILIVO LABS</strong> is a forward-thinking organization committed to innovation, community impact, and empowering people through technology.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#about"><span aria-hidden="true">ⓘ</span> Learn More</a>
              <button className="button button--outline" type="button" onClick={() => openContact("Join Our Community", true)}>
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
                  <button className="button button--yellow" type="button" onClick={() => openContact("Apply for Membership", true)}>
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

      {dialogTitle && (
        <ContactDialog
          title={dialogTitle}
          applicationMode={dialogApplicationMode}
          onClose={() => { setDialogTitle(""); setDialogApplicationMode(false); }}
        />
      )}
    </div>
  );
}

export default App;
