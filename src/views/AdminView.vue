<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  isAuthenticated,
  checkAuth,
  logout as authLogout,
  verifyPassword,
  getAdminPhones,
  updateAdminSettings,
} from '@/services/adminAuth'
import {
  getLogsForLastDays,
  getWeeklyStats,
  exportLogsAsJson,
  clearAllLogs,
  type AiWeeklyStats,
} from '@/services/aiLogService'
import {
  getAllLeads,
  updateLeadStatus,
  deleteLead,
  getLeadsStats,
  exportLeadsAsJson,
} from '@/services/leadService'
import type { AdminLead, AiChatLog, LeadStatus } from '@/types'

const router = useRouter()

// Guard on mount
onMounted(() => {
  if (!checkAuth()) {
    router.replace('/')
  }
})

// Current Tab
type TabType = 'overview' | 'leads' | 'ai-logs' | 'settings'
const currentTab = ref<TabType>('overview')

// Real-time Clock
const currentTime = ref('')
function updateClock() {
  currentTime.value = new Date().toLocaleTimeString('uz-UZ', { timeZone: 'Asia/Tashkent' })
}
updateClock()
setInterval(updateClock, 1000)

// Data state
const leads = ref<AdminLead[]>(getAllLeads())
const leadsStats = computed(() => getLeadsStats())

const weeklyDays = ref<number>(7)
const aiLogs = ref<AiChatLog[]>(getLogsForLastDays(weeklyDays.value))
const weeklyStats = ref<AiWeeklyStats>(getWeeklyStats(weeklyDays.value))

function refreshData() {
  leads.value = getAllLeads()
  aiLogs.value = getLogsForLastDays(weeklyDays.value)
  weeklyStats.value = getWeeklyStats(weeklyDays.value)
}

// ─── LEADS TAB STATE ──────────────────────────────────────────────────────────
const leadSearch = ref('')
const leadFilterStatus = ref<string>('all')

const filteredLeads = computed(() => {
  return leads.value.filter((lead) => {
    // Status filter
    if (leadFilterStatus.value !== 'all' && lead.status !== leadFilterStatus.value) {
      return false
    }
    // Search query
    if (leadSearch.value.trim()) {
      const q = leadSearch.value.toLowerCase().trim()
      const matchName = lead.name.toLowerCase().includes(q)
      const matchPhone = lead.phone.includes(q)
      const matchService = lead.service.toLowerCase().includes(q)
      const matchMsg = (lead.message || '').toLowerCase().includes(q)
      if (!matchName && !matchPhone && !matchService && !matchMsg) {
        return false
      }
    }
    return true
  })
})

function handleStatusChange(id: string, newStatus: LeadStatus) {
  updateLeadStatus(id, newStatus)
  refreshData()
}

function handleNotesBlur(id: string, notes: string) {
  updateLeadStatus(id, leads.value.find((l) => l.id === id)?.status || 'new', notes)
  refreshData()
}

function handleDeleteLead(id: string) {
  if (confirm('Ushbu arizani o‘chirishni xohlaysizmi?')) {
    deleteLead(id)
    refreshData()
  }
}

// ─── AI LOGS TAB (PASSWORD PROTECTED) ─────────────────────────────────────────
// User Requirement: "u tugma bosilganda xam parol surasin usha malumotlarni chiqarish uchun"
const isAiUnlocked = ref(false)
const aiPasswordInput = ref('')
const aiPasswordError = ref(false)
const showAiPassword = ref(false)

function unlockAiLogs() {
  if (verifyPassword(aiPasswordInput.value)) {
    isAiUnlocked.value = true
    aiPasswordError.value = false
    aiPasswordInput.value = ''
    refreshData()
  } else {
    aiPasswordError.value = true
    setTimeout(() => {
      aiPasswordError.value = false
    }, 2500)
  }
}

function lockAiLogs() {
  isAiUnlocked.value = false
  aiPasswordInput.value = ''
}

const aiSearch = ref('')
const aiDaysFilter = ref<number>(7)

const filteredAiLogs = computed(() => {
  return aiLogs.value.filter((log) => {
    if (aiSearch.value.trim()) {
      const q = aiSearch.value.toLowerCase().trim()
      const matchQ = log.userMessage.toLowerCase().includes(q)
      const matchA = log.botResponse.toLowerCase().includes(q)
      const matchCat = log.category.toLowerCase().includes(q)
      if (!matchQ && !matchA && !matchCat) return false
    }
    return true
  })
})

function handleDaysFilterChange(days: number) {
  aiDaysFilter.value = days
  weeklyDays.value = days
  aiLogs.value = getLogsForLastDays(days)
  weeklyStats.value = getWeeklyStats(days)
}

function handleClearAiLogs() {
  if (confirm('Barcha 7 kunlik AI yozishmalar tarixini tozalashni tasdiqlaysizmi?')) {
    clearAllLogs()
    refreshData()
  }
}

// ─── SETTINGS TAB STATE ───────────────────────────────────────────────────────
const adminPhonesList = ref(getAdminPhones())
const settingPhone = ref(adminPhonesList.value[0] || '+998 91 313 11 54')
const settingOldPassword = ref('')
const settingNewPassword = ref('')
const settingConfirmPassword = ref('')
const settingsMsg = ref<{ type: 'success' | 'error'; text: string } | null>(null)

