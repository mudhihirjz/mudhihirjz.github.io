import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faCloudArrowUp,
  faHandshake,
  faLightbulb,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
  faJava,
  faPostgresql,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';

const icons = {
  home: (
    <>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9M9 20v-6h6v6" />
    </>
  ),
  article: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5M9 12h7M9 16h7" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  rocket: (
    <>
      <path d="M4 16c-1.5 1.3-2 4-2 4s2.7-.5 4-2c.7-.7.7-1.8 0-2.5S4.7 15.3 4 16Z" />
      <path d="m12 15-3-3a18 18 0 0 1 9-9c2-1 4-1 4-1s0 2-1 4a18 18 0 0 1-9 9Z" />
      <path d="m9 12-4 1-2 4 5-1M12 15l-1 4 4 2 1-5M14 9h.01" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  folder: (
    <>
      <path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M3 9h18" />
    </>
  ),
  send: (
    <>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18M8 15h.01M12 15h.01M16 15h.01" />
    </>
  ),
  graduation: (
    <>
      <path d="m2 10 10-6 10 6-10 6z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5M22 10v6" />
    </>
  ),
  github: (
    <>
      <path
        d="M12 .7a11.3 11.3 0 0 0-3.58 22.02c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.26-1.65-1.26-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.64 1.23 3.28.94.1-.73.4-1.23.72-1.52-2.5-.28-5.14-1.25-5.14-5.57 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-3 0 0 .95-.3 3.11 1.15a10.8 10.8 0 0 1 5.66 0c2.16-1.45 3.11-1.15 3.11-1.15.62 1.56.23 2.71.12 3 .72.79 1.15 1.8 1.15 3.03 0 4.33-2.64 5.28-5.15 5.56.41.36.77 1.06.77 2.14v3.18c0 .3.21.65.78.54A11.3 11.3 0 0 0 12 .7Z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
};

function Icon({ name, size = 20, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}

function ImageSlideshow({ images, className = '', interval = 10000 }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [images, interval]);

  return (
    <div className={`image-slideshow ${className}`}>
      {images.map((image, index) => (
        <img
          key={image}
          className={index === activeIndex ? 'slideshow-image is-active' : 'slideshow-image'}
          src={image}
          alt=""
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      ))}
      <div className="slideshow-dots" aria-hidden="true">
        {images.map((image, index) => (
          <span
            key={image}
            className={index === activeIndex ? 'slideshow-dot is-active' : 'slideshow-dot'}
          />
        ))}
      </div>
    </div>
  );
}

const highlights = [
  {
    title: 'Coding Journey',
    description: 'Turning ideas into solutions...',
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1537498425277-c283d32ef9db?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=900&q=85',
    ],
  },
  {
    title: 'Technology & Innovation',
    description: 'Exploring the digital world...',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=900&q=85',
    ],
  },
  {
    title: 'Knowledge is Power',
    description: 'Keep learning, keep growing...',
    images: [
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=85',
    ],
  },
];

const articles = [
  {
    title: 'Getting Started with Java',
    date: 'Nov 21, 2025',
    description: "A beginner's guide to Java programming...",
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=900&q=85',
    ],
    body: 'Java is a great place to begin learning object-oriented programming. Start with variables, data types, and control flow, then build small projects to practice classes, methods, and problem-solving.',
  },
  {
    title: 'Introduction to PostgreSQL',
    date: 'Nov 15, 2025',
    description: 'Learn the basics of PostgreSQL databases...',
    images: [
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=900&q=85',
    ],
    body: 'PostgreSQL is a powerful open-source relational database. This introduction covers tables, common SQL queries, and how structured data can support reliable backend applications.',
  },
  {
    title: 'Understanding REST APIs',
    date: 'Nov 10, 2025',
    description: 'Build and consume RESTful APIs...',
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=900&q=85',
    ],
    body: 'REST APIs let applications communicate through predictable HTTP endpoints. Learn how resources, request methods, status codes, and JSON responses fit together in a web service.',
  },
];

const closingImages = [
  {
    title: 'Explore · Learn · Innovate',
    images: [
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85',
    ],
  },
  {
    title: 'Never Stop Learning',
    images: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=85',
    ],
  },
  {
    title: 'Build a Better Tomorrow',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=900&q=85',
    ],
  },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        <a className="nav-link active" href="#home" onClick={closeMenu}>
          <Icon name="home" size={16} />
          Home
        </a>
        <a className="nav-link" href="#articles" onClick={closeMenu}>
          <Icon name="article" size={16} />
          Articles
        </a>
        <a className="nav-link" href="#about" onClick={closeMenu}>
          <Icon name="user" size={16} />
          About
        </a>
        <a className="nav-link" href="#contact" onClick={closeMenu}>
          <Icon name="mail" size={16} />
          Contact
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <Header />
      <div className="hero-content">
        <div className="profile-avatar" aria-hidden="true">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <h1>Mudhihir JZ</h1>
        <div className="hero-role">
          <span />
          <p>Aspiring Backend Developer</p>
          <span />
        </div>
        <p className="motto">Learn. Build. Grow.</p>
        <p className="hero-description">
          A passionate learner, always exploring technology
          <br className="desktop-break" /> and working towards a better digital future.
        </p>
        <div className="hero-tags" aria-label="About me">
          <span>
            <Icon name="graduation" size={18} />
            Student / Learner
          </span>
          <span>
            <Icon name="pin" size={18} />
            Tanzania
          </span>
          <span>
            <Icon name="rocket" size={18} />
            Dream Big
          </span>
        </div>
      </div>
    </section>
  );
}

