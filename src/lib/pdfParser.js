import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

const SECTION_NAMES = [
  'EXPERIENCES',
  'EXPERIENCE',
  'PROFESSIONAL EXPERIENCES',
  'WORK EXPERIENCE',
  'PROFESSIONAL EXPERIENCE',
  'EMPLOYMENT',
  'WORK HISTORY',
  'EDUCATION',
  'ACADEMIC BACKGROUND',
  'SKILLS & INTEREST',
  'SKILLS & INTERESTS',
  'SKILLS AND INTEREST',
  'SKILLS AND INTERESTS',
  'SKILLS',
  'TECHNICAL SKILLS',
  'CORE COMPETENCIES',
  'SUMMARY',
  'PROFESSIONAL SUMMARY',
  'PROFILE',
  'OBJECTIVE',
  'PROJECTS',
  'PROJECT EXPERIENCE',
  'SELECTED PROJECTS',
  'LEADERSHIP & ACTIVITIES',
  'LEADERSHIP AND ACTIVITIES',
  'LEADERSHIP',
  'STUDENT LEADERSHIP',
  'LEADERSHIP/ EXTRACURRICULAR ACTIVITIES',
  'LEADERSHIP / EXTRACURRICULAR ACTIVITIES',
  'EXTRACURRICULAR ACTIVITIES',
  'VOLUNTEER EXPERIENCE',
  'VOLUNTEERING',
  'ACTIVITIES',
  'FINANCE SIMULATION EXPERIENCE',
  'CERTIFICATIONS',
  'LICENSES & CERTIFICATIONS',
  'LICENSES AND CERTIFICATIONS',
  'LANGUAGES',
  'CONTACT',
  'CONTACT INFORMATION',
  'AWARDS',
  'HONORS',
  'HONORS & AWARDS',
  'HONORS AND AWARDS',
  'PUBLICATIONS',
  'RESEARCH',
  'INTERESTS',
]

const KNOWN_SECTION_RE_SOURCE = SECTION_NAMES.map(escapeRegExp).join('|')
const SECTION_RE = new RegExp(`^(${KNOWN_SECTION_RE_SOURCE})\\s*:?$`, 'i')

const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/
const PHONE_RE = /(\+?1?\s?)?(\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4})/
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9\-_%]+)/i
const GITHUB_RE = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9\-_%]+)/i
const URL_RE = /https?:\/\/[^\s,)>]+/
const URL_GLOBAL_RE = /https?:\/\/[^\s,)>]+/g
const MONTH_RE = 'Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?'
const DATE_TOKEN_RE = `(?:${MONTH_RE})\\.?\\s+\\d{4}|\\d{4}`
const DATE_RANGE_RE = new RegExp(`(${DATE_TOKEN_RE})\\s*(?:-|–|—|to)\\s*(${DATE_TOKEN_RE}|Present|Current|Now)`, 'gi')
const EXPECTED_GRAD_RE = new RegExp(`\\b(?:Expected\\s+)?Graduation\\s+(?:Date\\s+)?(?:${MONTH_RE})\\.?\\s+\\d{4}\\b`, 'i')
const MONTH_YEAR_RE = new RegExp(`\\b(?:${MONTH_RE})\\.?\\s+\\d{4}\\b`, 'i')
const YEAR_ONLY_RE = /\b(19|20)\d{2}\b/
const BULLET_RE = /^[?•●▪▸*\-]\s*/
const BULLET_ONLY_RE = /^[?•●▪▸*\-]$/
const CONTACT_SEPARATOR_RE = /\s*[|•▪]\s*/

const STANDARD_SECTION_RE = /^(?:EXPERIENCES?|PROFESSIONAL EXPERIENCES?|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT|WORK HISTORY|EDUCATION|ACADEMIC BACKGROUND|SKILLS? & INTERESTS?|SKILLS? AND INTERESTS?|SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|SUMMARY|PROFESSIONAL SUMMARY|PROFILE|OBJECTIVE|CONTACT|CONTACT INFORMATION)$/i
const WORK_SECTION_RE = /^(?:EXPERIENCES?|PROFESSIONAL EXPERIENCES?|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT|WORK HISTORY)$/i

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function createId() {
  return globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: arrayBuffer }).promise

  const pageTexts = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    pageTexts.push(extractPageText(content.items))
  }

  const fullText = normalizeText(pageTexts.join('\n\n'))

  if (fullText.trim().length < 50) {
    throw new Error('This PDF appears to be a scanned image. Please use a text-based PDF.')
  }

  return extractStructuredData(fullText)
}

export function parseResumeText(text) {
  const fullText = normalizeText(text)

  if (fullText.trim().length < 50) {
    throw new Error('This resume text is too short to parse.')
  }

  return extractStructuredData(fullText)
}

