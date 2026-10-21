import { ref } from 'vue'

const STORAGE_KEY_AUTH = 'gme_admin_auth_token'
const STORAGE_KEY_EXPIRES = 'gme_admin_auth_expires'
const STORAGE_KEY_PHONES = 'gme_admin_phones'
const STORAGE_KEY_PASSWORD = 'gme_admin_password'

// Default hardcoded admin credentials
const DEFAULT_PRIMARY_PHONE = '+998913131154'
const DEFAULT_PASSWORD = 'gme2026admin'

export function cleanPhoneDigits(phone: string): string {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}

export function getAdminPhones(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PHONES)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // fallback
  }
  return [DEFAULT_PRIMARY_PHONE]
}

export function getAdminPassword(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PASSWORD)
    if (saved && saved.trim()) {
      return saved.trim()
    }
  } catch {
    // fallback
  }
  return DEFAULT_PASSWORD
}

// Reactive auth state
export const isAuthenticated = ref<boolean>(checkAuth())

export function checkSecretCredentials(phone: string, nameInput: string): boolean {
  if (!phone || !nameInput) return false

  const inputDigits = cleanPhoneDigits(phone)
  if (!inputDigits) return false

  const validPhones = getAdminPhones().map(cleanPhoneDigits)
  const isPhoneMatch = validPhones.includes(inputDigits)

  const adminPass = getAdminPassword()
  const isPassMatch = nameInput.trim() === adminPass

  return isPhoneMatch && isPassMatch
}

export function login(): void {
  const token = 'gme_adm_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
  const expires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

  try {
    localStorage.setItem(STORAGE_KEY_AUTH, token)
    localStorage.setItem(STORAGE_KEY_EXPIRES, expires.toString())
    sessionStorage.setItem(STORAGE_KEY_AUTH, token)
  } catch {
    // Ignore storage errors
  }

  isAuthenticated.value = true
}

export function checkAuth(): boolean {
  try {
    const token = localStorage.getItem(STORAGE_KEY_AUTH) || sessionStorage.getItem(STORAGE_KEY_AUTH)
    const expiresStr = localStorage.getItem(STORAGE_KEY_EXPIRES)
    if (!token || !expiresStr) {
      return false
    }

    const expires = parseInt(expiresStr, 10)
    if (isNaN(expires) || Date.now() > expires) {
      logout()
      return false
    }

    return true
  } catch {
    return false
  }
}

export function logout(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_AUTH)
    localStorage.removeItem(STORAGE_KEY_EXPIRES)
    sessionStorage.removeItem(STORAGE_KEY_AUTH)
  } catch {
    // Ignore storage errors
  }
  isAuthenticated.value = false
}

export function verifyPassword(passwordInput: string): boolean {
  if (!passwordInput) return false
  return passwordInput.trim() === getAdminPassword()
}

export function updateAdminSettings(primaryPhone: string, newPassword?: string): { success: boolean; message: string } {
  try {
    if (primaryPhone && cleanPhoneDigits(primaryPhone).length >= 9) {
      const phones = [primaryPhone.trim()]
      localStorage.setItem(STORAGE_KEY_PHONES, JSON.stringify(phones))
    }

    if (newPassword && newPassword.trim().length >= 6) {
      localStorage.setItem(STORAGE_KEY_PASSWORD, newPassword.trim())
    }

    return { success: true, message: 'Sozlamalar muvaffaqiyatli saqlandi' }
  } catch (err) {
    return { success: false, message: 'Xatolik yuz berdi: ' + String(err) }
  }
}