function HighlightCards() {
  return (
    <section className="highlight-grid" aria-label="My interests">
      {highlights.map((item) => (
        <a
          className="highlight-card"
          href="#about"
          key={item.title}
        >
          <ImageSlideshow images={item.images} className="highlight-slideshow" />
          <span className="highlight-shade" />
          <span className="highlight-copy">
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </span>
          <span className="round-arrow">
            <Icon name="arrow" size={17} />
          </span>
        </a>
      ))}
    </section>
  );
}

function Learning() {
  return (
    <section className="learning-panel panel" id="about">
      <div className="learning-art" aria-hidden="true">
        <FontAwesomeIcon icon={faLightbulb} className="learning-bulb" />
        <FontAwesomeIcon icon={faBookOpen} className="learning-book" />
      </div>
      <div className="learning-copy">
        <h2>
          My Aspiration &amp; What I&apos;m <span>Learning</span>
        </h2>
        <p>
          I am on a journey to become a skilled Backend Developer,
          <br className="desktop-break" /> currently learning modern technologies such as:
        </p>
        <div className="skill-list">
          <span className="skill-pill">
            <FontAwesomeIcon icon={faJava} className="skill-icon java-icon" />
            Java
          </span>
          <span className="skill-pill">
            <FontAwesomeIcon icon={faPostgresql} className="skill-icon postgres-icon" />
            PostgreSQL
          </span>
          <span className="skill-pill">
            <FontAwesomeIcon icon={faCloudArrowUp} className="skill-icon api-icon" />
            REST API
          </span>
        </div>
      </div>
    </section>
  );
}

function ArticleModal({ article, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="article-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close article">
          ×
        </button>
        <ImageSlideshow images={article.images} className="modal-slideshow" interval={10000} />
        <div className="modal-copy">
          <span className="modal-date">{article.date}</span>
          <h2 id="modal-title">{article.title}</h2>
          <p>{article.body}</p>
        </div>
      </section>
    </div>
  );
}

function Articles() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <section className="articles-section" id="articles">
      <div className="section-heading">
        <h2>
          <Icon name="folder" size={31} />
          My Articles
        </h2>
        <a className="text-link" href="#articles">
          View All Articles <Icon name="arrow" size={17} />
        </a>
      </div>
      <div className="article-grid">
        {articles.map((article) => (
          <article className="article-card" key={article.title}>
            <div className="article-image-wrap">
              <ImageSlideshow images={article.images} className="article-slideshow" />
              <span className="article-date">
                <Icon name="calendar" size={14} />
                {article.date}
              </span>
            </div>
            <div className="article-content">
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <button
                className="read-more"
                type="button"
                onClick={() => setSelectedArticle(article)}
              >
                Read More <Icon name="arrow" size={15} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </section>
  );
}

function ContactBanner() {
  return (
    <section className="contact-banner">
      <div className="handshake" aria-hidden="true">
        <FontAwesomeIcon icon={faHandshake} />
      </div>
      <h2>
        Have an Opportunity?
        <span>Let&apos;s Connect!</span>
      </h2>
      <p>I&apos;m open for internships, collaborations and new opportunities.</p>
      <a className="primary-button" href="mailto:mudhihirjz@gmail.com">
        <Icon name="send" size={18} />
        Get in Touch
      </a>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-icon">
        <Icon name="mail" size={26} />
      </div>
      <h2>Contact Me via Email</h2>
      <p>Feel free to reach out for any inquiry or collaboration.</p>
      <a className="email-chip" href="mailto:mudhihirjz@gmail.com">
        <Icon name="mail" size={16} />
        mudhihirjz@gmail.com
      </a>
    </section>
  );
}

function ClosingGallery() {
  return (
    <section className="closing-gallery" aria-label="Explore, learn, and build">
      {closingImages.map((item) => (
        <div
          className="closing-card"
          key={item.title}
        >
          <ImageSlideshow images={item.images} className="closing-slideshow" />
          <span className="closing-shade" />
          <strong>{item.title}</strong>
        </div>
      ))}
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="social-links">
        <a href="https://github.com/mudhihirjz" target="_blank" rel="noreferrer" aria-label="GitHub">
          <Icon name="github" size={27} />
        </a>
        <span className="social-divider" />
        <a href="mailto:mudhihirjz@gmail.com" aria-label="Email">
          <Icon name="mail" size={25} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Mudihir JZ. All rights reserved.</span>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="app-shell">
      <div className="hero-backdrop">
        <Hero />
      </div>
      <main className="page-content">
        <HighlightCards />
        <Learning />
        <Articles />
        <ContactBanner />
        <Contact />
        <ClosingGallery />
      </main>
      <Footer />
      <a
        className="whatsapp-button"
        href="https://wa.me/255671533265"
        target="_blank"
        rel="noreferrer"
        aria-label="Contact me on WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} />
      </a>
    </div>
  );
}

export default App;