function extractPageText(items) {
  const textItems = items
    .filter(item => 'str' in item && item.str.trim())
    .map(item => ({
      text: item.str.trim(),
      x: item.transform?.[4] ?? 0,
      y: Math.round(item.transform?.[5] ?? 0),
      width: item.width ?? 0,
    }))
    .sort((a, b) => (b.y - a.y) || (a.x - b.x))

  const lines = []

  for (const item of textItems) {
    const line = lines.find(l => Math.abs(l.y - item.y) <= 3)
    if (line) {
      line.items.push(item)
      line.y = (line.y + item.y) / 2
    } else {
      lines.push({ y: item.y, items: [item] })
    }
  }

  return lines
    .sort((a, b) => b.y - a.y)
    .map(line => line.items
      .sort((a, b) => a.x - b.x)
      .reduce((acc, item) => {
        if (!acc.length) return [{ ...item, out: item.text }]
        const prev = acc[acc.length - 1]
        const gap = item.x - (prev.x + prev.width)
        prev.out += gap > 3 ? ` ${item.text}` : item.text
        prev.x = item.x
        prev.width = item.width
        return acc
      }, [])
      .map(item => item.out)
      .join('')
      .replace(/\s+/g, ' ')
      .trim())
    .filter(Boolean)
    .join('\n')
}

