<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useModal } from '@/composables/useModal'

interface ActionButton {
  label: string
  type: 'modal' | 'link' | 'navigate'
  target?: string
}

interface ChatMessage {
  id: string
  sender: 'bot' | 'user'
  text: string
  time: string
  actions?: ActionButton[]
}

const { locale } = useI18n()
const router = useRouter()
const { open: openLeadModal } = useModal()

const isOpen = ref(false)
const isTyping = ref(false)
const inputText = ref('')
const showTeaser = ref(false)
const teaserDismissed = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const currentLang = computed<'uz' | 'ru' | 'en'>(() => {
  if (locale.value === 'ru') return 'ru'
  if (locale.value === 'en') return 'en'
  return 'uz'
})

function getCurrentTime(): string {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Initial messages
const messages = ref<ChatMessage[]>([])

function getInitialBotMessage(): ChatMessage {
  const texts = {
    uz: 'Assalomu alaykum! Men GME Technologies sun’iy intellekt assistentiman. Sizga raqamli loyihalar, xizmatlar, narxlar yoki muddatlar bo‘yicha qanday yordam bera olaman?',
    ru: 'Здравствуйте! Я AI-ассистент компании GME Technologies. Чем я могу помочь вам: услуги, цены, сроки или разработка проектов?',
    en: 'Hello! I am the GME Technologies AI Assistant. How can I help you today regarding our digital services, pricing, timelines, or projects?',
  }
  return {
    id: 'welcome',
    sender: 'bot',
    text: texts[currentLang.value],
    time: getCurrentTime(),
    actions: [
      { label: currentLang.value === 'ru' ? '📝 Оставить заявку' : currentLang.value === 'en' ? '📝 Request a Quote' : '📝 Ariza qoldirish', type: 'modal' },
    ],
  }
}

// Suggestions chips
const suggestions = computed(() => {
  if (currentLang.value === 'ru') {
    return [
      { id: 'services', label: '🛠 Какие услуги вы предлагаете?' },
      { id: 'pricing', label: '💰 Сколько стоит разработка?' },
      { id: 'timeline', label: '⏱ Какие сроки создания MVP?' },
      { id: 'portfolio', label: '📂 Ваши выполненные проекты' },
      { id: 'contacts', label: '📍 Где находится ваш офис?' },
    ]
  }
  if (currentLang.value === 'en') {
    return [
      { id: 'services', label: '🛠 What services do you offer?' },
      { id: 'pricing', label: '💰 How much does development cost?' },
      { id: 'timeline', label: '⏱ What is your MVP turnaround time?' },
      { id: 'portfolio', label: '📂 Your completed projects' },
      { id: 'contacts', label: '📍 Where is your office located?' },
    ]
  }
  return [
    { id: 'services', label: '🛠 Qanday xizmatlar ko‘rsatasiz?' },
    { id: 'pricing', label: '💰 Xizmatlar narxi qancha?' },
    { id: 'timeline', label: '⏱ MVP qancha vaqtda tayyor bo‘ladi?' },
    { id: 'portfolio', label: '📂 Bajarilgan loyihalar (ORZU, Shukrona)' },
    { id: 'contacts', label: '📍 Ofis qayerda va qanday bog‘lanish mumkin?' },
  ]
})

// Knowledge base responses
function generateAiResponse(userText: string): { text: string; actions?: ActionButton[] } {
  const lower = userText.toLowerCase().trim()
  
  // Detect language of question
  let lang = currentLang.value
  if (/[а-яё]/i.test(lower)) {
    lang = 'ru'
  } else if (/\b(how|what|price|cost|where|who|when|services|project|office|hello|hi)\b/i.test(lower)) {
    lang = 'en'
  }

  // 1. Services
  if (
    lower.includes('xizmat') || lower.includes('nima qilas') || lower.includes('ishlaysiz') ||
    lower.includes('услуг') || lower.includes('что вы делаете') || lower.includes('разработ') ||
    lower.includes('service') || lower.includes('what do you do') || lower.includes('offer')
  ) {
    if (lang === 'ru') {
      return {
        text: 'GME Technologies предоставляет полный цикл IT-инжиниринга:\n\n• Веб-платформы и современные сайты (Vue 3, TypeScript, Node.js, PostgreSQL)\n• Telegram-боты и Web Mini Apps для автоматизации продаж и сервиса\n• CRM и ERP системы для учета финансов, заказов и складов\n• Мобильные приложения (iOS и Android)\n• Интеграция искусственного интеллекта (AI) и нейросетей',
        actions: [
          { label: '📝 Обсудить проект', type: 'modal' },
          { label: '↗️ Все услуги', type: 'navigate', target: '/services' },
        ],
      }
    }
    if (lang === 'en') {
      return {
        text: 'GME Technologies delivers full-cycle software engineering solutions:\n\n• High-performance web applications & platforms (Vue 3, TypeScript, PostgreSQL)\n• Telegram Bots & Web Mini Apps for automated customer flows\n• Custom CRM/ERP enterprise systems (inventory, finance, courier tracking)\n• Mobile apps (iOS & Android)\n• Artificial Intelligence (AI) and automated workflow integrations',
        actions: [
          { label: '📝 Request a project', type: 'modal' },
          { label: '↗️ Explore Services', type: 'navigate', target: '/services' },
        ],
      }
    }
    return {
      text: 'GME Technologies quyidagi asosiy yo‘nalishlarda sifatli IT-yechimlarni ishlab chiqadi:\n\n• Veb-saytlar va murakkab veb-platformalar (Vue 3, TypeScript, Node.js, PostgreSQL)\n• Telegram botlar va Telegram Mini App (avtomatlashtirilgan buyurtma va to‘lovlar)\n• CRM va ERP tizimlari (moliya, ombor va kuryerlar boshqaruvi)\n• Mobil ilovalar (iOS va Android platformalari)\n• Sun’iy intellekt (AI) va aqlli algoritmlarni biznesga integratsiya qilish',
      actions: [
        { label: '📝 Loyihani hisoblash', type: 'modal' },
        { label: '↗️ Xizmatlar sahifasi', type: 'navigate', target: '/services' },
      ],
    }
  }

  // 2. Pricing & Cost
  if (
    lower.includes('narx') || lower.includes('qancha') || lower.includes('puli') || lower.includes('smeta') || lower.includes('to\'lov') ||
    lower.includes('цен') || lower.includes('стоим') || lower.includes('сколько') || lower.includes('прайс') || lower.includes('бюджет') ||
    lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('estimate') || lower.includes('budget')
  ) {
    if (lang === 'ru') {
      return {
        text: 'Стоимость каждого проекта рассчитывается индивидуально в зависимости от функционала, масштаба и интеграций:\n\n1. Техническая консультация и оценка — абсолютно бесплатны.\n2. В течение 1 рабочего дня мы готовим подробный план и прозрачную смету.\n3. Оплата поэтапная (milestone-based) по мере сдачи функционала.\n4. По завершении 100% исходного кода передается вам.',
        actions: [
          { label: '📝 Запросить смету бесплатно', type: 'modal' },
          { label: '✈️ Написать в Telegram', type: 'link', target: 'https://t.me/gme_technologies' },
        ],
      }
    }
    if (lang === 'en') {
      return {
        text: 'Project pricing is calculated transparently based on your functional specifications and integrations:\n\n1. Initial technical consultation and scoping is 100% free.\n2. We prepare an engineering breakdown and estimate within 1 business day.\n3. Payments are milestone-based upon milestone deliveries.\n4. 100% full source code ownership belongs to you.',
        actions: [
          { label: '📝 Get Free Estimate', type: 'modal' },
          { label: '✈️ Chat on Telegram', type: 'link', target: 'https://t.me/gme_technologies' },
        ],
      }
    }
    return {
      text: 'Har bir loyihaning narxi uning vazifalari, murakkabligi va integratsiyalariga qarab ochiq va shaffof hisoblanadi:\n\n1. Dastlabki konsultatsiya va texnik baholash — mutlaqo bepul.\n2. 1 ish kuni ichida loyiha bosqichlari va smetasi tayyorlab beriladi.\n3. To‘lovlar qismlarga bo‘lib (milestone-based), bosqichma-bosqich qabul qilinadi.\n4. Loyiha yakunida kod va tizim to‘liq sizning mulkingizga aylanadi.',
      actions: [
        { label: '📝 Bepul smeta olish', type: 'modal' },
        { label: '✈️ Telegramda hisoblash', type: 'link', target: 'https://t.me/gme_technologies' },
      ],
    }
  }

  // 3. Timeline & MVP
  if (
    lower.includes('muddat') || lower.includes('vaqt') || lower.includes('qachon') || lower.includes('kun') || lower.includes('hafta') || lower.includes('mvp') ||
    lower.includes('срок') || lower.includes('время') || lower.includes('когда') || lower.includes('быстро') || lower.includes('недел') ||
    lower.includes('timeline') || lower.includes('duration') || lower.includes('how long') || lower.includes('fast') || lower.includes('deadline')
  ) {
    if (lang === 'ru') {
      return {
        text: 'Мы применяем быстрый Agile/MVP-подход, чтобы вы как можно скорее проверили продукт на пользователях:\n\n• Стартовый рабочий MVP: от 2 до 3 недель (например, платформа ORZU была разработана всего за 2 недели!)\n• Стандартные веб-сайты и боты: 10–14 дней\n• Комплексные CRM/ERP системы: от 1 до 2 месяцев с поэтапным запуском модулей.',
        actions: [
          { label: '📝 Обсудить сроки', type: 'modal' },
        ],
      }
    }
    if (lang === 'en') {
      return {
        text: 'We leverage a rapid Agile/MVP methodology to launch functional products to market without delays:\n\n• Initial functional MVP: 2 to 3 weeks (e.g. ORZU EdTech platform was built and delivered in just 2 weeks!)\n• Telegram Web Apps & websites: 10–14 days\n• Enterprise CRM/ERP ecosystems: 1–2 months with continuous delivery sprints.',
        actions: [
          { label: '📝 Plan your project', type: 'modal' },
        ],
      }
    }
    return {
      text: 'Biz loyihalarni cho‘zmasdan, tezkor MVP (Minimal Ishchi Mahsulot) uslubida foydalanishga topshiramiz:\n\n• Boshlang‘ich ishchi MVP versiya: 2–3 hafta ichida (masalan, ORZU EdTech platformasi 2 hafta ichida ishga tushirilgan!)\n• Standart veb-sayt va Telegram botlar: 10–14 ish kuni\n• Katta korxona CRM/ERP tizimlari: 1–2 oy (bosqichma-bosqich joriy etish bilan).',
      actions: [
        { label: '📝 Muddatni kelishish', type: 'modal' },
      ],
    }
  }

  // 4. Portfolio & Projects
  if (
    lower.includes('loyiha') || lower.includes('orzu') || lower.includes('shukrona') || lower.includes('portfolio') || lower.includes('zukko') ||
    lower.includes('проект') || lower.includes('кейс') || lower.includes('портфолио') || lower.includes('пример') ||
    lower.includes('project') || lower.includes('portfolio') || lower.includes('case') || lower.includes('client')
  ) {
    if (lang === 'ru') {
      return {
        text: 'Некоторые из наших реализованных проектов:\n\n1. ORZU — Образовательная веб-платформа подготовки к IELTS и SAT с гибкими треками и аналитикой (разработана за 2 недели).\n2. Shukrona Zam Zam Suvlari — Автоматизация доставки воды для 10,000+ клиентов: Telegram-бот, Mini App, учет финансов и курьеров.\n3. ZukkoPay — FinTech модуль интеграции платежных систем.',
        actions: [
          { label: '📂 Открыть проекты', type: 'navigate', target: '/projects' },
          { label: '📝 Заказать похожий проект', type: 'modal' },
        ],
      }
    }
    if (lang === 'en') {
      return {
        text: 'Key featured projects delivered by our team:\n\n1. ORZU Learning Platform — EdTech exam preparation platform for IELTS & SAT students (engineered in 2 weeks).\n2. Shukrona Zam Zam Suvlari — Automated water delivery ecosystem serving 10,000+ customers via Telegram Bot, Web Mini App, finance & courier routing.\n3. ZukkoPay — FinTech payment and billing integration module.',
        actions: [
          { label: '📂 View All Projects', type: 'navigate', target: '/projects' },
          { label: '📝 Build a Similar Project', type: 'modal' },
        ],
      }
    }
    return {
      text: 'GME Technologies tomonidan amalga oshirilgan asosiy loyihalar:\n\n1. ORZU Learning Platform — IELTS va SAT imtihonlariga tayyorlovchi zamonaviy EdTech platformasi (2 haftada ishga tushirilgan MVP).\n2. Shukrona Zam Zam Suvlari — 10,000+ mijozga xizmat ko‘rsatuvchi Telegram bot, Web Mini App, moliya va kuryerlar logistika tizimi.\n3. ZukkoPay — FinTech to‘lov tizimlari integratsiyasi.',
      actions: [
        { label: '📂 Barcha loyihalarni ko‘rish', type: 'navigate', target: '/projects' },
        { label: '📝 Shunday loyiha buyurtma qilish', type: 'modal' },
      ],
    }
  }

  // 5. Office, Location, Contact, Telegram, Phone
  if (
    lower.includes('manzil') || lower.includes('ofis') || lower.includes('aloqa') || lower.includes('telefon') || lower.includes('qayerda') || lower.includes('kontakt') || lower.includes('telegram') ||
    lower.includes('где') || lower.includes('адрес') || lower.includes('офис') || lower.includes('контакт') || lower.includes('телефон') || lower.includes('связаться') ||
    lower.includes('where') || lower.includes('address') || lower.includes('office') || lower.includes('contact') || lower.includes('phone') || lower.includes('call')
  ) {
    if (lang === 'ru') {
      return {
        text: 'Контакты и главный офис GME Technologies:\n\n📍 Адрес: г. Самарканд, ул. Ибн Сино 17а\n🕒 Режим работы: Пн–Сб, 09:00 – 22:00\n📞 Телефон: +998 91 313 11 54\n✈️ Telegram: @gme_technologies\n✉️ Email: info@gmetech.uz\n\nМы всегда рады личным встречам в офисе за чашкой кофе!',
        actions: [
          { label: '📞 Позвонить', type: 'link', target: 'tel:+998913131154' },
          { label: '✈️ Открыть Telegram', type: 'link', target: 'https://t.me/gme_technologies' },
          { label: '↗️ Страница контактов', type: 'navigate', target: '/contact' },
        ],
      }
    }
    if (lang === 'en') {
      return {
        text: 'GME Technologies Contact Details & HQ:\n\n📍 Address: 17a Ibn Sino Str., Samarkand\n🕒 Hours: Monday – Saturday, 09:00 – 22:00\n📞 Phone: +998 91 313 11 54\n✈️ Telegram: @gme_technologies\n✉️ Email: info@gmetech.uz\n\nOur doors are always open for in-person meetings at our Samarkand office!',
        actions: [
          { label: '📞 Call Now', type: 'link', target: 'tel:+998913131154' },
          { label: '✈️ Open Telegram', type: 'link', target: 'https://t.me/gme_technologies' },
          { label: '↗️ Contact Page', type: 'navigate', target: '/contact' },
        ],
      }
    }
    return {
      text: 'GME Technologies bosh ofisi va aloqa ma’lumotlari:\n\n📍 Manzil: Samarqand shahri, Ibn Sino ko‘chasi 17a\n🕒 Ish vaqti: Dushanba – Shanba, 09:00 – 22:00\n📞 Telefon: +998 91 313 11 54\n✈️ Telegram: @gme_technologies\n✉️ Email: info@gmetech.uz\n\nOfisimizga kelib, loyihangizni bir chashka qahva ustida batafsil rejalashtirishimiz mumkin!',
      actions: [
        { label: '📞 Qo‘ng‘iroq qilish', type: 'link', target: 'tel:+998913131154' },
        { label: '✈️ Telegramda yozish', type: 'link', target: 'https://t.me/gme_technologies' },
        { label: '↗️ Aloqa sahifasi', type: 'navigate', target: '/contact' },
      ],
    }
  }

  // 6. Code ownership & guarantee
  if (
    lower.includes('kafolat') || lower.includes('kod') || lower.includes('huquq') || lower.includes('shartnoma') ||
    lower.includes('гарант') || lower.includes('код') || lower.includes('договор') || lower.includes('собственност') ||
    lower.includes('guarantee') || lower.includes('code') || lower.includes('ownership') || lower.includes('contract')
  ) {
    if (lang === 'ru') {
      return {
        text: 'Наши железные принципы надежности:\n\n• 100% владение кодом: весь исходный код, базы данных и доступы к серверам передаются заказчику.\n• Официальный договор с четкими этапами и критериями приемки.\n• Техническая поддержка и гарантийное сопровождение после релиза.',
        actions: [{ label: '📝 Начать сотрудничество', type: 'modal' }],
      }
    }
    if (lang === 'en') {
      return {
        text: 'Our core reliability guarantees:\n\n• 100% Code Ownership: all source repositories, databases, and credentials belong entirely to you.\n• Formal contract with verified deliverables and milestones.\n• Post-launch technical warranty and maintenance support.',
        actions: [{ label: '📝 Start Project', type: 'modal' }],
      }
    }
    return {
      text: 'Bizning ishonchli tamoyillarimiz va kafolatlar:\n\n• 100% mulk huquqi: butun manba kodi (Git), ma’lumotlar bazasi va server hisoblari buyurtmachiga to‘liq topshiriladi.\n• Rasmiy shartnoma tuzilib, har bir bosqich qabul qilingach to‘lanadi.\n• Ishga tushirilgandan keyin ham kafolatli texnik ko‘mak va rivojlantirish.',
      actions: [{ label: '📝 Hamkorlikni boshlash', type: 'modal' }],
    }
  }

  // 7. Greeting
  if (
    lower.includes('salom') || lower.includes('assalom') || lower.includes('privet') || lower.includes('привет') ||
    lower.includes('здравствуй') || lower.includes('hello') || lower.includes('hi') || lower.includes('hey')
  ) {
    if (lang === 'ru') {
      return {
        text: 'Приветствую! Чем могу помочь вам сегодня? Вы можете спросить о наших услугах, стоимости разработки, сроках или оставить заявку на проект.',
        actions: [
          { label: '🛠 Услуги', type: 'navigate', target: '/services' },
          { label: '📝 Оставить заявку', type: 'modal' },
        ],
      }
    }
    if (lang === 'en') {
      return {
        text: 'Hello! How can I assist you today? Feel free to ask about our software engineering services, pricing, project timelines, or submit a proposal.',
        actions: [
          { label: '🛠 Services', type: 'navigate', target: '/services' },
          { label: '📝 Request Quote', type: 'modal' },
        ],
      }
    }
    return {
      text: 'Assalomu alaykum! Sizga qanday yordam bera olaman? Bizning IT-xizmatlarimiz, ishlab chiqish narxlari, muddatlari haqida so‘rashingiz yoki to‘g‘ridan-to‘g‘ri ariza qoldirishingiz mumkin.',
      actions: [
        { label: '🛠 Xizmatlar', type: 'navigate', target: '/services' },
        { label: '📝 Ariza qoldirish', type: 'modal' },
      ],
    }
  }

  // Fallback
  if (lang === 'ru') {
    return {
      text: 'Спасибо за вопрос! Чтобы детальнее обсудить вашу задачу или получить точную оценку стоимости и сроков, рекомендуем оставить короткую заявку или написать нам напрямую в Telegram — мы ответим в течение 15 минут.',
      actions: [
        { label: '📝 Оставить заявку', type: 'modal' },
        { label: '✈️ Написать в Telegram', type: 'link', target: 'https://t.me/gme_technologies' },
      ],
    }
  }
  if (lang === 'en') {
    return {
      text: 'Thank you for reaching out! To discuss your specific project goals or receive a custom estimate and technical architecture plan, you can leave a request or reach out directly on Telegram — our team will reply within 15 minutes.',
      actions: [
        { label: '📝 Leave a Request', type: 'modal' },
        { label: '✈️ Chat on Telegram', type: 'link', target: 'https://t.me/gme_technologies' },
      ],
    }
  }
  return {
    text: 'Savolingiz uchun tashakkur! Loyihangiz talablari va rejasini batafsil tahlil qilish uchun quyidagi tugma orqali ariza qoldirishingiz yoki to‘g‘ridan-to‘g‘ri Telegram orqali mutaxassisimizga yozishingiz mumkin — 15 daqiqa ichida javob beramiz.',
    actions: [
      { label: '📝 Ariza qoldirish', type: 'modal' },
      { label: '✈️ Telegramda yozish', type: 'link', target: 'https://t.me/gme_technologies' },
    ],
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function sendMessage(text?: string) {
  const content = (text ?? inputText.value).trim()
  if (!content || isTyping.value) return

  // User message
  messages.value.push({
    id: `user-${Date.now()}`,
    sender: 'user',
    text: content,
    time: getCurrentTime(),
  })

  inputText.value = ''
  isTyping.value = true
  scrollToBottom()

  // Simulate AI thinking and typing delay
  setTimeout(() => {
    const response = generateAiResponse(content)
    messages.value.push({
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: response.text,
      time: getCurrentTime(),
      actions: response.actions,
    })
    isTyping.value = false
    scrollToBottom()
  }, 650)
}

function handleAction(action: ActionButton) {
  if (action.type === 'modal') {
    openLeadModal()
  } else if (action.type === 'navigate' && action.target) {
    router.push(action.target)
    isOpen.value = false
  } else if (action.type === 'link' && action.target) {
    window.open(action.target, '_blank', 'noopener,noreferrer')
  }
}

function resetChat() {
  messages.value = [getInitialBotMessage()]
  scrollToBottom()
}

function toggleChat() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    showTeaser.value = false
    teaserDismissed.value = true
    if (messages.value.length === 0) {
      messages.value.push(getInitialBotMessage())
    }
    scrollToBottom()
  }
}

function dismissTeaser(e: Event) {
  e.stopPropagation()
  showTeaser.value = false
  teaserDismissed.value = true
}

// Watch language changes to reset greeting if empty
watch(currentLang, () => {
  if (messages.value.length <= 1) {
    messages.value = [getInitialBotMessage()]
  }
})

onMounted(() => {
  messages.value = [getInitialBotMessage()]
  // Show polite teaser after 2.5s if not opened
  setTimeout(() => {
    if (!isOpen.value && !teaserDismissed.value) {
      showTeaser.value = true
    }
  }, 2500)
})
</script>

<template>
  <div class="ai-widget-wrapper">
    <!-- Teaser Bubble -->
    <transition name="fade-slide">
      <div
        v-if="showTeaser && !isOpen"
        class="ai-teaser-bubble"
        @click="toggleChat"
      >
        <div class="teaser-avatar">🤖</div>
        <div class="teaser-content">
          <p class="teaser-title">
            {{ currentLang === 'ru' ? 'GME AI Ассистент' : currentLang === 'en' ? 'GME AI Assistant' : 'GME AI Assistent' }}
          </p>
          <p class="teaser-sub">
            {{ currentLang === 'ru' ? 'Чем могу помочь по проекту?' : currentLang === 'en' ? 'Need help with your project?' : 'Loyihangiz bo‘yicha savol bormi?' }}
          </p>
        </div>
        <button
          class="teaser-close"
          aria-label="Yopish"
          @click="dismissTeaser"
        >
          ✕
        </button>
      </div>
    </transition>

    <!-- Floating Action Button -->
    <button
      class="ai-fab-btn"
      :class="{ 'ai-fab-btn--active': isOpen }"
      :aria-label="isOpen ? 'Chatni yopish' : 'AI assistent bilan suhbat'"
      @click="toggleChat"
    >
      <span class="ai-fab-glow"></span>
      <span class="ai-fab-icon-wrap">
        <svg
          v-if="!isOpen"
          class="ai-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <!-- Robot / AI spark chat icon -->
          <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
          <rect x="4" y="8" width="16" height="12" rx="4" />
          <circle cx="9" cy="13" r="1.5" fill="currentColor" />
          <circle cx="15" cy="13" r="1.5" fill="currentColor" />
          <path d="M10 17h4" />
          <path d="M2 13h2" />
          <path d="M20 13h2" />
        </svg>
        <svg
          v-else
          class="ai-close-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </span>
      <span v-if="!isOpen" class="ai-online-pulse"></span>
    </button>

    <!-- Chat Popup Window -->
    <transition name="chat-window">
      <div v-if="isOpen" class="ai-chat-window" role="dialog" aria-label="AI Chatbot">
        <!-- Header -->
        <div class="chat-header">
          <div class="chat-header-user">
            <div class="bot-avatar">
              <span class="bot-avatar-icon">✦</span>
              <span class="bot-status-dot"></span>
            </div>
            <div class="bot-meta">
              <div class="bot-title-row">
                <h3 class="bot-name">GME AI Assistent</h3>
                <span class="bot-badge">24/7 AI</span>
              </div>
              <p class="bot-sub">
                {{ currentLang === 'ru' ? 'Онлайн • Мгновенные ответы' : currentLang === 'en' ? 'Online • Instant Answers' : 'Onlayn • Tezkor javoblar' }}
              </p>
            </div>
          </div>
          <div class="chat-header-actions">
            <button
              class="header-btn"
              :title="currentLang === 'ru' ? 'Сбросить чат' : currentLang === 'en' ? 'Reset chat' : 'Chatni tozalash'"
              @click="resetChat"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
            <button
              class="header-btn"
              :title="currentLang === 'ru' ? 'Закрыть' : currentLang === 'en' ? 'Close' : 'Yopish'"
              @click="isOpen = false"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.5" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div ref="messagesContainer" class="chat-messages">
          <!-- Suggestion Chips at start -->
          <div class="chat-suggestions-box">
            <span class="suggestions-label">
              {{ currentLang === 'ru' ? '💡 Быстрые вопросы:' : currentLang === 'en' ? '💡 Popular questions:' : '💡 Tezkor savollar:' }}
            </span>
            <div class="suggestions-list">
              <button
                v-for="sug in suggestions"
                :key="sug.id"
                class="suggestion-chip"
                @click="sendMessage(sug.label.replace(/^[^\s]+\s/, ''))"
              >
                {{ sug.label }}
              </button>
            </div>
          </div>

          <!-- Message Bubbles -->
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="message-row"
            :class="`message-row--${msg.sender}`"
          >
            <div v-if="msg.sender === 'bot'" class="msg-avatar">
              ✦
            </div>
            <div class="message-bubble" :class="`bubble--${msg.sender}`">
              <div class="bubble-text">{{ msg.text }}</div>

              <!-- Action buttons inside bot response -->
              <div v-if="msg.actions && msg.actions.length" class="bubble-actions">
                <button
                  v-for="(act, i) in msg.actions"
                  :key="i"
                  class="action-btn"
                  @click="handleAction(act)"
                >
                  {{ act.label }}
                </button>
              </div>

              <span class="bubble-time">{{ msg.time }}</span>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="message-row message-row--bot">
            <div class="msg-avatar">✦</div>
            <div class="message-bubble bubble--bot bubble-typing">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </div>
        </div>

        <!-- Input Bar -->
        <form class="chat-input-bar" @submit.prevent="sendMessage()">
          <input
            v-model="inputText"
            type="text"
            class="chat-input"
            :placeholder="currentLang === 'ru' ? 'Задайте вопрос о разработке...' : currentLang === 'en' ? 'Ask anything about your project...' : 'Loyihangiz bo‘yicha savol bering...'"
            maxlength="400"
            :disabled="isTyping"
          />
          <button
            type="submit"
            class="chat-send-btn"
            :disabled="!inputText.trim() || isTyping"
            aria-label="Yuborish"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>

        <!-- Footer Note -->
        <div class="chat-footer-note">
          <span>Powered by <strong>GME Engineering AI</strong></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.ai-widget-wrapper {
  position: fixed;
  bottom: 1.75rem;
  right: 1.75rem;
  z-index: 120;
  font-family: var(--font-sans);
}

/* ─── Floating Action Button ────────────────────────────────────────────── */
.ai-fab-btn {
  position: relative;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0B0F14 0%, #1a232e 100%);
  border: 2px solid var(--color-accent);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 28px rgba(255, 90, 31, 0.35), 0 4px 12px rgba(11, 15, 20, 0.5);
  transition: transform 0.25s var(--ease-out), box-shadow 0.25s var(--ease-out);
  padding: 0;
}

.ai-fab-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 10px 34px rgba(255, 90, 31, 0.5), 0 6px 16px rgba(11, 15, 20, 0.6);
}

