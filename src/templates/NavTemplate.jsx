export const templateCSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --navy: #0f172a;
  --navy-2: #1e293b;
  --navy-3: #334155;
  --slate: #64748b;
  --silver: #94a3b8;
  --cloud: #f8fafc;
  --white: #ffffff;
  --blue: #3b82f6;
  --blue-dim: #2563eb;
  --rule: #e2e8f0;
  --nav-h: 64px;
}

html { scroll-behavior: smooth; }

body {
  background: var(--white);
  color: var(--navy);
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 400;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--blue); text-decoration: none; }
a:hover { text-decoration: underline; }

/* ── NAV ── */
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-h);
  background: rgba(15,23,42,0.97);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  z-index: 100;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.nav-name {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}

.nav-links {
  display: flex;
  gap: 4px;
  list-style: none;
}

.nav-links a {
  display: block;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.55);
  transition: all 0.15s ease;
  text-decoration: none;
}

.nav-links a:hover {
  color: #fff;
  background: rgba(255,255,255,0.08);
  text-decoration: none;
}

/* ── HERO ── */
.hero {
  padding-top: var(--nav-h);
  background: var(--cloud);
  border-bottom: 1px solid var(--rule);
}

.hero-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 64px 40px;
  display: flex;
  align-items: center;
  gap: 48px;
}

.hero-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--white);
  box-shadow: 0 0 0 1px var(--rule), 0 8px 32px rgba(15,23,42,0.12);
  flex-shrink: 0;
}

.hero-name {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--navy);
  margin-bottom: 6px;
}

.hero-title {
  font-size: 16px;
  color: var(--slate);
  font-weight: 400;
  margin-bottom: 20px;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 13px;
  color: var(--silver);
}

.hero-meta span::before {
  content: '·';
  margin-right: 8px;
}

.hero-meta span:first-child::before { content: ''; margin-right: 0; }

.hero-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1.5px solid var(--rule);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--navy-2);
  transition: all 0.15s ease;
  text-decoration: none;
  background: var(--white);
}

.hero-link:hover {
  border-color: var(--blue);
  color: var(--blue);
  text-decoration: none;
}

/* ── SECTIONS ── */
.section {
  border-bottom: 1px solid var(--rule);
}

.section:nth-child(even) .section-inner {
  background: var(--cloud);
}

.section-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 56px 40px;
}

.section-heading {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--navy);
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-heading::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--rule);
}

/* Summary */
.summary-text {
  font-size: 16px;
  color: var(--slate);
  line-height: 1.75;
  max-width: 680px;
}

/* Skills */
.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-chip {
  padding: 5px 14px;
  background: var(--white);
  border: 1.5px solid var(--rule);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--navy-2);
  transition: all 0.15s ease;
}

.skill-chip:hover {
  border-color: var(--blue);
  color: var(--blue-dim);
}

/* Experience */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 32px;
  padding: 28px 0;
  border-bottom: 1px solid var(--rule);
}

.timeline-item:last-child { border-bottom: none; }

.tl-meta {
  padding-top: 3px;
}

.tl-dates {
  font-size: 12px;
  font-weight: 600;
  color: var(--blue);
  letter-spacing: 0.02em;
  margin-bottom: 4px;
}

.tl-company {
  font-size: 13px;
  color: var(--slate);
  font-weight: 500;
}

.tl-role {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--navy);
  margin-bottom: 8px;
}

.tl-desc {
  font-size: 14px;
  color: var(--slate);
  line-height: 1.7;
  white-space: pre-line;
}

/* Education */
.edu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.edu-card {
  background: var(--white);
  border: 1.5px solid var(--rule);
  border-radius: 8px;
  padding: 24px;
  transition: all 0.15s ease;
}

.edu-card:hover {
  border-color: var(--blue);
  box-shadow: 0 4px 16px rgba(59,130,246,0.1);
}

.edu-degree {
  font-size: 16px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 4px;
}

.edu-field {
  font-size: 13px;
  color: var(--blue);
  font-weight: 500;
  margin-bottom: 8px;
}

.edu-school {
  font-size: 14px;
  color: var(--slate);
  margin-bottom: 4px;
}

.edu-dates {
  font-size: 12px;
  color: var(--silver);
}

/* Footer */
footer {
  background: var(--navy);
  color: rgba(255,255,255,0.3);
  text-align: center;
  padding: 28px 24px;
  font-size: 12px;
  letter-spacing: 0.03em;
}

footer a { color: rgba(255,255,255,0.5); }