function normalizeText(text) {
  return text
    .replace(/\r/g, '\n')
    .replace(/[–—]/g, ' - ')
    .replace(/[‑‐]/g, '-')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractStructuredData(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  const email = (text.match(EMAIL_RE) || [])[0] || ''
  const phone = (() => {
    const m = text.match(PHONE_RE)
    return m ? m[0].trim() : ''
  })()

  const linkedinMatch = text.match(LINKEDIN_RE)
  const linkedin = linkedinMatch
    ? `https://linkedin.com/in/${linkedinMatch[1]}`
    : ''

  const githubMatch = text.match(GITHUB_RE)
  const github = githubMatch ? `https://github.com/${githubMatch[1]}` : ''

  const allUrls = [...(text.matchAll(URL_GLOBAL_RE) || [])].map(m => m[0])
  const website = allUrls.find(u => !u.includes('linkedin') && !u.includes('github')) || ''

  const { name, title } = extractNameAndTitle(lines, email, phone)

  const location = extractLocation(lines, email, phone, name, title)

  const sections = splitIntoSections(text)

  const summary = extractSummary(sections)
  const skills = extractSkills(sections)
  const experience = extractExperience(sections)
  const education = extractEducation(sections)
  const customSections = extractCustomSections(sections)

  return {
    name,
    title,
    email,
    phone,
    location,
    linkedin,
    github,
    website,
    summary,
    skills,
    experience,
    education,
    customSections,
    photo: null,
  }
}

function extractNameAndTitle(lines, email, phone) {
  const contactTokens = new Set([email, phone].filter(Boolean).map(s => s.toLowerCase()))

  const isContactLine = line => {
    const l = line.toLowerCase()
    return (
      contactTokens.has(l) ||
      EMAIL_RE.test(line) ||
      PHONE_RE.test(line) ||
      LINKEDIN_RE.test(line) ||
      GITHUB_RE.test(line) ||
      URL_RE.test(line) ||
      SECTION_RE.test(line)
    )
  }

  const nameCandidate = lines.find(line => {
    if (isContactLine(line)) return false
    if (line.length < 3 || line.length > 60) return false
    const words = line.split(/\s+/)
    if (words.length < 2 || words.length > 6) return false
    return /^[A-Za-z\s'\-\.]+$/.test(line)
  }) || ''

  const nameIdx = lines.indexOf(nameCandidate)
  let titleCandidate = ''
  for (const line of lines.slice(nameIdx + 1, nameIdx + 6)) {
    if (SECTION_RE.test(line)) break
    if (isContactLine(line)) continue
    if (line.length < 4 || line.length > 80) continue
    titleCandidate = line
    break
  }

  return { name: nameCandidate, title: titleCandidate }
}

function extractLocation(lines, email, phone, name, title) {
  const LOCATION_RE = /,\s*(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)\b/
  // City, Country pattern (e.g. "London, UK" or "Toronto, Canada")
  const CITY_COUNTRY_RE = /^[A-Z][a-zA-Z\s\-\.]+,\s+[A-Z][a-zA-Z\s]{1,25}$/
  const CITY_STATE_ZIP_RE = /^[A-Z][a-zA-Z\s.\-']+,\s*(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)(?:,\s*\d{5}(?:-\d{4})?)?$/

  const isContactInfo = line =>
    EMAIL_RE.test(line) ||
    PHONE_RE.test(line) ||
    LINKEDIN_RE.test(line) ||
    GITHUB_RE.test(line) ||
    URL_RE.test(line)

  for (const line of lines) {
    if (isContactInfo(line)) {
      const contactLocation = line
        .split(CONTACT_SEPARATOR_RE)
        .map(part => part.trim())
        .find(part => isLocationCandidate(part))
      if (contactLocation) return cleanLocation(contactLocation)
    }
  }

  return lines.find(line => {
    if (isContactInfo(line)) return false
    if (line === name || line === title) return false
    if (SECTION_RE.test(line)) return false
    return isLocationCandidate(line)
  }) || ''

  function isLocationCandidate(part) {
    if (!part || isContactInfo(part)) return false
    return LOCATION_RE.test(part) || CITY_COUNTRY_RE.test(part) || CITY_STATE_ZIP_RE.test(part)
  }

  function cleanLocation(part) {
    const match = part.match(/^(.+?,\s*[A-Z]{2})(?:,\s*\d{5}(?:-\d{4})?)?$/)
    return (match ? match[1] : part).trim()
  }
}

function splitIntoSections(text) {
  const sections = {}
  const matches = findSectionHeaders(text)

  if (matches.length === 0) return { _full: text }

  matches.forEach((match, i) => {
    const header = match.header.toUpperCase()
    const start = match.end
    const end = matches[i + 1] ? matches[i + 1].index : text.length
    const content = text.slice(start, end).trim()
    sections[header] = sections[header] ? `${sections[header]}\n${content}`.trim() : content
  })

  return sections
}

function findSectionHeaders(text) {
  const matches = []
  let offset = 0

  for (const rawLine of text.split('\n')) {
    const lineStart = offset
    const lineEnd = offset + rawLine.length
    const header = getSectionHeader(rawLine, matches.length)
    if (header) {
      matches.push({
        header,
        index: lineStart,
        end: lineEnd,
      })
    }
    offset = lineEnd + 1
  }

  return matches
}

function getSectionHeader(rawLine, headerCount) {
  const line = rawLine.trim().replace(/:$/, '').trim()
  if (!line) return null
  if (SECTION_RE.test(line)) return line
  if (!looksLikeInferredSectionHeader(line)) return null
  if (headerCount === 0 && line.split(/\s+/).length <= 3) return null
  return line
}

function looksLikeInferredSectionHeader(line) {
  if (line.length < 4 || line.length > 60) return false
  if (BULLET_RE.test(line)) return false
  if (EMAIL_RE.test(line) || PHONE_RE.test(line) || URL_RE.test(line)) return false
  if (hasDateRange(line) || YEAR_ONLY_RE.test(line)) return false
  if (!/^[A-Za-z][A-Za-z0-9\s/&,+-]+$/.test(line)) return false
  if (/[.!?]$/.test(line)) return false

  const letters = line.replace(/[^A-Za-z]/g, '')
  if (letters.length < 3) return false
  const words = line.split(/\s+/).filter(Boolean)
  if (words.length > 7) return false

  return letters === letters.toUpperCase()
}

function extractSummary(sections) {
  const key = Object.keys(sections).find(k =>
    /SUMMARY|PROFILE|OBJECTIVE/.test(k)
  )
  if (!key) return ''
  return sections[key]
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .join(' ')
    .slice(0, 800)
}

function extractSkills(sections) {
  const key = Object.keys(sections).find(k => /SKILL|COMPETENC|TECHNICAL/.test(k))
  if (!key) return []
  const lines = normalizeResumeLines(sections[key])
  const items = lines.some(line => line.isBullet)
    ? extractBulletSkillItems(lines)
    : splitSkillText(lines.map(line => line.text).join('\n'))

  return items
    .map(s => s.trim().replace(/^[-–—·\s]+/, '').trim())
    .filter(s => s.length > 1 && s.length < 240 && !hasDateRange(s) && !/^(?:Interests?|Hobbies)\s*:/i.test(s))
    .filter((s, i, arr) => arr.findIndex(v => v.toLowerCase() === s.toLowerCase()) === i)
}

function extractBulletSkillItems(lines) {
  const bulletItems = []
  const looseLines = []
  let current = ''

  for (const line of lines) {
    const text = line.text.trim()
    if (!text) continue

    if (line.isBullet) {
      if (current) bulletItems.push(current)
      current = text
    } else if (current) {
      current = `${current} ${text}`.trim()
    } else {
      looseLines.push(text)
    }
  }

  if (current) bulletItems.push(current)

  const output = []
  for (const item of bulletItems) {
    const categoryMatch = item.match(/^(Technical Skills?|Language|Languages|Tools|Skills?)\s*:\s*(.+)$/i)
    if (categoryMatch) output.push(...splitSkillText(categoryMatch[2]))
    else output.push(item)
  }

  if (looseLines.length > 0) output.push(...splitSkillText(looseLines.join('\n')))
  return output
}

function splitSkillText(text) {
  const parts = []
  let current = ''
  let parenDepth = 0

  for (const char of text) {
    if (char === '(') parenDepth++
    if (char === ')') parenDepth = Math.max(0, parenDepth - 1)

    if (parenDepth === 0 && /[,;•▪▸|\n/]/.test(char)) {
      if (current.trim()) parts.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  if (current.trim()) parts.push(current.trim())
  return parts
}

function hasDateRange(text) {
  DATE_RANGE_RE.lastIndex = 0
  return DATE_RANGE_RE.test(text)
}

function extractExperience(sections) {
  const keys = Object.keys(sections).filter(k =>
    WORK_SECTION_RE.test(k)
  )
  return keys.flatMap(key => parseExperienceOrEducation(sections[key], 'experience'))
}

function extractEducation(sections) {
  const key = Object.keys(sections).find(k => /EDUCATION|ACADEMIC/.test(k))
  if (!key) return []

  const text = sections[key]
  return parseExperienceOrEducation(text, 'education')
}

function extractCustomSections(sections) {
  return Object.keys(sections)
    .filter(key => key !== '_full')
    .filter(key => !STANDARD_SECTION_RE.test(key))
    .map(key => ({
      id: createId(),
      title: formatSectionTitle(key),
      entries: parseCustomSectionEntries(sections[key]),
    }))
    .filter(section => section.title && section.entries.length > 0)
}

function formatSectionTitle(key) {
  return key
    .toLowerCase()
    .replace(/\b[a-z]/g, char => char.toUpperCase())
    .replace(/\bAnd\b/g, 'and')
    .replace(/\bOf\b/g, 'of')
}

function parseCustomSectionEntries(text) {
  const lines = normalizeResumeLines(text)
  if (lines.length === 0) return []

  const datelines = []
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].isBullet) continue
    const line = lines[i].text

    DATE_RANGE_RE.lastIndex = 0
    const range = line.match(DATE_RANGE_RE)
    if (range) {
      datelines.push({ lineIdx: i, dateStr: range[0] })
      continue
    }

    const monthYear = line.match(MONTH_YEAR_RE)
    if (monthYear) {
      datelines.push({ lineIdx: i, dateStr: monthYear[0] })
      continue
    }

    const year = line.match(YEAR_ONLY_RE)
    if (year && !datelines.some(d => Math.abs(d.lineIdx - i) < 3)) {
      datelines.push({ lineIdx: i, dateStr: year[0] })
    }
  }

  if (datelines.length === 0) {
    let headerEnd = 0
    while (
      headerEnd < lines.length &&
      headerEnd < 4 &&
      !lines[headerEnd].isBullet &&
      (looksLikeHeaderLine(lines[headerEnd]) || looksLikeLocation(lines[headerEnd].text))
    ) {
      headerEnd++
    }

    const headerCandidates = lines.slice(0, Math.max(1, headerEnd)).map(line => line.text)
    const descLines = lines.slice(Math.max(1, headerEnd))
    return [buildCustomSectionEntry(headerCandidates, descLines, '')].filter(entryHasContent)
  }

  const entries = []
  for (let di = 0; di < datelines.length; di++) {
    const { lineIdx, dateStr } = datelines[di]
    const prevBound = di > 0 ? datelines[di - 1].lineIdx + 1 : 0
    const nextDateIdx = di + 1 < datelines.length ? datelines[di + 1].lineIdx : lines.length
    const dateLineRemainder = getDateLineRemainder(lines[lineIdx].text)
    const headerCandidates = []
    const headerStart = findCustomHeaderStart(lines, lineIdx, prevBound, dateLineRemainder)

    for (let i = headerStart; i < lineIdx; i++) {
      headerCandidates.push(lines[i].text)
    }
    if (dateLineRemainder) headerCandidates.push(dateLineRemainder)

    let descStart = lineIdx + 1
    while (headerCandidates.length < 3 && descStart < nextDateIdx && !lines[descStart].isBullet && looksLikeHeaderLine(lines[descStart])) {
      headerCandidates.push(lines[descStart].text)
      descStart++
    }

    const descEnd = di + 1 < datelines.length
      ? findCustomHeaderStart(lines, nextDateIdx, lineIdx + 1, getDateLineRemainder(lines[nextDateIdx].text))
      : nextDateIdx

    entries.push(buildCustomSectionEntry(headerCandidates, lines.slice(descStart, descEnd), dateStr))
  }

  return entries.filter(entryHasContent)
}

function buildCustomSectionEntry(headerCandidates, descLines, dateStr) {
  const rawParts = headerCandidates
    .flatMap(splitCustomHeaderParts)
    .filter(Boolean)
  const parts = []
  let location = ''

  for (const rawPart of rawParts) {
    const locationSplit = splitTrailingLocation(rawPart)
    if (locationSplit) {
      if (locationSplit.name) parts.push(locationSplit.name)
      if (!location) location = locationSplit.location
      continue
    }

    parts.push(rawPart)
  }

  let cleanedParts = parts.map(cleanHeaderLine).filter(Boolean)
  if (!location) {
    cleanedParts = cleanedParts.flatMap(part => {
      const locationSplit = splitTrailingLocation(part)
      if (!locationSplit) return [part]
      if (!location) location = locationSplit.location
      return locationSplit.name ? [locationSplit.name] : []
    })
  }
  if (cleanedParts.length === 1) {
    const roleSplit = splitTrailingRole(cleanedParts[0])
    if (roleSplit) cleanedParts = [roleSplit.name, roleSplit.title]
  }
  if (cleanedParts.length >= 2 && looksLikeRoleTitle(cleanedParts[0]) && !looksLikeRoleTitle(cleanedParts[1])) {
    cleanedParts = [cleanedParts[1], cleanedParts[0], ...cleanedParts.slice(2)]
  }

  return {
    id: createId(),
    name: (cleanedParts[0] || '').slice(0, 150),
    title: (cleanedParts[1] || '').slice(0, 150),
    location: location.slice(0, 100),
    dates: dateStr,
    description: buildDescription(descLines).slice(0, 1200),
  }
}

function findCustomHeaderStart(lines, dateLineIdx, lowerBound, dateLineRemainder) {
  let start = dateLineIdx
  const maxHeaderLines = dateLineRemainder ? 2 : 4
  let count = 0

  for (let i = dateLineIdx - 1; i >= lowerBound && count < maxHeaderLines; i--) {
    if (lines[i].isBullet) break
    if (!looksLikeHeaderLine(lines[i]) && !looksLikeLocation(lines[i].text)) break
    start = i
    count++
  }

  return start
}

function splitCustomHeaderParts(line) {
  return line
    .split(/\s{2,}|\s+[|]\s+|\s+[-–—?]\s+/)
    .map(part => part.trim().replace(/\s*,\s*$/g, ''))
    .filter(Boolean)
}

function entryHasContent(entry) {
  return entry.name || entry.title || entry.location || entry.dates || entry.description
}

function looksLikeLocation(text) {
  const split = splitTrailingLocation(text)
  return Boolean(split && !split.name)
}

function splitTrailingLocation(text) {
  const trimmed = text.trim().replace(/\s*,\s*$/, '')
  const stateMatch = trimmed.match(/,?\s+(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC|AB|BC|MB|NB|NL|NS|NT|NU|ON|PE|QC|SK|YT)\b(?:,\s*\d{5}(?:-\d{4})?)?$/)
  if (!stateMatch) return null

  const beforeComma = trimmed.slice(0, stateMatch.index).trim()
  if (!beforeComma) return null

  const words = beforeComma.split(/\s+/)
  const commonMultiWordCities = new Set([
    'New York',
    'Los Angeles',
    'San Francisco',
    'Salt Lake',
    'San Diego',
    'San Jose',
    'Las Vegas',
    'Jersey City',
    'Staten Island',
    'Markham',
    'Waterloo',
    'Charlotte',
  ])

  for (let wordCount = Math.min(3, words.length); wordCount >= 1; wordCount--) {
    const city = words.slice(-wordCount).join(' ')
    const canUseCity = commonMultiWordCities.has(city) || wordCount === 1 || wordCount === words.length
    if (!canUseCity) continue

    const name = words.slice(0, -wordCount).join(' ').trim()
    return {
      name,
      location: `${city}, ${stateMatch[1]}`.trim(),
    }
  }

  return null
}

function splitTrailingRole(text) {
  const roleMatch = text.match(/\b(Assistant Vice President(?:\s+of\s+[A-Za-z &]+)?|Vice President(?:\s+of\s+[A-Za-z &]+)?|Business Analyst|Internal Audit Intern|Summer Intern|Food Drive Promoter|Carnival Operator|President|Secretary|Treasurer|Analyst|Intern|Mentee|Fellow|Member|Coordinator|Specialist|Director|Manager|Lead|Chair|Captain|Volunteer|Promoter|Operator)$/i)
  if (!roleMatch || roleMatch.index === 0) return null

  const name = text.slice(0, roleMatch.index).trim().replace(/[,|?|-]+$/g, '').trim()
  const title = roleMatch[1].trim()
  return name && title ? { name, title } : null
}

function looksLikeRoleTitle(text) {
  return ROLE_RE.test(text) || Boolean(splitTrailingRole(text))
}

function parseExperienceOrEducation(text, type) {
  const lines = normalizeResumeLines(text)

  // Pass 1: locate every line that carries a date, collect {lineIdx, dateStr}
  const datelines = []
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].isBullet) continue
    const line = lines[i].text
    const grad = type === 'education' ? line.match(EXPECTED_GRAD_RE) : null
    if (grad) { datelines.push({ lineIdx: i, dateStr: grad[0] }); continue }

    DATE_RANGE_RE.lastIndex = 0
    const m = line.match(DATE_RANGE_RE)
    if (m) { datelines.push({ lineIdx: i, dateStr: m[0] }); continue }

    const educationDate = type === 'education' ? line.match(MONTH_YEAR_RE) : null
    if (educationDate && looksLikeEducationDateLine(lines, i)) {
      datelines.push({ lineIdx: i, dateStr: educationDate[0] })
      continue
    }

    // fall back to bare year only if no range found yet for this entry
    const y = line.match(YEAR_ONLY_RE)
    const canUseBareYear = type === 'education'
      ? /graduat|degree|bachelor|master|phd|diploma|certificate/i.test(line)
      : ROLE_RE.test(line)

    if (y && canUseBareYear && !datelines.some(d => Math.abs(d.lineIdx - i) < 3)) {
      datelines.push({ lineIdx: i, dateStr: y[0] })
    }
  }

  if (datelines.length === 0) return []

  const entries = []

  for (let di = 0; di < datelines.length; di++) {
    const { lineIdx, dateStr } = datelines[di]
    // Lower bound: one line past the previous date (avoids stealing desc lines)
    const prevBound = di > 0 ? datelines[di - 1].lineIdx + 1 : 0
    // Upper bound for description: start of next date line
    const nextDateIdx = di + 1 < datelines.length ? datelines[di + 1].lineIdx : lines.length

    // Strip the date string from its own line; keep any remaining text as a header candidate
    const dateLineRemainder = getDateLineRemainder(lines[lineIdx].text)

    // Header candidates are the compact company/school lines immediately above the date.
    const headerCandidates = []
    const headerStart = findHeaderStart(lines, lineIdx, prevBound, dateLineRemainder)
    for (let i = headerStart; i < lineIdx; i++) {
      headerCandidates.push(lines[i].text)
    }
    if (dateLineRemainder) headerCandidates.push(dateLineRemainder)

    let descStart = lineIdx + 1
    while (headerCandidates.length < 2 && descStart < nextDateIdx && !lines[descStart].isBullet && looksLikeHeaderLine(lines[descStart])) {
      headerCandidates.push(lines[descStart].text)
      descStart++
    }

    const descEnd = di + 1 < datelines.length
      ? findHeaderStart(
        lines,
        nextDateIdx,
        lineIdx + 1,
        getDateLineRemainder(lines[nextDateIdx].text),
      )
      : nextDateIdx

    // Description: lines after the date line and inferred headers up to the next date
    const descLines = []
    for (let i = descStart; i < descEnd; i++) {
      if (SECTION_RE.test(lines[i].text)) break
      descLines.push(lines[i])
    }

    if (type === 'experience') {
      entries.push(buildExperienceEntry(headerCandidates, descLines, dateStr))
    } else {
      entries.push(buildEducationEntry(headerCandidates, descLines, dateStr))
    }
  }

  return entries.filter(e =>
    type === 'experience' ? (e.company || e.role) : (e.school || e.degree)
  )
}