function handleSaveSettings() {
  settingsMsg.value = null

  // If changing password, verify old password
  if (settingNewPassword.value.trim()) {
    if (!verifyPassword(settingOldPassword.value)) {
      settingsMsg.value = { type: 'error', text: 'Eski parol noto‘g‘ri kiritildi!' }
      return
    }
    if (settingNewPassword.value.length < 6) {
      settingsMsg.value = { type: 'error', text: 'Yangi parol kamida 6 ta belgidan iborat bo‘lishi kerak!' }
      return
    }
    if (settingNewPassword.value !== settingConfirmPassword.value) {
      settingsMsg.value = { type: 'error', text: 'Yangi parollar bir-biriga mos kelmadi!' }
      return
    }
  }

  const res = updateAdminSettings(
    settingPhone.value,
    settingNewPassword.value.trim() ? settingNewPassword.value.trim() : undefined
  )

  if (res.success) {
    settingsMsg.value = { type: 'success', text: 'Sozlamalar muvaffaqiyatli saqlandi!' }
    settingOldPassword.value = ''
    settingNewPassword.value = ''
    settingConfirmPassword.value = ''
    adminPhonesList.value = getAdminPhones()
  } else {
    settingsMsg.value = { type: 'error', text: res.message }
  }
}

// Logout
function handleLogout() {
  if (confirm('Admin paneldan chiqishni xohlaysizmi?')) {
    authLogout()
    router.replace('/')
  }
}

// Service labels
const serviceNameMap: Record<string, string> = {
  website: '🌐 Veb-sayt',
  telegram: '🤖 Telegram bot',
  crm: '⚡ CRM tizim',
  mobile: '📱 Mobil ilova',
  custom: '💡 Maxsus loyiha',
}
</script>