.ai-fab-btn:active {
  transform: scale(0.96);
}

.ai-fab-btn--active {
  background: var(--color-ink);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 6px 20px rgba(11, 15, 20, 0.4);
}

.ai-fab-icon-wrap {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-icon {
  width: 26px;
  height: 26px;
  color: var(--color-accent);
}

.ai-close-icon {
  width: 22px;
  height: 22px;
  color: #ffffff;
}

.ai-online-pulse {
  position: absolute;
  top: 1px;
  right: 1px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #10B981;
  border: 2.5px solid #0B0F14;
}

.ai-online-pulse::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: #10B981;
  opacity: 0.6;
  animation: pulse-ring 2s infinite ease-out;
}

@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0; }
}

/* ─── Teaser Bubble ──────────────────────────────────────────────────────── */
.ai-teaser-bubble {
  position: absolute;
  bottom: 72px;
  right: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(11, 15, 20, 0.16);
  cursor: pointer;
  white-space: nowrap;
  animation: bounce-subtle 4s infinite ease-in-out;
}

.teaser-avatar {
  font-size: 1.25rem;
}

.teaser-content {
  display: flex;
  flex-direction: column;
}

.teaser-title {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-ink);
  line-height: 1.2;
}

.teaser-sub {
  font-size: 0.75rem;
  color: var(--color-muted);
  line-height: 1.2;
  margin-top: 2px;
}