const ROLE_RE = /engineer|developer|manager|director|designer|analyst|scientist|lead|architect|consultant|intern|coordinator|specialist|officer|executive|president|secretary|mentee|fellow|promoter|operator|\bvp\b|cto|ceo|cfo|founder|researcher|writer|editor|associate/i
const DEGREE_RE = /bachelor|master|doctor|\bphd\b|\bb\.?\s?s\.?\b|\bm\.?\s?s\.?\b|\bb\.?\s?a\.?\b|\bm\.?\s?a\.?\b|\bm\.?\s?b\.?\s?a\.?\b|associate|diploma|certificate|\bb\.?\s?eng\.?\b|\bm\.?\s?eng\.?\b|\bllb\b|\bjd\b/i

function normalizeResumeLines(text) {
  const output = []
  let pendingBullet = false

  for (const rawLine of text.split('\n')) {
    const raw = rawLine.trim()
    if (!raw) continue

    if (BULLET_ONLY_RE.test(raw)) {
      pendingBullet = true
      continue
    }

    const startsWithBullet = BULLET_RE.test(raw)
    const cleaned = raw.replace(BULLET_RE, '').trim()
    if (!cleaned) continue

    output.push({
      text: cleaned,
      isBullet: pendingBullet || startsWithBullet,
    })
    pendingBullet = false
  }

  return output
}

