export const templateCSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #080b12;
  --bg-2: #0d1117;
  --bg-3: #111827;
  --surface: #161d2e;
  --surface-2: #1c253a;
  --border: #1e2d45;
  --border-2: #263550;
  --text: #e8edf5;
  --text-2: #8899b4;
  --text-3: #4a5c78;
  --teal: #2dd4bf;
  --teal-dim: rgba(45,212,191,0.15);
  --teal-glow: rgba(45,212,191,0.25);
  --purple: #a78bfa;
  --purple-dim: rgba(167,139,250,0.12);
  --blue: #60a5fa;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--teal); text-decoration: none; }
a:hover { text-decoration: underline; }

/* ── HEADER ── */
.header {
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
  padding: 48px 0;
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 48px;
  display: flex;
  align-items: flex-start;
  gap: 40px;
}

.header-photo {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-2);
  box-shadow: 0 0 0 4px var(--teal-dim), 0 16px 40px rgba(0,0,0,0.4);
  flex-shrink: 0;
}

.header-avatar-placeholder {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--surface-2), var(--border-2));
  border: 2px solid var(--border-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-3);
  flex-shrink: 0;
}

.header-info { flex: 1; min-width: 0; }

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--teal-dim);
  border: 1px solid rgba(45,212,191,0.2);
  border-radius: 999px;
  padding: 4px 12px;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 10px;
  color: var(--teal);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.header-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--teal);
  box-shadow: 0 0 6px var(--teal);
}

.header-name {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 8px;
}

.header-title {
  font-size: 15px;
  color: var(--text-2);
  margin-bottom: 20px;
}

.header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 12px;
  color: var(--text-3);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  margin-bottom: 20px;
}

.header-meta a { color: var(--teal); font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; }

.skills-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-pill {
  padding: 3px 10px;
  background: var(--purple-dim);
  border: 1px solid rgba(167,139,250,0.2);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  color: var(--purple);
}

/* ── MAIN ── */
.main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 48px 80px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
}

/* Section headers */
.section-title {
  font-size: 11px;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--teal);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

/* Summary card */
.summary-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 28px;
  border-left: 3px solid var(--teal);
}

.summary-text {
  font-size: 15px;
  color: var(--text-2);
  line-height: 1.8;
}

/* Skills section */
.skills-full {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-card {
  padding: 6px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-2);
  transition: all 0.15s ease;
}

/* Experience timeline */
.exp-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.exp-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 28px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 24px;
  position: relative;
  overflow: hidden;
}

.exp-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, var(--blue), transparent);
}

.exp-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--blue);
  border: 2px solid var(--bg);
  box-shadow: 0 0 8px rgba(96,165,250,0.5);
  margin-top: 6px;
  flex-shrink: 0;
}

.exp-dates {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 11px;
  color: var(--blue);
  margin-bottom: 4px;
}

.exp-company {
  font-size: 12px;
  color: var(--text-3);
  font-weight: 500;
  margin-bottom: 6px;
}

.exp-role {
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 10px;
}

.exp-desc {
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.7;
  white-space: pre-line;
}

/* Education grid */
.edu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.edu-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.edu-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--purple), transparent);
}

.edu-degree {
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.edu-field {
  font-size: 13px;
  color: var(--purple);
  font-weight: 500;
  margin-bottom: 10px;
}

.edu-school {
  font-size: 14px;
  color: var(--text-2);
  margin-bottom: 4px;
}

.edu-dates {
  font-size: 11px;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  color: var(--text-3);
}

/* Footer */
footer {
  border-top: 1px solid var(--border);
  padding: 24px 48px;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-3);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

@media (max-width: 760px) {
  .header {
    padding: 36px 0;
  }

  .header-inner {
    flex-direction: column;
    padding: 0 22px;
    gap: 24px;
  }

  .main {
    padding: 36px 22px 56px;
    gap: 36px;
  }

  .exp-card {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .edu-grid {
    grid-template-columns: 1fr;
  }

  footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
    padding: 22px;
  }
}
`

export default function CardTemplate({ data }) {
  const nameInitial = data.name ? data.name.charAt(0) : '?'

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{data.name ? `${data.name} — Portfolio` : 'Portfolio'}</title>
        <style dangerouslySetInnerHTML={{ __html: templateCSS }} />
      </head>
      <body>
        <header className="header">
          <div className="header-inner">
            {data.photo ? (
              <img src={data.photo} alt={data.name} className="header-photo" />
            ) : (
              <div className="header-avatar-placeholder">{nameInitial}</div>
            )}
            <div className="header-info">
              <div className="header-badge">Available for work</div>
              <h1 className="header-name">{data.name || 'Your Name'}</h1>
              {data.title && <p className="header-title">{data.title}</p>}
              <div className="header-meta">
                {data.location && <span>{data.location}</span>}
                {data.email && <a href={`mailto:${data.email}`}>{data.email}</a>}
                {data.phone && <span>{data.phone}</span>}
                {data.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
                {data.github && <a href={data.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
                {data.website && <a href={data.website} target="_blank" rel="noopener noreferrer">{data.website.replace(/^https?:\/\//, '')} ↗</a>}
              </div>
              {data.skills?.length > 0 && (
                <div className="skills-inline">
                  {data.skills.slice(0, 10).map((skill, i) => (
                    <span key={i} className="skill-pill">{skill}</span>
                  ))}
                  {data.skills.length > 10 && (
                    <span className="skill-pill">+{data.skills.length - 10} more</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="main">
          {data.summary && (
            <section>
              <div className="section-title">About</div>
              <div className="summary-card">
                <p className="summary-text">{data.summary}</p>
              </div>
            </section>
          )}

          {data.skills?.length > 0 && (
            <section>
              <div className="section-title">Skills &amp; Technologies</div>
              <div className="skills-full">
                {data.skills.map((skill, i) => (
                  <span key={i} className="skill-card">{skill}</span>
                ))}
              </div>
            </section>
          )}

          {data.experience?.length > 0 && (
            <section>
              <div className="section-title">Experience</div>
              <div className="exp-timeline">
                {data.experience.map((exp, i) => (
                  <div key={i} className="exp-card">
                    <div className="exp-dot" />
                    <div>
                      <div className="exp-dates">{exp.dates}</div>
                      <div className="exp-company">{exp.company}</div>
                      <div className="exp-role">{exp.role}</div>
                      {exp.description && <p className="exp-desc">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education?.length > 0 && (
            <section>
              <div className="section-title">Education</div>
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
            </section>
          )}
        </div>

        <footer>
          <span>{data.name}</span>
          <span>Built with Luminary</span>
        </footer>
      </body>
    </html>
  )
}