<template>
  <div class="admin-wrapper">
    <!-- Top Header Bar -->
    <header class="admin-topbar">
      <div class="admin-topbar-left">
        <div class="admin-brand">
          <div class="brand-logo">GME</div>
          <div>
            <h1 class="brand-title">GME TECHNOLOGIES</h1>
            <span class="brand-badge">ADMINISTRATION</span>
          </div>
        </div>
      </div>

      <div class="admin-topbar-right">
        <div class="admin-meta-item">
          <span class="meta-dot"></span>
          <span class="meta-label">{{ settingPhone }}</span>
        </div>
        <div class="admin-clock">
          <span class="clock-icon">🕒</span>
          <span>{{ currentTime }} (Samarqand)</span>
        </div>
        <button class="topbar-btn topbar-btn--site" @click="router.push('/')">
          🌐 Saytga o‘tish
        </button>
        <button class="topbar-btn topbar-btn--logout" @click="handleLogout">
          🚪 Chiqish
        </button>
      </div>
    </header>

    <!-- Main Admin Container -->
    <div class="admin-body">
      <!-- Navigation Tabs -->
      <nav class="admin-nav" aria-label="Admin tabs">
        <button
          class="nav-tab"
          :class="{ 'nav-tab--active': currentTab === 'overview' }"
          @click="currentTab = 'overview'"
        >
          <span class="tab-icon">📊</span>
          <span class="tab-text">Umumiy ko‘rinish</span>
        </button>

        <button
          class="nav-tab"
          :class="{ 'nav-tab--active': currentTab === 'leads' }"
          @click="currentTab = 'leads'"
        >
          <span class="tab-icon">📝</span>
          <span class="tab-text">Kelib tushgan arizalar</span>
          <span v-if="leadsStats.newCount > 0" class="tab-badge">
            {{ leadsStats.newCount }} yangi
          </span>
        </button>

        <button
          class="nav-tab nav-tab--ai"
          :class="{ 'nav-tab--active': currentTab === 'ai-logs' }"
          @click="currentTab = 'ai-logs'"
        >
          <span class="tab-icon">🤖</span>
          <span class="tab-text">AI Assistent xabarlari</span>
          <span class="tab-lock-tag">{{ isAiUnlocked ? '🔓 Ochiq' : '🔒 Maxfiy' }}</span>
        </button>

        <button
          class="nav-tab"
          :class="{ 'nav-tab--active': currentTab === 'settings' }"
          @click="currentTab = 'settings'"
        >
          <span class="tab-icon">⚙️</span>
          <span class="tab-text">Sozlamalar</span>
        </button>
      </nav>

      <!-- TAB 1: OVERVIEW -->
      <section v-if="currentTab === 'overview'" class="tab-content">
        <!-- Metric Cards -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-icon-wrap kpi-icon-wrap--orange">📝</div>
            <div class="kpi-info">
              <span class="kpi-num">{{ leadsStats.total }}</span>
              <span class="kpi-label">Jami Arizalar</span>
              <span class="kpi-sub text-accent">{{ leadsStats.newCount }} ta yangi ko‘rilmagan</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-wrap kpi-icon-wrap--cyan">🤖</div>
            <div class="kpi-info">
              <span class="kpi-num">{{ weeklyStats.totalQuestions }}</span>
              <span class="kpi-label">AI Savollari (7 kunda)</span>
              <span class="kpi-sub text-cyan">{{ weeklyStats.uniqueUsers }} ta foydalanuvchi</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-wrap kpi-icon-wrap--green">⚡</div>
            <div class="kpi-info">
              <span class="kpi-num">100%</span>
              <span class="kpi-label">Telegram Bot Aloqasi</span>
              <span class="kpi-sub text-green">Real-vaqtda bildirishnoma faol</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon-wrap kpi-icon-wrap--purple">🎯</div>
            <div class="kpi-info">
              <span class="kpi-num">Telegram Bot & CRM</span>
              <span class="kpi-label">Eng ko‘p so‘ralgan xizmat</span>
              <span class="kpi-sub">Mijozlar asosiy qiziqishi</span>
            </div>
          </div>
        </div>

        <!-- Quick Sections Grid -->
        <div class="overview-grid">
          <!-- Recent Leads Preview -->
          <div class="panel-box">
            <div class="panel-header">
              <div class="panel-header-title">
                <span class="panel-icon">📝</span>
                <h3 class="panel-h3">So‘nggi arizalar</h3>
              </div>
              <button class="link-btn" @click="currentTab = 'leads'">
                Barchasini ko‘rish ({{ leads.length }}) →
              </button>
            </div>

            <div v-if="leads.length === 0" class="empty-state">
              Hozircha arizalar mavjud emas.
            </div>

            <div v-else class="preview-list">
              <div v-for="lead in leads.slice(0, 4)" :key="lead.id" class="preview-item">
                <div class="preview-main">
                  <div class="preview-title-row">
                    <span class="preview-name">{{ lead.name }}</span>
                    <span class="status-pill" :class="`status-pill--${lead.status}`">
                      {{ lead.status === 'new' ? 'Yangi' : lead.status === 'contacted' ? 'Aloqada' : lead.status === 'deal' ? 'Bitim' : 'Bekor' }}
                    </span>
                  </div>
                  <div class="preview-meta">
                    <a :href="`tel:${lead.phone}`" class="phone-link">📞 {{ lead.phone }}</a>
                    <span class="service-tag">{{ serviceNameMap[lead.service] || lead.service }}</span>
                  </div>
                </div>
                <span class="preview-time">{{ lead.createdAt }}</span>
              </div>
            </div>
          </div>

          <!-- AI Activity Preview -->
          <div class="panel-box">
            <div class="panel-header">
              <div class="panel-header-title">
                <span class="panel-icon">🤖</span>
                <h3 class="panel-h3">AI Assistent faolligi (7 kunlik)</h3>
              </div>
              <button class="link-btn" @click="currentTab = 'ai-logs'">
                7 kunlik tahlilni ochish 🔒 →
              </button>
            </div>

            <div class="ai-overview-summary">
              <div class="summary-stat-row">
                <span>So‘nggi 7 kunda berilgan savollar:</span>
                <strong class="text-accent">{{ weeklyStats.totalQuestions }} ta</strong>
              </div>
              <div class="summary-stat-row">
                <span>Muloqot qilgan foydalanuvchilar:</span>
                <strong class="text-cyan">{{ weeklyStats.uniqueUsers }} ta</strong>
              </div>
              <div class="summary-stat-row">
                <span>Mobil qurilmalardan kirganlar:</span>
                <strong>{{ weeklyStats.deviceCounts.Mobile }} ta ({{ Math.round((weeklyStats.deviceCounts.Mobile / (weeklyStats.totalQuestions || 1)) * 100) }}%)</strong>
              </div>
            </div>

            <!-- Mini bars -->
            <div class="category-bars">
              <h4 class="bars-title">Eng ko‘p so‘ralgan mavzular:</h4>
              <div
                v-for="(count, cat) in weeklyStats.categoryCounts"
                :key="cat"
                class="cat-bar-item"
              >
                <div class="cat-bar-labels">
                  <span>{{ cat }}</span>
                  <span>{{ count }} ta</span>
                </div>
                <div class="cat-bar-track">
                  <div
                    class="cat-bar-fill"
                    :style="{ width: `${Math.min(100, (count / (weeklyStats.totalQuestions || 1)) * 100)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 2: LEADS MANAGEMENT -->
      <section v-if="currentTab === 'leads'" class="tab-content">
        <div class="panel-box">
          <div class="table-toolbar">
            <div class="toolbar-search">
              <span class="search-icon">🔍</span>
              <input
                v-model="leadSearch"
                type="text"
                class="search-input"
                placeholder="Mijoz ismi, telefoni yoki xizmat bo‘yicha qidiruv..."
              />
            </div>

            <div class="toolbar-filters">
              <button
                class="filter-chip"
                :class="{ 'filter-chip--active': leadFilterStatus === 'all' }"
                @click="leadFilterStatus = 'all'"
              >
                Barchasi ({{ leads.length }})
              </button>
              <button
                class="filter-chip filter-chip--new"
                :class="{ 'filter-chip--active': leadFilterStatus === 'new' }"
                @click="leadFilterStatus = 'new'"
              >
                Yangi ({{ leadsStats.newCount }})
              </button>
              <button
                class="filter-chip"
                :class="{ 'filter-chip--active': leadFilterStatus === 'contacted' }"
                @click="leadFilterStatus = 'contacted'"
              >
                Aloqa qilindi ({{ leadsStats.contactedCount }})
              </button>
              <button
                class="filter-chip"
                :class="{ 'filter-chip--active': leadFilterStatus === 'deal' }"
                @click="leadFilterStatus = 'deal'"
              >
                Bitim tuzildi ({{ leadsStats.dealCount }})
              </button>

              <button class="action-btn-sm" @click="exportLeadsAsJson">
                📥 JSON Eksport
              </button>
            </div>
          </div>

          <!-- Leads Cards List -->
          <div v-if="filteredLeads.length === 0" class="empty-state">
            Mos keluvchi arizalar topilmadi.
          </div>

          <div v-else class="leads-grid">
            <div
              v-for="lead in filteredLeads"
              :key="lead.id"
              class="lead-card"
              :class="`lead-card--${lead.status}`"
            >
              <div class="lead-card-header">
                <div class="lead-user-info">
                  <h4 class="lead-name">{{ lead.name }}</h4>
                  <span class="lead-time">⏰ {{ lead.createdAt }}</span>
                </div>
                <div class="lead-status-select-wrap">
                  <select
                    :value="lead.status"
                    class="status-select"
                    :class="`status-select--${lead.status}`"
                    @change="(e) => handleStatusChange(lead.id, (e.target as HTMLSelectElement).value as LeadStatus)"
                  >
                    <option value="new">🟢 Yangi</option>
                    <option value="contacted">🟡 Aloqa qilindi</option>
                    <option value="deal">🔵 Bitim tuzildi</option>
                    <option value="rejected">🔴 Bekor qilindi</option>
                  </select>
                </div>
              </div>

              <div class="lead-card-body">
                <div class="lead-info-row">
                  <span class="info-lbl">Telefon:</span>
                  <a :href="`tel:${lead.phone}`" class="info-val phone-link">
                    📞 {{ lead.phone }}
                  </a>
                </div>

                <div v-if="lead.telegram" class="lead-info-row">
                  <span class="info-lbl">Telegram:</span>
                  <a
                    :href="`https://t.me/${lead.telegram.replace(/^@/, '')}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="info-val tg-link"
                  >
                    ✈️ @{{ lead.telegram.replace(/^@/, '') }}
                  </a>
                </div>

                <div class="lead-info-row">
                  <span class="info-lbl">Xizmat turi:</span>
                  <span class="service-pill">
                    {{ serviceNameMap[lead.service] || lead.service }}
                  </span>
                </div>

                <div v-if="lead.message" class="lead-message-box">
                  <span class="msg-box-lbl">Mijoz izohi:</span>
                  <p class="msg-box-text">{{ lead.message }}</p>
                </div>

                <!-- Admin Notes -->
                <div class="lead-notes-area">
                  <span class="notes-lbl">Ichki admin eslatmasi:</span>
                  <input
                    type="text"
                    class="notes-input"
                    :value="lead.notes || ''"
                    placeholder="Masalan: 12-oktyabrga qo‘ng‘iroq qilindi, narx kelishilmoqda..."
                    @blur="(e) => handleNotesBlur(lead.id, (e.target as HTMLInputElement).value)"
                  />
                </div>
              </div>

              <div class="lead-card-footer">
                <a :href="`tel:${lead.phone}`" class="card-action-btn card-action-btn--call">
                  📞 Qo‘ng‘iroq qilish
                </a>
                <a
                  v-if="lead.telegram"
                  :href="`https://t.me/${lead.telegram.replace(/^@/, '')}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="card-action-btn card-action-btn--tg"
                >
                  ✈️ Telegram
                </a>
                <button
                  class="card-action-btn card-action-btn--del"
                  title="Arizani o‘chirish"
                  @click="handleDeleteLead(lead.id)"
                >
                  🗑️ O‘chirish
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 3: AI LOGS (PASSWORD PROTECTED) -->
      <section v-if="currentTab === 'ai-logs'" class="tab-content">
        <!-- If LOCKED: Show Cyber Password Prompt -->
        <div v-if="!isAiUnlocked" class="ai-lock-card">
          <div class="lock-icon-circle">🔒</div>
          <h2 class="lock-title">Xavfsizlik Tasdig‘i Talab Qilinadi</h2>
          <p class="lock-desc">
            AI assistent bilan so‘nggi 7 kunda muloqot qilgan mijozlar, savollar va xabarlar tarixini ochish uchun
            <strong>maxfiy admin parolingizni</strong> kiriting:
          </p>

          <form class="lock-form" @submit.prevent="unlockAiLogs">
            <div class="lock-input-group" :class="{ 'lock-input-group--error': aiPasswordError }">
              <input
                v-model="aiPasswordInput"
                :type="showAiPassword ? 'text' : 'password'"
                class="lock-input"
                placeholder="Admin parolini kiriting..."
                autofocus
              />
              <button
                type="button"
                class="toggle-eye-btn"
                @click="showAiPassword = !showAiPassword"
              >
                {{ showAiPassword ? '🙈' : '👁️' }}
              </button>
            </div>

            <span v-if="aiPasswordError" class="lock-err-msg">
              ❌ Noto‘g‘ri parol kiritildi! Iltimos, qayta urinib ko‘ring.
            </span>

            <button type="submit" class="lock-submit-btn">
              🔓 Qulfni ochish va 7 kunlik yozishmalarni ko‘rish
            </button>
          </form>

          <div class="lock-footer-hint">
            <span>💡 <i>Bu ma’lumotlar maxfiy hisoblanadi va faqat administratorga ruxsat etiladi.</i></span>
          </div>
        </div>

        <!-- If UNLOCKED: Show Full 7-Day History & Analytics -->
        <div v-else class="ai-unlocked-container">
          <!-- Unlocked Banner -->
          <div class="unlocked-header-banner">
            <div class="banner-info">
              <span class="banner-badge">✅ XAVFSIZLIK TASDIQLANDI</span>
              <h2 class="banner-title">AI Assistent — So‘nggi 7 kunlik to‘liq tahlil va xabarlar</h2>
            </div>
            <div class="banner-actions">
              <button class="action-btn-sm" @click="exportLogsAsJson">
                📥 JSON Eksport
              </button>
              <button class="action-btn-sm action-btn-sm--danger" @click="handleClearAiLogs">
                🗑️ Tarixni tozalash
              </button>
              <button class="lock-back-btn" @click="lockAiLogs">
                🔒 Qayta qulflash
              </button>
            </div>
          </div>

          <!-- 7-Day Analytics Overview -->
          <div class="ai-stats-summary-grid">
            <div class="ai-stat-pill">
              <span class="stat-num text-accent">{{ weeklyStats.totalQuestions }}</span>
              <span class="stat-lbl">7 kunlik jami savollar</span>
            </div>
            <div class="ai-stat-pill">
              <span class="stat-num text-cyan">{{ weeklyStats.uniqueUsers }}</span>
              <span class="stat-lbl">Noyob foydalanuvchilar (sessiyalar)</span>
            </div>
            <div class="ai-stat-pill">
              <span class="stat-num text-green">{{ weeklyStats.deviceCounts.Mobile }}</span>
              <span class="stat-lbl">Mobil foydalanuvchilar</span>
            </div>
            <div class="ai-stat-pill">
              <span class="stat-num text-purple">{{ weeklyStats.deviceCounts.Desktop }}</span>
              <span class="stat-lbl">Kompyuter foydalanuvchilar</span>
            </div>
          </div>

          <!-- 7-Day Daily Trend Chart (Visual Bars) -->
          <div class="panel-box">
            <h3 class="panel-h3 mb-3">📅 So‘nggi 7 kunlik savollar dinamikasi</h3>
            <div class="daily-bars-chart">
              <div
                v-for="day in weeklyStats.dailyCounts"
                :key="day.date"
                class="chart-bar-col"
              >
                <div class="chart-bar-wrap">
                  <div
                    class="chart-bar"
                    :style="{ height: `${Math.max(12, Math.min(160, day.count * 25))}px` }"
                    :class="{ 'chart-bar--active': day.count > 0 }"
                  >
                    <span class="bar-val-badge">{{ day.count }}</span>
                  </div>
                </div>
                <span class="chart-day-lbl">{{ day.dayLabel }}</span>
                <span class="chart-date-lbl">{{ day.date.slice(5) }}</span>
              </div>
            </div>
          </div>

          <!-- Questions Log Table & Cards -->
          <div class="panel-box mt-4">
            <div class="table-toolbar">
              <div class="toolbar-search">
                <span class="search-icon">🔍</span>
                <input
                  v-model="aiSearch"
                  type="text"
                  class="search-input"
                  placeholder="Savol matni, javob yoki mavzu bo‘yicha qidirish..."
                />
              </div>

              <div class="toolbar-filters">
                <button
                  class="filter-chip"
                  :class="{ 'filter-chip--active': aiDaysFilter === 1 }"
                  @click="handleDaysFilterChange(1)"
                >
                  Bugun
                </button>
                <button
                  class="filter-chip"
                  :class="{ 'filter-chip--active': aiDaysFilter === 3 }"
                  @click="handleDaysFilterChange(3)"
                >
                  Oxirgi 3 kun
                </button>
                <button
                  class="filter-chip"
                  :class="{ 'filter-chip--active': aiDaysFilter === 7 }"
                  @click="handleDaysFilterChange(7)"
                >
                  7 kunlik (Barchasi)
                </button>
              </div>
            </div>

            <!-- Messages Stream -->
            <div v-if="filteredAiLogs.length === 0" class="empty-state">
              So‘rov bo‘yicha yozishmalar topilmadi.
            </div>

            <div v-else class="ai-logs-stream">
              <div
                v-for="log in filteredAiLogs"
                :key="log.id"
                class="ai-log-card"
              >
                <div class="ai-log-meta-bar">
                  <span class="log-category-badge">{{ log.category }}</span>
                  <span class="log-device-badge">
                    {{ log.device === 'Mobile' ? '📱 Mobil' : '💻 Kompyuter' }}
                  </span>
                  <span class="log-user-badge">👤 Sessiya: {{ log.sessionId.slice(-6) }}</span>
                  <span class="log-time-badge">⏰ {{ log.timestamp }}</span>
                </div>

                <div class="ai-log-dialog">
                  <!-- User Question -->
                  <div class="dialog-bubble dialog-bubble--user">
                    <span class="dialog-sender">👤 Foydalanuvchi:</span>
                    <p class="dialog-text">{{ log.userMessage }}</p>
                  </div>

                  <!-- Bot Answer -->
                  <div class="dialog-bubble dialog-bubble--bot">
                    <span class="dialog-sender">✦ GME AI Assistent:</span>
                    <p class="dialog-text whitespace-pre-line">{{ log.botResponse }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 4: SETTINGS -->
      <section v-if="currentTab === 'settings'" class="tab-content">
        <div class="settings-grid">
          <!-- Credentials Box -->
          <div class="panel-box">
            <h3 class="panel-h3">🔐 Administrator Kirish Sozlamalari</h3>
            <p class="panel-desc">
              Ushbu telefon raqami va parol saytdagi ariza formasiga kiritilganda to‘g‘ridan-to‘g‘ri admin panel ochiladi.
            </p>

            <form class="settings-form" @submit.prevent="handleSaveSettings">
              <div class="form-group">
                <label class="form-label">Asosiy Admin Telefon Raqami:</label>
                <input
                  v-model="settingPhone"
                  type="text"
                  class="form-input"
                  placeholder="+998 91 313 11 54"
                />
                <span class="form-hint">Ariza formasidagi «Telefon» maydoniga shu raqam yoziladi.</span>
              </div>

              <div class="divider"></div>

              <h4 class="settings-sub-h4">Maxfiy Parolni O‘zgartirish:</h4>

              <div class="form-group">
                <label class="form-label">Amaldagi (eski) parol:</label>
                <input
                  v-model="settingOldPassword"
                  type="password"
                  class="form-input"
                  placeholder="Amaldagi parolni kiriting..."
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Yangi parol:</label>
                  <input
                    v-model="settingNewPassword"
                    type="password"
                    class="form-input"
                    placeholder="Yangi parol (kamida 6 belgi)"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Yangi parolni tasdiqlang:</label>
                  <input
                    v-model="settingConfirmPassword"
                    type="password"
                    class="form-input"
                    placeholder="Qayta kiriting"
                  />
                </div>
              </div>

              <div v-if="settingsMsg" class="alert-box" :class="`alert-box--${settingsMsg.type}`">
                {{ settingsMsg.text }}
              </div>

              <button type="submit" class="save-settings-btn">
                💾 Sozlamalarni saqlash
              </button>
            </form>
          </div>

          <!-- Telegram Bot Integration Info -->
          <div class="panel-box">
            <h3 class="panel-h3">🤖 Telegram Xabarnomalar Holati</h3>
            <p class="panel-desc">
              Saytga tushgan arizalar va AI assistentga berilgan savollar darhol Telegram bot orqali guruhingizga yuboriladi.
            </p>

            <div class="tg-status-list">
              <div class="tg-status-row">
                <span>Telegram Bot:</span>
                <strong class="text-green">✅ Ulangan (@gme_technologies)</strong>
              </div>
              <div class="tg-status-row">
                <span>Guruh Chat ID:</span>
                <code>-5544442243</code>
              </div>
              <div class="tg-status-row">
                <span>Yangi arizalar xabarnomasi:</span>
                <span class="text-green">✅ Faol</span>
              </div>
              <div class="tg-status-row">
                <span>AI Assistent savollari xabarnomasi:</span>
                <span class="text-green">✅ Faol</span>
              </div>
            </div>

            <div class="stealth-info-card">
              <h4>🕵️‍♂️ Maxfiy Kirish Qoidasi:</h4>
              <p>
                1. Saytning istalgan joyidagi <strong>«Ariza qoldirish»</strong> formasini oching.<br />
                2. <strong>Telefon</strong> maydoniga: <code>{{ settingPhone }}</code> kiriting.<br />
                3. <strong>Ism</strong> maydoniga: <code>admin parolini</code> kiriting.<br />
                4. <strong>«Ariza yuborish»</strong> tugmasini bosing — tizim ariza yubormasdan to‘g‘ridan-to‘g‘ri Admin panelni ochadi!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ─── Admin Layout ───────────────────────────────────────────────────────── */
.admin-wrapper {
  min-height: 100vh;
  background: #070A0E;
  color: #F1F5F9;
  font-family: inherit;
  display: flex;
  flex-direction: column;
}

/* ─── Topbar ─────────────────────────────────────────────────────────────── */
.admin-topbar {
  background: #0B0F15;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.875rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #FF5A1F 0%, #D8420A 100%);
  color: #FFFFFF;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  letter-spacing: -0.02em;
  box-shadow: 0 0 16px rgba(255, 90, 31, 0.35);
}

.brand-title {
  font-size: 1.0625rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 0;
  color: #FFFFFF;
}

.brand-badge {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #FF5A1F;
  letter-spacing: 0.08em;
}

.admin-topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.admin-meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #111822;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  color: #E2E8F0;
}