function getDateLineRemainder(line) {
  DATE_RANGE_RE.lastIndex = 0
  return line
    .replace(EXPECTED_GRAD_RE, '')
    .replace(DATE_RANGE_RE, '')
    .replace(MONTH_YEAR_RE, '')
    .replace(YEAR_ONLY_RE, '')
    .replace(/\bExpected\b/i, '')
    .replace(/[|•·\/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^\s*[-–—]\s*|\s*[-–—]\s*$/g, '')
    .trim()
}

function looksLikeEducationDateLine(lines, idx) {
  const window = lines
    .slice(Math.max(0, idx - 1), Math.min(lines.length, idx + 3))
    .map(line => line.text)
    .join(' ')

  return DEGREE_RE.test(window) || /college|university|school|academy|institute|cuny/i.test(window)
}

function findHeaderStart(lines, dateLineIdx, lowerBound, dateLineRemainder) {
  let start = dateLineIdx
  const maxHeaderLines = dateLineRemainder ? 1 : 2
  let count = 0

  for (let i = dateLineIdx - 1; i >= lowerBound && count < maxHeaderLines; i--) {
    if (lines[i].isBullet) break
    if (!looksLikeHeaderLine(lines[i])) break
    start = i
    count++
  }

  return start
}

function looksLikeHeaderLine(line) {
  if (typeof line !== 'string') line = line.text
  if (!line || line.length > 140) return false
  if (!/^[A-Z0-9]/.test(line)) return false
  if (SECTION_RE.test(line)) return false
  if (EMAIL_RE.test(line) || PHONE_RE.test(line) || URL_RE.test(line)) return false
  return !/[.!?]$/.test(line) || ROLE_RE.test(line) || DEGREE_RE.test(line)
}

function splitHeaderParts(line) {
  return cleanHeaderLine(line)
    .split(/\s{2,}|\s+[|]\s+|\s+[-–—?]\s+/)
    .map(part => part.trim())
    .filter(Boolean)
}

function cleanHeaderLine(line) {
  return stripLocationSuffix(line)
    .replace(/\s*,?\s*GPA\s*:?\s*\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)?/i, '')
    .replace(/\s*,?\s*Minors?\s*:.*$/i, '')
    .replace(/\s*\|\s*$/g, '')
    .replace(/\s*[-–—?]\s*$/g, '')
    .replace(/\s*,\s*$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function stripLocationSuffix(line) {
  line = line.trim().replace(/\s*,\s*$/, '')
  const stateMatch = line.match(/,\s*(?:[A-Z]{2}|[A-Z][A-Za-z .'-]+)$/)
  if (!stateMatch) return line.trim()

  const beforeComma = line.slice(0, stateMatch.index).trim()
  const suffix = line.slice(stateMatch.index).trim()
  if (!/,\s*(?:[A-Z]{2}|[A-Z][A-Za-z .'-]+)$/.test(suffix)) return line.trim()

  const words = beforeComma.split(/\s+/)
  const cityTwoWord = words.slice(-2).join(' ')
  const commonTwoWordCities = new Set([
    'New York',
    'Los Angeles',
    'San Francisco',
    'Salt Lake',
    'San Diego',
    'San Jose',
    'Las Vegas',
    'Jersey City',
  ])

  if (commonTwoWordCities.has(cityTwoWord)) {
    return words.slice(0, -2).join(' ').replace(/\s*,\s*$/, '').trim()
  }

  return words.slice(0, -1).join(' ').replace(/\s*,\s*$/, '').trim()
}

function buildDescription(descLines) {
  const bullets = []
  const paragraphs = []

  for (const line of descLines) {
    if (line.isBullet) {
      bullets.push(line.text)
    } else if (bullets.length > 0) {
      bullets[bullets.length - 1] = `${bullets[bullets.length - 1]} ${line.text}`.trim()
    } else {
      paragraphs.push(line.text)
    }
  }

  if (bullets.length > 0) {
    return bullets.map(bullet => `• ${bullet}`).join('\n')
  }

  return paragraphs.join(' ').trim()
}

function buildExperienceEntry(headerCandidates, descLines, dateStr) {
  let company = '', role = ''
  const candidates = headerCandidates.flatMap(splitHeaderParts)

  if (candidates.length === 0) {
    // nothing — leave blank
  } else if (candidates.length === 1) {
    const line = candidates[0]
    if (ROLE_RE.test(line)) role = line
    else company = line
  } else {
    // Find the line most likely to be the role title (closest to the date, has role keywords)
    const roleIdx = candidates.slice().reverse().findIndex(l => ROLE_RE.test(l))
    const roleRealIdx = roleIdx === -1 ? -1 : candidates.length - 1 - roleIdx

    if (roleRealIdx !== -1) {
      role = candidates[roleRealIdx]
      // Company is whichever prominent line is NOT the role
      company = candidates.find((_, i) => i !== roleRealIdx) || ''
    } else {
      // No role keywords: assume first line = company, last line = role
      company = candidates[0]
      role = candidates[candidates.length - 1]
    }
  }

  return {
    id: createId(),
    company: company.slice(0, 120),
    role: role.slice(0, 120),
    dates: dateStr,
    description: buildDescription(descLines).slice(0, 1200),
  }
}

function buildEducationEntry(headerCandidates, descLines, dateStr) {
  let school = '', degree = '', field = ''
  const candidates = headerCandidates.flatMap(splitHeaderParts)

  if (candidates.length === 1) {
    const combined = splitCombinedEducationLine(candidates[0])
    if (combined) {
      school = combined.school
      degree = combined.degree
      field = combined.field
    }
  }

  // Prefer the line closest to the date that matches degree keywords
  if (!school && !degree) {
    const degreeIdx = candidates.slice().reverse().findIndex(l => DEGREE_RE.test(l))
    const degreeRealIdx = degreeIdx === -1 ? -1 : candidates.length - 1 - degreeIdx

    if (degreeRealIdx !== -1) {
      degree = candidates[degreeRealIdx]
      school = candidates.find((_, i) => i !== degreeRealIdx) || ''
      field = candidates[degreeRealIdx + 1] && !DEGREE_RE.test(candidates[degreeRealIdx + 1])
        ? candidates[degreeRealIdx + 1]
        : ''
    } else {
      // No degree keyword: first candidate is the school, second is the degree (or a field)
      school = candidates[0] || ''
      degree = candidates[1] || ''
    }
  }

  // Extract field of study from phrases like "Bachelor of Business Administration in Accounting".
  const fieldMatch = degree.match(/\s+in\s+([A-Za-z][A-Za-z\s&]+?)(?:\s*[,;·|]|$)/i)
  if (fieldMatch) {
    field = fieldMatch[1].trim()
    degree = degree.slice(0, fieldMatch.index).trim()
  }

  const pipeParts = degree.split('|').map(part => part.trim()).filter(Boolean)
  if (pipeParts.length > 1) {
    degree = pipeParts[0]
    field = pipeParts[1]
  }

  ;({ degree, field } = normalizeDegreeAndField(degree, field))

  return {
    id: createId(),
    school: school.slice(0, 150),
    degree: degree.slice(0, 100),
    field: field.slice(0, 80),
    dates: dateStr,
  }
}

function splitCombinedEducationLine(line) {
  const degreeMatch = line.match(DEGREE_RE)
  if (!degreeMatch) return null

  const beforeDegree = line.slice(0, degreeMatch.index).trim()
  if (!/college|university|school|academy|institute|cuny/i.test(beforeDegree)) return null

  const afterDegree = line.slice(degreeMatch.index).trim()
  const school = cleanHeaderLine(beforeDegree)
  let degree = cleanHeaderLine(afterDegree)
    .replace(/\bExpected\b.*$/i, '')
    .replace(/\bRelevant (?:Classes|Coursework)\b.*$/i, '')
    .trim()
  let field = ''

  const fieldMatch = degree.match(/\s+in\s+([A-Za-z][A-Za-z\s&]+?)(?:\s*[,;·|]|$)/i)
  if (fieldMatch) {
    field = fieldMatch[1].trim()
    degree = degree.slice(0, fieldMatch.index).trim()
  }

  const pipeParts = degree.split('|').map(part => part.trim()).filter(Boolean)
  if (pipeParts.length > 1) {
    degree = pipeParts[0]
    field = pipeParts[1]
  }

  ;({ degree, field } = normalizeDegreeAndField(degree, field))

  return school || degree ? { school, degree, field } : null
}

function normalizeDegreeAndField(degree, field = '') {
  degree = cleanHeaderLine(degree || '')
  field = cleanHeaderLine(field || '')

  const dashParts = degree.split(/\s+[-–—]\s+/).map(part => part.trim()).filter(Boolean)
  if (dashParts.length > 1) {
    degree = dashParts[0]
    field = field || dashParts.slice(1).join(' - ')
  }

  const degreeMatch = degree.match(/\b((?:Bachelor|Master|Associate|Doctor|Doctorate) of [A-Za-z ]+?)(?:\s+(?:in|of)\s+(.+))?$/i)
  if (degreeMatch) {
    degree = degreeMatch[1].trim()
    if (!field && degreeMatch[2]) field = degreeMatch[2].trim()
  }

  return { degree, field }
}
