// ─── Shared TypeScript types ───────────────────────────────────────────────

export type Locale = 'uz' | 'ru' | 'en'

export interface ProjectTranslation {
  title: string
  client: string
  industry: string
  services: string[]
  shortDesc: string
  challenge: string
  solution: string
  results: ProjectResult[]
}

export interface Project {
  slug: string
  placeholder: boolean // dev-only flag – false for real projects
  title: string
  client: string
  industry: string
  year: number
  services: string[]
  shortDesc: string
  challenge: string
  solution: string
  results: ProjectResult[]
  techStack: string[]
  coverImage: string | null // path or null → render SVG placeholder
  gallery: string[]
  galleryLayout?: 'portrait' | 'landscape'
  featured: boolean
  botUrl?: string
  githubUrl?: string
  backendGithubUrl?: string
  liveUrl?: string
  translations?: Partial<Record<Locale, Partial<ProjectTranslation>>>
}

export interface ProjectResult {
  label: string
  value: string
}

export interface Partner {
  id: string
  name: string
  logoUrl: string | null // null → show text fallback
  url: string | null
  placeholder: boolean
}

export interface Resident {
  id: string
  name: string // e.g. "IT Park Uzbekistan"
  logoUrl: string | null
  description: string
  year: number
  placeholder: true
}

export interface Stat {
  id: string
  value: number
  suffix: string // "+" | "%" | ""
  suffixKey?: string
  labelKey: string // i18n key
}

export interface Testimonial {
  id: string
  quote: string
  personName: string
  personRole: string
  company: string
  videoUrl: string | null
  placeholder?: boolean
  translations?: Partial<Record<Locale, { quote?: string; personRole?: string }>>
}

export interface TeamMember {
  id: string
  name: string
  role: string
  photoUrl: string | null
  linkedinUrl: string | null
  placeholder?: boolean
}

export interface LeadFormPayload {
  name: string
  phone: string
  telegram?: string // telegram username (@username)
  service: string
  message: string
  consent: boolean
  _hp: string // honeypot
}

export type LeadStatus = 'new' | 'contacted' | 'deal' | 'rejected'

export interface AdminLead {
  id: string
  name: string
  phone: string
  telegram?: string
  service: string
  message?: string
  createdAt: string
  status: LeadStatus
  notes?: string
}

export interface AiChatLog {
  id: string
  sessionId: string
  timestamp: string
  date: string // YYYY-MM-DD
  userMessage: string
  botResponse: string
  category: string
  device: 'Mobile' | 'Desktop' | 'Tablet'
  locale: string
}