.meta-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 8px #10B981;
}

.admin-clock {
  font-size: 0.8125rem;
  color: #94A3B8;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.topbar-btn {
  padding: 0.45rem 0.95rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.topbar-btn--site {
  background: #151F2C;
  color: #E2E8F0;
  border-color: rgba(255, 255, 255, 0.1);
}
.topbar-btn--site:hover {
  background: #1C2A3A;
  color: #FFFFFF;
}

.topbar-btn--logout {
  background: rgba(239, 68, 68, 0.12);
  color: #F87171;
  border-color: rgba(239, 68, 68, 0.3);
}
.topbar-btn--logout:hover {
  background: rgba(239, 68, 68, 0.22);
}

/* ─── Navigation Tabs ────────────────────────────────────────────────────── */
.admin-body {
  padding: 1.75rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  flex: 1;
}

.admin-nav {
  display: flex;
  gap: 0.625rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 1rem;
  margin-bottom: 1.75rem;
  overflow-x: auto;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.65rem 1.25rem;
  background: #10161F;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: #94A3B8;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.nav-tab:hover {
  background: #151F2A;
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.15);
}

.nav-tab--active {
  background: #FF5A1F !important;
  color: #FFFFFF !important;
  border-color: #FF5A1F !important;
  box-shadow: 0 4px 16px rgba(255, 90, 31, 0.35);
}

