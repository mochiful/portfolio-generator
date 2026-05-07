export const templateCSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink: #1a1614;
  --ink-2: #4a4442;
  --ink-3: #8a8280;
  --paper: #f8f5f0;
  --paper-2: #f0ece5;
  --gold: #b8922a;
  --rule: #e0d8d0;
}

html { scroll-behavior: smooth; }

body {
  background: var(--paper);
  color: var(--ink);
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 400;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--gold); text-decoration: none; }
a:hover { text-decoration: underline; }

/* ── HERO ── */
.hero {
  background: var(--ink);
  color: var(--paper);
  padding: 80px 40px 72px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 50%, rgba(184,146,42,0.15) 0%, transparent 70%),
              radial-gradient(ellipse at 70% 30%, rgba(184,146,42,0.08) 0%, transparent 50%);
  pointer-events: none;
}

.hero-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(184,146,42,0.6);
  margin-bottom: 28px;
  box-shadow: 0 0 0 6px rgba(184,146,42,0.1);
}

.hero-name {
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(42px, 6vw, 72px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}

.hero-title {
  font-size: 16px;
  font-weight: 400;
  color: rgba(248,245,240,0.6);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 28px;
}

.hero-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  font-size: 13px;
  color: rgba(248,245,240,0.5);
}

.hero-contact a { color: rgba(184,146,42,0.85); }

.hero-rule {
  width: 40px;
  height: 1px;
  background: var(--gold);
  margin: 24px auto 0;
  opacity: 0.5;
}

/* ── CONTENT ── */
.content {
  max-width: 720px;
  margin: 0 auto;
  padding: 64px 24px 80px;
}

.section {
  margin-bottom: 56px;
}

.section-label {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--rule);
}

/* Summary */
.summary-text {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 21px;
  font-style: italic;
  line-height: 1.65;
  color: var(--ink-2);
}

/* Skills */
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 5px 14px;
  border: 1px solid var(--rule);
  border-radius: 20px;
  font-size: 13px;
  color: var(--ink-2);
  background: var(--paper-2);
}

/* Experience & Education */
.entry {
  padding: 24px 0;
  border-bottom: 1px solid var(--rule);
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 24px;
}

.entry:last-child { border-bottom: none; }

.entry-meta {
  padding-top: 3px;
}

.entry-dates {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 11px;
  color: var(--ink-3);
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}

.entry-company, .entry-school {
  font-size: 13px;
  font-weight: 500;
  color: var(--gold);
}

.entry-role, .entry-degree {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.25;
  margin-bottom: 8px;
}

.entry-desc {
  font-size: 14px;
  color: var(--ink-2);
  line-height: 1.7;
  white-space: pre-line;
}

.entry-field {
  font-size: 13px;
  color: var(--ink-3);
  margin-top: 2px;
}

/* Footer */
footer {
  background: var(--ink);
  color: rgba(248,245,240,0.3);
  text-align: center;
  padding: 24px;
  font-size: 12px;
  letter-spacing: 0.04em;
}

@media (max-width: 680px) {
  .hero {
    padding: 56px 22px 48px;
  }

  .hero-contact {
    gap: 10px 16px;
  }

  .content {
    padding: 44px 20px 60px;
  }

  .section {
    margin-bottom: 42px;
  }

  .entry {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 20px 0;
  }

  .summary-text {
    font-size: 18px;
  }
}
`

export default function ScrollingTemplate({ data }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{data.name ? `${data.name} — Portfolio` : 'Portfolio'}</title>
        <style dangerouslySetInnerHTML={{ __html: templateCSS }} />
      </head>
      <body>
        <header className="hero">
          {data.photo && <img src={data.photo} alt={data.name} className="hero-photo" />}
          <h1 className="hero-name">{data.name || 'Your Name'}</h1>
          {data.title && <p className="hero-title">{data.title}</p>}
          <div className="hero-contact">
            {data.email && <a href={`mailto:${data.email}`}>{data.email}</a>}
            {data.phone && <span>{data.phone}</span>}
            {data.location && <span>{data.location}</span>}
            {data.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            {data.github && <a href={data.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
            {data.website && <a href={data.website} target="_blank" rel="noopener noreferrer">{data.website.replace(/^https?:\/\//, '')}</a>}
          </div>
          <div className="hero-rule" />
        </header>

        <main className="content">
          {data.summary && (
            <section className="section">
              <div className="section-label">About</div>
              <p className="summary-text">{data.summary}</p>
            </section>
          )}

          {data.skills?.length > 0 && (
            <section className="section">
              <div className="section-label">Skills</div>
              <div className="skills-list">
                {data.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </section>
          )}

          {data.experience?.length > 0 && (
            <section className="section">
              <div className="section-label">Experience</div>
              {data.experience.map((exp, i) => (
                <div key={i} className="entry">
                  <div className="entry-meta">
                    <div className="entry-dates">{exp.dates}</div>
                    <div className="entry-company">{exp.company}</div>
                  </div>
                  <div>
                    <div className="entry-role">{exp.role}</div>
                    {exp.description && <p className="entry-desc">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </section>
          )}

          {data.education?.length > 0 && (
            <section className="section">
              <div className="section-label">Education</div>
              {data.education.map((edu, i) => (
                <div key={i} className="entry">
                  <div className="entry-meta">
                    <div className="entry-dates">{edu.dates}</div>
                    <div className="entry-school">{edu.school}</div>
                  </div>
                  <div>
                    <div className="entry-degree">{edu.degree}</div>
                    {edu.field && <p className="entry-field">{edu.field}</p>}
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>

        <footer>
          {data.name} · Built with Luminary
        </footer>
      </body>
    </html>
  )
}
