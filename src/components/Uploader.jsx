import { useState, useRef } from 'react'
import { parsePDF } from '../lib/pdfParser.js'

function resizePhoto(file, maxDim = 400) {
  return new Promise(resolve => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
      URL.revokeObjectURL(url)
    }
    img.onerror = () => { resolve(null); URL.revokeObjectURL(url) }
    img.src = url
  })
}

export default function Uploader({ onDataParsed }) {
  const [pdfFile, setPdfFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoBase64, setPhotoBase64] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const pdfInputRef = useRef()
  const photoInputRef = useRef()

  async function handlePhotoChange(file) {
    if (!file || !file.type.startsWith('image/')) return
    const b64 = await resizePhoto(file)
    setPhotoBase64(b64)
    setPhotoPreview(b64)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave() {
    setDragging(false)
  }

  async function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const files = [...e.dataTransfer.files]
    const droppedPdf = files.find(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
    const droppedPhoto = files.find(f => f.type.startsWith('image/'))

    if (droppedPdf) {
      setPdfFile(droppedPdf)
      setError(null)
    }
    if (droppedPhoto) await handlePhotoChange(droppedPhoto)
  }

  async function handleGenerate() {
    if (!pdfFile) return
    setStatus('loading')
    setError(null)
    try {
      const data = await parsePDF(pdfFile)
      data.photo = photoBase64
      onDataParsed(data)
    } catch (err) {
      setError(err.message || 'Failed to parse PDF. Please try another file.')
      setStatus('idle')
    }
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
          Resume → Portfolio
        </div>
        <h1 className="page-title">
          Turn your resume<br />into a <em>portfolio</em>
        </h1>
        <p className="page-subtitle">
          Upload your PDF and an optional photo. Everything runs in your browser — no uploads, no servers, no accounts.
        </p>
      </div>

      <div className="upload-grid">
        {/* PDF Upload */}
        <div
          className="card"
          style={{
            border: `1.5px dashed ${pdfFile ? 'var(--amber)' : dragging ? 'var(--amber-dim)' : 'var(--border-light)'}`,
            background: dragging ? 'var(--amber-glow)' : pdfFile ? 'rgba(232,168,66,0.06)' : 'var(--surface)',
            cursor: 'pointer',
            transition: 'all 180ms ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '36px 20px',
            textAlign: 'center',
            minHeight: 180,
          }}
          onClick={() => pdfInputRef.current.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div style={{ fontSize: 32, filter: pdfFile ? 'none' : 'grayscale(0.4) opacity(0.5)' }}>
            {pdfFile ? '📄' : '📋'}
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 4,
              color: pdfFile ? 'var(--amber)' : 'var(--text)',
            }}>
              {pdfFile ? pdfFile.name : 'Resume PDF'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
              {pdfFile ? `${(pdfFile.size / 1024).toFixed(0)} KB` : 'Click or drag & drop'}
            </div>
          </div>
          {pdfFile && (
            <button
              className="btn btn-ghost"
              style={{ padding: '5px 12px', fontSize: 11, marginTop: 4 }}
              onClick={e => { e.stopPropagation(); setPdfFile(null); setError(null) }}
            >
              Remove
            </button>
          )}
          <input
            ref={pdfInputRef}
            type="file"
            accept=".pdf,application/pdf"
            style={{ display: 'none' }}
            onChange={e => {
              const f = e.target.files[0]
              if (f) { setPdfFile(f); setError(null) }
              e.target.value = ''
            }}
          />
        </div>

        {/* Photo Upload */}
        <div
          className="card"
          style={{
            border: `1.5px dashed ${photoPreview ? 'var(--border-light)' : 'var(--border)'}`,
            background: 'var(--surface)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '36px 20px',
            textAlign: 'center',
            minHeight: 180,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 180ms ease',
          }}
          onClick={() => photoInputRef.current.click()}
        >
          {photoPreview ? (
            <>
              <img
                src={photoPreview}
                alt="Preview"
                style={{
                  width: 72, height: 72, borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--border-light)',
                }}
              />
              <div style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>
                Photo added
              </div>
              <button
                className="btn btn-ghost"
                style={{ padding: '5px 12px', fontSize: 11 }}
                onClick={e => { e.stopPropagation(); setPhotoPreview(null); setPhotoBase64(null) }}
              >
                Remove
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 32, opacity: 0.4 }}>🖼</div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 4,
                }}>
                  Photo
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  Optional · Click to add
                </div>
              </div>
            </>
          )}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => {
              const f = e.target.files[0]
              if (f) handlePhotoChange(f)
              e.target.value = ''
            }}
          />
        </div>
      </div>

      {error && (
        <div className="msg-error" style={{ maxWidth: 640, width: '100%', marginBottom: 20 }}>
          <span>⚠</span> {error}
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={handleGenerate}
        disabled={!pdfFile || status === 'loading'}
        style={{ fontSize: 15, padding: '14px 36px' }}
      >
        {status === 'loading' ? (
          <><div className="spinner" style={{ width: 16, height: 16 }} /> Parsing resume…</>
        ) : (
          'Parse Resume →'
        )}
      </button>

      <p style={{
        marginTop: 20,
        fontSize: 12,
        color: 'var(--text-3)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.03em',
      }}>
        Your file never leaves your browser
      </p>
    </>
  )
}