.teaser-close {
  background: none;
  border: none;
  font-size: 0.75rem;
  color: var(--color-muted);
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
}

.teaser-close:hover {
  color: var(--color-ink);
  background: var(--color-paper);
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* ─── Chat Window ───────────────────────────────────────────────────────── */
.ai-chat-window {
  position: absolute;
  bottom: 72px;
  right: 0;
  width: clamp(320px, 92vw, 390px);
  height: clamp(480px, 75vh, 600px);
  background: #0B0F14;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 90, 31, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.125rem;
  background: #111820;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.chat-header-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bot-avatar {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(255, 90, 31, 0.2) 0%, rgba(255, 90, 31, 0.05) 100%);
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.bot-status-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #10B981;
  border: 2px solid #111820;
}

.bot-meta {
  display: flex;
  flex-direction: column;
}

.bot-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bot-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
}

.bot-badge {
  font-size: 0.625rem;
  font-weight: 800;
  background: rgba(255, 90, 31, 0.18);
  color: var(--color-accent);
  padding: 1px 6px;
  border-radius: 100px;
  letter-spacing: 0.04em;
  border: 1px solid rgba(255, 90, 31, 0.3);
}

.bot-sub {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
}

.chat-header-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.header-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  padding: 0.35rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.header-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

/* Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #0B0F14;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}
.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
}

/* Suggestions */
.chat-suggestions-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.suggestions-label {
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.suggestion-chip {
  background: #141B22;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
  padding: 0.35rem 0.65rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.suggestion-chip:hover {
  background: rgba(255, 90, 31, 0.15);
  border-color: var(--color-accent);
  color: #ffffff;
  transform: translateY(-1px);
}

/* Message rows */
.message-row {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.message-row--user {
  justify-content: flex-end;
}

.msg-avatar {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--color-accent);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  flex-shrink: 0;
  margin-bottom: 2px;
}

.message-bubble {
  max-width: 82%;
  padding: 0.75rem 0.95rem;
  border-radius: 14px;
  font-size: 0.84375rem;
  line-height: 1.55;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  white-space: pre-line;
  word-break: break-word;
}

.bubble--bot {
  background: #171F28;
  color: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom-left-radius: 3px;
}

.bubble--user {
  background: var(--color-accent);
  color: #ffffff;
  border-bottom-right-radius: 3px;
}

.bubble-time {
  align-self: flex-end;
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.45);
  margin-top: -2px;
}

.bubble--user .bubble-time {
  color: rgba(255, 255, 255, 0.75);
}

/* Actions in bot bubble */
.bubble-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.25rem;
}