.tab-badge {
  background: #10B981;
  color: #070A0E;
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
}

.tab-lock-tag {
  background: rgba(0, 0, 0, 0.3);
  font-size: 0.6875rem;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* ─── KPI Cards Grid ─────────────────────────────────────────────────────── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

.kpi-card {
  background: #0E131A;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.125rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.kpi-icon-wrap {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.kpi-icon-wrap--orange { background: rgba(255, 90, 31, 0.15); border: 1px solid rgba(255, 90, 31, 0.3); }
.kpi-icon-wrap--cyan { background: rgba(0, 229, 255, 0.15); border: 1px solid rgba(0, 229, 255, 0.3); }
.kpi-icon-wrap--green { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); }
.kpi-icon-wrap--purple { background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); }

.kpi-info {
  display: flex;
  flex-direction: column;
}

.kpi-num {
  font-size: 1.5rem;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.2;
}

.kpi-label {
  font-size: 0.8125rem;
  color: #94A3B8;
  margin-top: 0.2rem;
}

.kpi-sub {
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.35rem;
}

.text-accent { color: #FF5A1F; }
.text-cyan { color: #00E5FF; }
.text-green { color: #10B981; }
.text-purple { color: #A855F7; }

/* ─── Panel Box ──────────────────────────────────────────────────────────── */
.panel-box {
  background: #0E131A;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.panel-header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-icon {
  font-size: 1.25rem;
}

.panel-h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
}

.panel-desc {
  font-size: 0.875rem;
  color: #94A3B8;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.link-btn {
  background: none;
  border: none;
  color: #FF5A1F;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}
.link-btn:hover {
  text-decoration: underline;
}

.overview-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 1024px) {
  .overview-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* ─── Preview List ───────────────────────────────────────────────────────── */
.preview-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-item {
  background: #121822;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.875rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.preview-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.preview-name {
  font-weight: 700;
  color: #FFFFFF;
  font-size: 0.9375rem;
}

.preview-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.35rem;
  font-size: 0.8125rem;
}

.phone-link {
  color: #00E5FF;
  text-decoration: none;
}
.phone-link:hover {
  text-decoration: underline;
}

.service-tag {
  color: #94A3B8;
}

.preview-time {
  font-size: 0.75rem;
  color: #64748B;
  white-space: nowrap;
}

/* Status Pill */
.status-pill {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
}
.status-pill--new { background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); }
.status-pill--contacted { background: rgba(245, 158, 11, 0.15); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.3); }
.status-pill--deal { background: rgba(59, 130, 246, 0.15); color: #60A5FA; border: 1px solid rgba(59, 130, 246, 0.3); }
.status-pill--rejected { background: rgba(239, 68, 68, 0.15); color: #F87171; border: 1px solid rgba(239, 68, 68, 0.3); }

/* ─── AI Overview Summary & Bars ─────────────────────────────────────────── */
.ai-overview-summary {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  background: #121822;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #CBD5E1;
}

.category-bars {
  margin-top: 1.25rem;
}

.bars-title {
  font-size: 0.8125rem;
  color: #94A3B8;
  margin-bottom: 0.75rem;
}

.cat-bar-item {
  margin-bottom: 0.75rem;
}

.cat-bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: #E2E8F0;
  margin-bottom: 0.35rem;
}

.cat-bar-track {
  height: 7px;
  background: #17212F;
  border-radius: 4px;
  overflow: hidden;
}

.cat-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF5A1F 0%, #00E5FF 100%);
  border-radius: 4px;
}

/* ─── Table Toolbar ──────────────────────────────────────────────────────── */
.table-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.toolbar-search {
  position: relative;
  flex: 1;
  min-width: 260px;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: #64748B;
}

.search-input {
  width: 100%;
  background: #121822;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.6rem 0.85rem 0.6rem 2.4rem;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 0.875rem;
}
.search-input:focus {
  outline: none;
  border-color: #FF5A1F;
}

.toolbar-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-chip {
  background: #121822;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  color: #94A3B8;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.filter-chip:hover {
  color: #FFFFFF;
  background: #17202D;
}
.filter-chip--active {
  background: #FF5A1F !important;
  color: #FFFFFF !important;
  border-color: #FF5A1F !important;
}

.action-btn-sm {
  background: #151F2C;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #E2E8F0;
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}
.action-btn-sm:hover {
  background: #1D2A3C;
  color: #FFFFFF;
}
.action-btn-sm--danger {
  background: rgba(239, 68, 68, 0.15);
  color: #F87171;
  border-color: rgba(239, 68, 68, 0.3);
}

/* ─── Leads Grid ─────────────────────────────────────────────────────────── */
.leads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
}

