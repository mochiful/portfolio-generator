import { useState } from 'react'
import Uploader from './components/Uploader.jsx'
import DataEditor from './components/DataEditor.jsx'
import LayoutPicker from './components/LayoutPicker.jsx'

const STEPS = [
  { id: 'upload', label: 'Upload' },
  { id: 'edit', label: 'Edit Data' },
  { id: 'layout', label: 'Choose Layout' },
  { id: 'done', label: 'Download' },
]

export default function App() {
  const [step, setStep] = useState('upload')
  const [resumeData, setResumeData] = useState(null)
  const [selectedLayout, setSelectedLayout] = useState(null)

  const stepIndex = STEPS.findIndex(s => s.id === step)

  function handleDataParsed(data) {
    setResumeData(data)
    setStep('edit')
  }

  function handleEditDone(data) {
    setResumeData(data)
    setStep('layout')
  }

  function handleLayoutSelected(layoutId) {
    setSelectedLayout(layoutId)
    setStep('done')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-dot" />
          Luminary
        </div>
        <nav className="steps-nav" aria-label="Progress">
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
              <div className={`step-item ${i === stepIndex ? 'active' : i < stepIndex ? 'done' : ''}`}>
                <div className="step-number">
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                {s.label}
              </div>
              {i < STEPS.length - 1 && <div className="step-sep" />}
            </div>
          ))}
        </nav>
      </header>

      <main className="app-main" key={step}>
        {step === 'upload' && (
          <Uploader onDataParsed={handleDataParsed} />
        )}
        {step === 'edit' && resumeData && (
          <DataEditor
            initialData={resumeData}
            onBack={() => setStep('upload')}
            onNext={handleEditDone}
          />
        )}
        {step === 'layout' && resumeData && (
          <LayoutPicker
            data={resumeData}
            onBack={() => setStep('edit')}
            onSelect={handleLayoutSelected}
          />
        )}
        {step === 'done' && resumeData && selectedLayout && (
          <DoneStep
            data={resumeData}
            layoutId={selectedLayout}
            onBack={() => setStep('layout')}
          />
        )}
      </main>
    </div>
  )
}

function DoneStep({ data, layoutId, onBack }) {
  const [downloaded, setDownloaded] = useState(false)
  const safeName = data.name
    ?.trim()
    .replace(/[^a-z0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
    .toLowerCase()

  async function handleDownload() {
    const { generateAndDownload } = await import('./lib/exportPortfolio.jsx')
    generateAndDownload(data, layoutId)
    setDownloaded(true)
  }

  return (
    <>
      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--amber-glow)', border: '2px solid var(--amber)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px', fontSize: 28,
          boxShadow: '0 0 40px var(--amber-glow-strong)',
        }}>
          {downloaded ? '✓' : '⬇'}
        </div>
        <h1 className="page-title" style={{ fontSize: 36, marginBottom: 12 }}>
          {downloaded ? <>Portfolio <em>ready!</em></> : <>Ready to <em>generate</em></>}
        </h1>
        <p className="page-subtitle" style={{ marginBottom: 36 }}>
          {downloaded
            ? 'Your portfolio has been downloaded. Open the HTML file in any browser — it works offline and needs no server.'
            : `A self-contained HTML file will be created for ${data.name || 'your portfolio'} using the selected template.`}
        </p>
        <div className="action-row" style={{ justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={onBack}>← Change Layout</button>
          <button className="btn btn-primary" onClick={handleDownload}>
            {downloaded ? 'Download Again' : 'Download Portfolio'}
          </button>
        </div>
        {downloaded && (
          <p style={{
            marginTop: 20, fontSize: 12, color: 'var(--text-3)',
            fontFamily: 'var(--font-mono)',
          }}>
            {safeName ? `${safeName}-portfolio.html` : 'portfolio.html'}
          </p>
        )}
      </div>
    </>
  )
}