.action-btn {
  background: #0B0F14;
  border: 1px solid var(--color-accent);
  color: #ffffff;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
}

.action-btn:hover {
  background: var(--color-accent);
  color: #ffffff;
}

/* Typing animation */
.bubble-typing {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 0.65rem 0.9rem;
}

.typing-dot {
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1.1); opacity: 1; }
}

/* Input Bar */
.chat-input-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0.875rem;
  background: #111820;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.chat-input {
  flex: 1;
  background: #171F28;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 0.8125rem;
  font-family: inherit;
  padding: 0.6rem 0.875rem;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: var(--color-accent);
}

.chat-input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.chat-send-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--color-accent);
  border: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  flex-shrink: 0;
}

.chat-send-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.chat-send-btn:not(:disabled):hover {
  transform: scale(1.05);
}

/* Footer note */
.chat-footer-note {
  padding: 0.35rem 0.75rem;
  background: #0E1318;
  text-align: center;
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.35);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.chat-footer-note strong {
  color: rgba(255, 255, 255, 0.6);
}

/* ─── Transitions ───────────────────────────────────────────────────────── */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.chat-window-enter-active,
.chat-window-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.chat-window-enter-from,
.chat-window-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

/* ─── Mobile Responsiveness ────────────────────────────────────────────── */
@media (max-width: 640px) {
  .ai-teaser-bubble {
    display: none !important;
  }
}

@media (max-width: 480px) {
  .ai-widget-wrapper {
    bottom: 1rem;
    right: 1rem;
  }

  .ai-fab-btn {
    width: 50px;
    height: 50px;
  }

  .ai-chat-window {
    position: fixed;
    inset: auto 10px 70px 10px;
    width: auto;
    max-width: none;
    height: min(540px, calc(100dvh - 84px));
    border-radius: 14px;
  }

  .chat-input {
    font-size: 16px !important;
  }
}
</style>