.lead-card {
  background: #111822;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.lead-card--new { border-left: 4px solid #10B981; }
.lead-card--contacted { border-left: 4px solid #F59E0B; }
.lead-card--deal { border-left: 4px solid #3B82F6; }
.lead-card--rejected { border-left: 4px solid #EF4444; }

.lead-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.lead-name {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
}

.lead-time {
  font-size: 0.75rem;
  color: #64748B;
  display: block;
  margin-top: 0.25rem;
}

.status-select {
  background: #16202C;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.lead-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.lead-info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-lbl {
  color: #64748B;
  font-size: 0.8125rem;
  min-width: 80px;
}

.info-val {
  color: #E2E8F0;
  font-weight: 600;
}

.tg-link {
  color: #00E5FF;
  text-decoration: none;
}
.tg-link:hover {
  text-decoration: underline;
}

.service-pill {
  background: rgba(255, 90, 31, 0.15);
  color: #FF5A1F;
  border: 1px solid rgba(255, 90, 31, 0.3);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
}

.lead-message-box {
  background: #0B0F15;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 0.5rem;
}

.msg-box-lbl {
  font-size: 0.6875rem;
  color: #64748B;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.25rem;
}

.msg-box-text {
  font-size: 0.8125rem;
  color: #CBD5E1;
  line-height: 1.4;
  margin: 0;
}

.lead-notes-area {
  margin-top: 0.5rem;
}

.notes-lbl {
  font-size: 0.6875rem;
  color: #94A3B8;
  font-weight: 600;
  display: block;
  margin-bottom: 0.25rem;
}

.notes-input {
  width: 100%;
  background: #0B0F15;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.45rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #F1F5F9;
}
.notes-input:focus {
  outline: none;
  border-color: #00E5FF;
}

.lead-card-footer {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.card-action-btn {
  flex: 1;
  text-align: center;
  padding: 0.45rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  border: none;
}
.card-action-btn--call { background: #152232; color: #00E5FF; border: 1px solid rgba(0, 229, 255, 0.2); }
.card-action-btn--tg { background: rgba(0, 136, 204, 0.15); color: #29B6F6; border: 1px solid rgba(41, 182, 246, 0.3); }
.card-action-btn--del { background: rgba(239, 68, 68, 0.1); color: #F87171; flex: 0 0 80px; }

/* ─── AI Lock Screen ─────────────────────────────────────────────────────── */
.ai-lock-card {
  max-width: 560px;
  margin: 3rem auto;
  background: #0E131A;
  border: 1px solid rgba(255, 90, 31, 0.25);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), 0 0 30px rgba(255, 90, 31, 0.1);
}

.lock-icon-circle {
  width: 72px;
  height: 72px;
  margin: 0 auto 1.5rem auto;
  border-radius: 50%;
  background: rgba(255, 90, 31, 0.15);
  border: 2px solid #FF5A1F;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 0 24px rgba(255, 90, 31, 0.3);
}

.lock-title {
  font-size: 1.375rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 0.75rem;
}

.lock-desc {
  font-size: 0.9375rem;
  color: #94A3B8;
  line-height: 1.5;
  margin-bottom: 1.75rem;
}

.lock-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lock-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.lock-input {
  width: 100%;
  background: #141B24;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.85rem 3rem 0.85rem 1.125rem;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 1.0625rem;
  text-align: center;
  letter-spacing: 0.05em;
}
.lock-input:focus {
  outline: none;
  border-color: #FF5A1F;
  box-shadow: 0 0 12px rgba(255, 90, 31, 0.3);
}

.toggle-eye-btn {
  position: absolute;
  right: 0.85rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.125rem;
  opacity: 0.7;
}

.lock-err-msg {
  color: #F87171;
  font-size: 0.8125rem;
  font-weight: 700;
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

.lock-submit-btn {
  background: #FF5A1F;
  color: #FFFFFF;
  border: none;
  padding: 0.95rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 6px 20px rgba(255, 90, 31, 0.35);
}
.lock-submit-btn:hover {
  background: #E04E17;
  transform: translateY(-1px);
}

.lock-footer-hint {
  margin-top: 1.75rem;
  font-size: 0.75rem;
  color: #64748B;
}

/* ─── AI Unlocked Container ──────────────────────────────────────────────── */
.ai-unlocked-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.unlocked-header-banner {
  background: #111822;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.banner-badge {
  font-size: 0.6875rem;
  font-weight: 800;
  color: #10B981;
  letter-spacing: 0.08em;
  display: block;
  margin-bottom: 0.25rem;
}

.banner-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
}

.banner-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.lock-back-btn {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #F87171;
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
}

.ai-stats-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.ai-stat-pill {
  background: #0E131A;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.1;
}

.stat-lbl {
  font-size: 0.75rem;
  color: #94A3B8;
  margin-top: 0.35rem;
}

/* 7-day Daily Chart */
.daily-bars-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 1rem;
  padding-top: 1rem;
  height: 180px;
}

.chart-bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 65px;
}

.chart-bar-wrap {
  height: 140px;
  display: flex;
  align-items: flex-end;
  width: 100%;
}

.chart-bar {
  width: 100%;
  background: #17212F;
  border-radius: 6px 6px 0 0;
  position: relative;
  transition: height 0.4s ease;
  min-height: 8px;
}

.chart-bar--active {
  background: linear-gradient(180deg, #FF5A1F 0%, #D8420A 100%);
  box-shadow: 0 0 12px rgba(255, 90, 31, 0.35);
}

.bar-val-badge {
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.6875rem;
  font-weight: 700;
  color: #CBD5E1;
}

.chart-day-lbl {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-top: 0.5rem;
}

.chart-date-lbl {
  font-size: 0.6875rem;
  color: #64748B;
}

/* ─── AI Logs Stream ─────────────────────────────────────────────────────── */
.ai-logs-stream {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.ai-log-card {
  background: #111822;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 1.25rem;
}

.ai-log-meta-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  align-items: center;
  margin-bottom: 0.875rem;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.log-category-badge {
  background: rgba(255, 90, 31, 0.15);
  color: #FF5A1F;
  border: 1px solid rgba(255, 90, 31, 0.3);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
}

.log-device-badge,
.log-user-badge,
.log-time-badge {
  font-size: 0.75rem;
  color: #94A3B8;
}

.ai-log-dialog {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dialog-bubble {
  padding: 0.875rem 1.125rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.dialog-bubble--user {
  background: #17212F;
  border-left: 3px solid #00E5FF;
}

.dialog-bubble--bot {
  background: #0B0F15;
  border-left: 3px solid #FF5A1F;
}

.dialog-sender {
  font-size: 0.6875rem;
  font-weight: 800;
  color: #94A3B8;
  display: block;
  margin-bottom: 0.35rem;
  letter-spacing: 0.03em;
}

.dialog-text {
  color: #F1F5F9;
  line-height: 1.5;
  margin: 0;
}

.whitespace-pre-line {
  white-space: pre-line;
}

/* ─── Settings Form ──────────────────────────────────────────────────────── */
.settings-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 1024px) {
  .settings-grid {
    grid-template-columns: 1.2fr 1fr;
  }
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #E2E8F0;
}

.form-input {
  background: #121822;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.65rem 0.85rem;
  border-radius: 6px;
  color: #FFFFFF;
  font-size: 0.9375rem;
}
.form-input:focus {
  outline: none;
  border-color: #FF5A1F;
}

.form-hint {
  font-size: 0.75rem;
  color: #64748B;
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0.5rem 0;
}

.settings-sub-h4 {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
}

.save-settings-btn {
  background: #FF5A1F;
  color: #FFFFFF;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}
.save-settings-btn:hover {
  background: #E04E17;
}

.alert-box {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
}
.alert-box--success {
  background: rgba(16, 185, 129, 0.15);
  color: #10B981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.alert-box--error {
  background: rgba(239, 68, 68, 0.15);
  color: #F87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.tg-status-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #121822;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.tg-status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #CBD5E1;
}

.stealth-info-card {
  background: rgba(255, 90, 31, 0.08);
  border: 1px solid rgba(255, 90, 31, 0.25);
  border-radius: 8px;
  padding: 1.25rem;
}

.stealth-info-card h4 {
  font-size: 0.9375rem;
  color: #FF5A1F;
  margin-bottom: 0.5rem;
}

.stealth-info-card p {
  font-size: 0.8125rem;
  color: #CBD5E1;
  line-height: 1.6;
  margin: 0;
}

.stealth-info-card code {
  background: #0B0F15;
  color: #FF5A1F;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8125rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #64748B;
  font-size: 0.9375rem;
}

.mb-3 { margin-bottom: 0.75rem; }
.mt-4 { margin-top: 1rem; }
</style>
