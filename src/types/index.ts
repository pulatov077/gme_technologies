// ─── Shared TypeScript types ───────────────────────────────────────────────

export type Locale = 'uz' | 'ru' | 'en'

export interface Project {
  slug: string
  placeholder: true // dev-only flag – remove when real data is added
  title: string // "Project name — TODO"
  client: string // "Client name — TODO"
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
  featured: boolean
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
  labelKey: string // i18n key
}

export interface Testimonial {
  id: string
  quote: string
  personName: string
  personRole: string
  company: string
  videoUrl: string | null
  placeholder: true
}

export interface TeamMember {
  id: string
  name: string
  role: string
  photoUrl: string | null
  linkedinUrl: string | null
  placeholder: true
}

export interface LeadFormPayload {
  name: string
  phone: string
  service: string
  message: string
  consent: boolean
  _hp: string // honeypot
}
