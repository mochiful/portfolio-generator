import { useState } from 'react'

export default function DataEditor({ initialData, onBack, onNext }) {
  const [data, setData] = useState(() => ({
    ...initialData,
    skills: initialData.skills || [],
    experience: initialData.experience || [],
    education: initialData.education || [],
    customSections: (initialData.customSections || []).map(normalizeCustomSection),
  }))
  const [skillInput, setSkillInput] = useState('')
  const [editingSkillIdx, setEditingSkillIdx] = useState(null)
  const [editingSkillValue, setEditingSkillValue] = useState('')
  const [error, setError] = useState(null)

  function set(field, value) {
    setData(d => ({ ...d, [field]: value }))
  }

  function addSkill() {
    const s = skillInput.trim()
    if (s && !data.skills.includes(s)) {
      set('skills', [...data.skills, s])
    }
    setSkillInput('')
  }

  function removeSkill(idx) {
    set('skills', data.skills.filter((_, i) => i !== idx))
    if (editingSkillIdx === idx) cancelSkillEdit()
  }

  function startSkillEdit(idx) {
    setEditingSkillIdx(idx)
    setEditingSkillValue(data.skills[idx] || '')
  }

  function saveSkillEdit() {
    if (editingSkillIdx === null) return
    const nextValue = editingSkillValue.trim()
    const updated = data.skills
      .map((skill, i) => i === editingSkillIdx ? nextValue : skill)
      .filter(Boolean)
      .filter((skill, i, arr) => arr.findIndex(v => v.toLowerCase() === skill.toLowerCase()) === i)
    set('skills', updated)
    cancelSkillEdit()
  }

  function cancelSkillEdit() {
    setEditingSkillIdx(null)
    setEditingSkillValue('')
  }

  function updateExp(idx, field, value) {
    const updated = data.experience.map((e, i) => i === idx ? { ...e, [field]: value } : e)
    set('experience', updated)
  }

  function addExp() {
    set('experience', [
      ...data.experience,
      { id: createId(), company: '', role: '', dates: '', description: '' },
    ])
  }

  function removeExp(idx) {
    set('experience', data.experience.filter((_, i) => i !== idx))
  }

  function updateEdu(idx, field, value) {
    const updated = data.education.map((e, i) => i === idx ? { ...e, [field]: value } : e)
    set('education', updated)
  }

  function addEdu() {
    set('education', [
      ...data.education,
      { id: createId(), school: '', degree: '', field: '', dates: '' },
    ])
  }

  function removeEdu(idx) {
    set('education', data.education.filter((_, i) => i !== idx))
  }

  function updateCustomSection(idx, field, value) {
    const updated = data.customSections.map((section, i) => i === idx ? { ...section, [field]: value } : section)
    set('customSections', updated)
  }

  function updateCustomEntry(sectionIdx, entryIdx, field, value) {
    const updated = data.customSections.map((section, i) => {
      if (i !== sectionIdx) return section
      return {
        ...section,
        entries: section.entries.map((entry, j) => j === entryIdx ? { ...entry, [field]: value } : entry),
      }
    })
    set('customSections', updated)
  }

  function addCustomSection() {
    set('customSections', [
      ...data.customSections,
      { id: createId(), title: '', entries: [createCustomEntry()] },
    ])
  }

  function removeCustomSection(idx) {
    set('customSections', data.customSections.filter((_, i) => i !== idx))
  }

  function addCustomEntry(sectionIdx) {
    const updated = data.customSections.map((section, i) => i === sectionIdx
      ? { ...section, entries: [...section.entries, createCustomEntry()] }
      : section)
    set('customSections', updated)
  }

  function removeCustomEntry(sectionIdx, entryIdx) {
    const updated = data.customSections.map((section, i) => i === sectionIdx
      ? { ...section, entries: section.entries.filter((_, j) => j !== entryIdx) }
      : section)
    set('customSections', updated)
  }

  function handleNext() {
    if (!data.name.trim()) {
      setError('Please enter a name before continuing.')
      return
    }
    onNext({
      ...data,
      customSections: data.customSections
        .map(section => ({
          ...section,
          title: section.title.trim(),
          entries: section.entries
            .map(entry => ({
              ...entry,
              name: entry.name.trim(),
              title: entry.title.trim(),
              location: entry.location.trim(),
              dates: entry.dates.trim(),
              description: entry.description.trim(),
            }))
            .filter(entry => entry.name || entry.title || entry.location || entry.dates || entry.description),
        }))
        .filter(section => section.title && section.entries.length > 0),
    })
  }

  return (
    <>
      <div style={{ textAlign: 'center', maxWidth: 560 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--amber)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          Step 2 of 4
        </div>
        <h1 className="page-title" style={{ fontSize: 36 }}>
          Review <em>extracted</em> data
        </h1>
        <p className="page-subtitle" style={{ marginBottom: 40 }}>
          Check the fields below and correct anything the parser missed. Everything is editable.
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: 720 }}>
        {/* Basics */}
        <Section title="Basics">
          <div className="editor-grid">
            <Field label="Full Name *" value={data.name} onChange={v => set('name', v)} placeholder="Jane Smith" />
            <Field label="Headline / Title" value={data.title} onChange={v => set('title', v)} placeholder="Senior Product Designer" />
            <Field label="Email" value={data.email} onChange={v => set('email', v)} placeholder="jane@example.com" />
            <Field label="Phone" value={data.phone} onChange={v => set('phone', v)} placeholder="+1 555 000 0000" />
            <Field label="Location" value={data.location} onChange={v => set('location', v)} placeholder="San Francisco, CA" />
            <Field label="Website" value={data.website} onChange={v => set('website', v)} placeholder="https://jane.dev" />
            <Field label="LinkedIn URL" value={data.linkedin} onChange={v => set('linkedin', v)} placeholder="https://linkedin.com/in/..." />
            <Field label="GitHub URL" value={data.github} onChange={v => set('github', v)} placeholder="https://github.com/..." />
          </div>
          <div style={{ marginTop: 14 }}>
            <Field label="Summary" value={data.summary} onChange={v => set('summary', v)} multiline placeholder="A brief professional summary..." />
          </div>
        </Section>

        {/* Skills */}
        <Section title="Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {data.skills.map((skill, i) => (
              <span key={i} className={`skill-edit-chip ${editingSkillIdx === i ? 'editing' : ''}`}>
                {editingSkillIdx === i ? (
                  <input
                    value={editingSkillValue}
                    onChange={e => setEditingSkillValue(e.target.value)}
                    onBlur={saveSkillEdit}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveSkillEdit()
                      if (e.key === 'Escape') cancelSkillEdit()
                    }}
                    autoFocus
                    style={{
                      width: Math.max(140, Math.min(360, editingSkillValue.length * 8 + 28)),
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text)',
                      font: 'inherit',
                      outline: 'none',
                      padding: 0,
                    }}
                  />
                ) : (
                  <button
                    onClick={() => startSkillEdit(i)}
                    style={{ background: 'none', border: 'none', cursor: 'text', color: 'inherit', font: 'inherit', padding: 0, textAlign: 'left' }}
                    aria-label={`Edit ${skill}`}
                  >
                    {skill}
                  </button>
                )}
                <button
                  onClick={() => removeSkill(i)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', lineHeight: 1, padding: 0, fontSize: 14 }}
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </span>
            ))}
            {data.skills.length === 0 && (
              <span style={{ fontSize: 13, color: 'var(--text-3)', fontStyle: 'italic' }}>No skills yet</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="form-input"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              placeholder="Type a skill and press Enter"
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
            />
            <button className="btn btn-ghost" onClick={addSkill} style={{ flexShrink: 0 }}>Add</button>
          </div>
        </Section>

        {/* Experience */}
        <Section
          title="Experience"
          action={<button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 12 }} onClick={addExp}>+ Add</button>}
        >
          {data.experience.length === 0 && (
            <p style={{ color: 'var(--text-3)', fontSize: 13, fontStyle: 'italic' }}>No experience entries. Click + Add to create one.</p>
          )}
          {data.experience.map((exp, i) => (
            <div key={exp.id} className="editor-entry-card">
              <div className="editor-entry-grid">
                <Field label="Company" value={exp.company} onChange={v => updateExp(i, 'company', v)} placeholder="Acme Corp" />
                <Field label="Role / Title" value={exp.role} onChange={v => updateExp(i, 'role', v)} placeholder="Software Engineer" />
                <Field label="Dates" value={exp.dates} onChange={v => updateExp(i, 'dates', v)} placeholder="Jan 2021 – Present" />
              </div>
              <Field label="Description" value={exp.description} onChange={v => updateExp(i, 'description', v)} multiline placeholder="What did you accomplish?" />
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-danger" onClick={() => removeExp(i)}>Remove</button>
              </div>
            </div>
          ))}
        </Section>

        {/* Education */}
        <Section
          title="Education"
          action={<button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 12 }} onClick={addEdu}>+ Add</button>}
        >
          {data.education.length === 0 && (
            <p style={{ color: 'var(--text-3)', fontSize: 13, fontStyle: 'italic' }}>No education entries. Click + Add to create one.</p>
          )}
          {data.education.map((edu, i) => (
            <div key={edu.id} className="editor-entry-card">
              <div className="editor-entry-grid">
                <Field label="School" value={edu.school} onChange={v => updateEdu(i, 'school', v)} placeholder="MIT" />
                <Field label="Degree" value={edu.degree} onChange={v => updateEdu(i, 'degree', v)} placeholder="B.S. Computer Science" />
                <Field label="Field of Study" value={edu.field} onChange={v => updateEdu(i, 'field', v)} placeholder="Computer Science" />
                <Field label="Dates" value={edu.dates} onChange={v => updateEdu(i, 'dates', v)} placeholder="2015 – 2019" />
              </div>
              <div style={{ marginTop: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-danger" onClick={() => removeEdu(i)}>Remove</button>
              </div>
            </div>
          ))}
        </Section>

        {/* Custom Sections */}
        <Section
          title="Additional Sections"
          action={<button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 12 }} onClick={addCustomSection}>+ Add</button>}
        >
          {data.customSections.length === 0 && (
            <p style={{ color: 'var(--text-3)', fontSize: 13, fontStyle: 'italic' }}>No additional sections. Click + Add for leadership, projects, certifications, activities, or anything else.</p>
          )}
          {data.customSections.map((section, i) => (
            <div key={section.id} className="editor-entry-card">
              <div style={{ marginBottom: 10 }}>
                <Field
                  label="Section Title"
                  value={section.title}
                  onChange={v => updateCustomSection(i, 'title', v)}
                  placeholder="Leadership and Activities"
                />
              </div>
              {(section.entries || []).map((entry, entryIdx) => (
                <div key={entry.id} className="editor-entry-card" style={{ background: 'var(--bg-2)', marginBottom: 10 }}>
                  <div className="editor-entry-grid">
                    <Field label="Name" value={entry.name} onChange={v => updateCustomEntry(i, entryIdx, 'name', v)} placeholder="Finance Club" />
                    <Field label="Title" value={entry.title} onChange={v => updateCustomEntry(i, entryIdx, 'title', v)} placeholder="President" />
                    <Field label="Location" value={entry.location} onChange={v => updateCustomEntry(i, entryIdx, 'location', v)} placeholder="New York, NY" />
                    <Field label="Dates" value={entry.dates} onChange={v => updateCustomEntry(i, entryIdx, 'dates', v)} placeholder="Sep 2024 - Present" />
                  </div>
                  <Field label="Description" value={entry.description} onChange={v => updateCustomEntry(i, entryIdx, 'description', v)} multiline placeholder="What did you do or accomplish?" />
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-danger" onClick={() => removeCustomEntry(i, entryIdx)}>Remove Entry</button>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => addCustomEntry(i)}>+ Add Entry</button>
                <button className="btn btn-danger" onClick={() => removeCustomSection(i)}>Remove</button>
              </div>
            </div>
          ))}
        </Section>

        {error && (
          <div className="msg-error" style={{ marginBottom: 20 }}>
            <span>⚠</span> {error}
          </div>
        )}

        <div className="action-row" style={{ justifyContent: 'flex-end', paddingBottom: 40 }}>
          <button className="btn btn-ghost" onClick={onBack}>← Back</button>
          <button className="btn btn-primary" onClick={handleNext}>Choose Layout →</button>
        </div>
      </div>
    </>
  )
}

function createId() {
  return globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function createCustomEntry(entry = {}) {
  return {
    id: entry.id || createId(),
    name: entry.name || '',
    title: entry.title || '',
    location: entry.location || '',
    dates: entry.dates || '',
    description: entry.description || '',
  }
}

function normalizeCustomSection(section) {
  const legacyContent = section.content?.trim()
  const entries = Array.isArray(section.entries) && section.entries.length > 0
    ? section.entries.map(createCustomEntry)
    : legacyContent
      ? [createCustomEntry({ description: legacyContent })]
      : [createCustomEntry()]

  return {
    id: section.id || createId(),
    title: section.title || '',
    entries,
  }
}

function Section({ title, children, action }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, paddingBottom: 10,
        borderBottom: '1px solid var(--border)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700, fontSize: 15,
          letterSpacing: '-0.01em',
        }}>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, multiline }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {multiline ? (
        <textarea
          className="form-textarea"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          className="form-input"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}