@media (max-width: 760px) {
  nav {
    height: auto;
    min-height: var(--nav-h);
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    padding: 14px 20px;
  }

  .nav-links {
    flex-wrap: wrap;
  }

  .nav-links a {
    padding: 5px 10px;
  }

  .hero {
    padding-top: 110px;
  }

  .hero-inner {
    align-items: flex-start;
    flex-direction: column;
    padding: 42px 22px;
    gap: 24px;
  }

  .section-inner {
    padding: 42px 22px;
  }

  .timeline-item {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
`

export default function NavTemplate({ data }) {
  const hasAbout = data.summary
  const hasSkills = data.skills?.length > 0
  const hasExp = data.experience?.length > 0
  const hasEdu = data.education?.length > 0
  const customSections = getCustomSections(data)

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{data.name ? `${data.name} — Portfolio` : 'Portfolio'}</title>
        <style dangerouslySetInnerHTML={{ __html: templateCSS }} />
      </head>
      <body>
        <nav>
          <div className="nav-name">{data.name || 'Portfolio'}</div>
          <ul className="nav-links">
            {hasAbout && <li><a href="#about">About</a></li>}
            {hasSkills && <li><a href="#skills">Skills</a></li>}
            {hasExp && <li><a href="#experience">Experience</a></li>}
            {hasEdu && <li><a href="#education">Education</a></li>}
            {customSections.map(section => (
              <li key={section.id}><a href={`#${section.anchor}`}>{section.title}</a></li>
            ))}
          </ul>
        </nav>

        <div className="hero">
          <div className="hero-inner">
            {data.photo && <img src={data.photo} alt={data.name} className="hero-photo" />}
            <div>
              <h1 className="hero-name">{data.name || 'Your Name'}</h1>
              {data.title && <p className="hero-title">{data.title}</p>}
              <div className="hero-meta">
                {data.location && <span>{data.location}</span>}
                {data.email && <span>{data.email}</span>}
                {data.phone && <span>{data.phone}</span>}
              </div>
              <div className="hero-links">
                {data.email && <a href={`mailto:${data.email}`} className="hero-link">✉ Email</a>}
                {data.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="hero-link">in LinkedIn</a>}
                {data.github && <a href={data.github} target="_blank" rel="noopener noreferrer" className="hero-link">⌥ GitHub</a>}
                {data.website && <a href={data.website} target="_blank" rel="noopener noreferrer" className="hero-link">↗ Website</a>}
              </div>
            </div>
          </div>
        </div>

        {hasAbout && (
          <section id="about" className="section">
            <div className="section-inner">
              <h2 className="section-heading">About</h2>
              <p className="summary-text">{data.summary}</p>
            </div>
          </section>
        )}

        {hasSkills && (
          <section id="skills" className="section">
            <div className="section-inner">
              <h2 className="section-heading">Skills</h2>
              <div className="skills-grid">
                {data.skills.map((skill, i) => (
                  <span key={i} className="skill-chip">{skill}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        {hasExp && (
          <section id="experience" className="section">
            <div className="section-inner">
              <h2 className="section-heading">Experience</h2>
              <div className="timeline">
                {data.experience.map((exp, i) => (
                  <div key={i} className="timeline-item">
                    <div className="tl-meta">
                      <div className="tl-dates">{exp.dates}</div>
                      <div className="tl-company">{exp.company}</div>
                    </div>
                    <div>
                      <div className="tl-role">{exp.role}</div>
                      {exp.description && <p className="tl-desc">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {hasEdu && (
          <section id="education" className="section">
            <div className="section-inner">
              <h2 className="section-heading">Education</h2>
              <div className="edu-grid">
                {data.education.map((edu, i) => (
                  <div key={i} className="edu-card">
                    <div className="edu-degree">{edu.degree}</div>
                    {edu.field && <div className="edu-field">{edu.field}</div>}
                    <div className="edu-school">{edu.school}</div>
                    <div className="edu-dates">{edu.dates}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {customSections.map(section => (
          <section key={section.id} id={section.anchor} className="section">
            <div className="section-inner">
              <h2 className="section-heading">{section.title}</h2>
              <div className="timeline">
                {section.entries.map(entry => (
                  <div key={entry.id} className="timeline-item">
                    <div className="tl-meta">
                      <div className="tl-dates">{entry.dates}</div>
                      <div className="tl-company">{entry.name}</div>
                      {entry.location && <div className="tl-dates">{entry.location}</div>}
                    </div>
                    <div>
                      <div className="tl-role">{entry.title}</div>
                      {entry.description && <p className="tl-desc" style={{ whiteSpace: 'pre-line' }}>{entry.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        <footer>
          <p>{data.name} · Built with Luminary</p>
        </footer>
      </body>
    </html>
  )
}

function getCustomSections(data) {
  return (data.customSections || [])
    .map(normalizeCustomSection)
    .filter(section => section.title && section.entries.length > 0)
    .map((section, i) => ({
      ...section,
      anchor: `custom-${slugify(section.title)}-${i}`,
    }))
}

function normalizeCustomSection(section, sectionIdx) {
  return {
    id: section.id || `custom-${sectionIdx}`,
    title: section.title?.trim() || '',
    entries: getCustomEntries(section),
  }
}

function getCustomEntries(section) {
  if (Array.isArray(section.entries)) {
    return section.entries
      .map((entry, i) => ({
        id: entry.id || `${section.id || 'custom'}-entry-${i}`,
        name: entry.name?.trim() || '',
        title: entry.title?.trim() || '',
        location: entry.location?.trim() || '',
        dates: entry.dates?.trim() || '',
        description: entry.description?.trim() || '',
      }))
      .filter(entry => entry.name || entry.title || entry.location || entry.dates || entry.description)
  }

  const content = section.content?.trim()
  return content ? [{ id: `${section.id || 'custom'}-entry-0`, name: '', title: '', location: '', dates: '', description: content }] : []
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'section'
}
