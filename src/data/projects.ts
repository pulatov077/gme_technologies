import type { Project, Locale } from '@/types'

export const projects: Project[] = [
  {
    slug: 'orzu-learning-platform',
    placeholder: false,
    title: 'ORZU — IELTS & SAT Imtihonlariga Tayyorgarlik O‘quv Platformasi',
    client: 'ORZU — The Dream Project',
    industry: 'EdTech & Ta’lim',
    year: 2025,
    services: [
      'Veb-platforma',
      'EdTech tizimi',
      'UI/UX Dizayn',
      'Mock-testlar & Tahlil',
    ],
    shortDesc:
      'IELTS va SAT xalqaro imtihonlariga tayyorlanayotgan yoshlar uchun mentorlik ko‘magi, shaxsiy o‘quv rejasi va real vaqt progress tahlilini taqdim etuvchi zamonaviy EdTech platformasi (boshlang‘ich MVP rejimi, 2 haftada ishlab chiqilgan).',
    challenge:
      'IELTS va SAT imtihonlariga tayyorgarlik ko‘rayotgan yoshlar uchun tizimli o‘quv yo‘nalishi, mentorlar bilan tezkor aloqa va insho (Writing) hamda gapirish (Speaking) bo‘yicha individual baholash yetishmas edi. Loyiha avgust oyida qabul qilinib, buyurtmachi tomonidan juda qisqa muddat — 2 hafta ichida platformaning boshlang‘ich ishchi MVP versiyasini foydalanuvchilarga taqdim etish vazifasi yuklatildi.',
    solution:
      'GME Technologies jamoasi tomonidan 2 hafta ichida ORZU platformasining boshlang‘ich funktsional MVP versiyasi ishlab chiqildi. Platformada DREAM Project metodologiyasi (Diagnose, Reinforce, Execute, Analyze, Master) asosida moslashuvchan o‘quv yo‘nalishlari, vaqt bilan chegaralangan mock-testlar, mentorlar taqrizi va real vaqt statistikasi interfeysi joriy etildi. Natijada yoshlar o‘z maqsadli ballari (IELTS Band 8.0+, SAT 1500+) sari tizimli tayyorgarlik ko‘rish imkoniga ega bo‘ldi.',
    results: [
      { label: 'Ishlab chiqish vaqti', value: '2 hafta' },
      { label: 'Qabul qilingan vaqti', value: 'Avgust oyi' },
      { label: 'Loyiha holati', value: 'Boshlang‘ich MVP' },
    ],
    techStack: [
      'Vue 3',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'PostgreSQL',
      'REST API',
    ],
    coverImage: '/images/projects/orzu/cover.png',
    gallery: [
      '/images/projects/orzu/cover.png',
      '/images/projects/orzu/features.png',
      '/images/projects/orzu/reviews.png',
      '/images/projects/orzu/dashboard.png',
      '/images/projects/orzu/progress.png',
      '/images/projects/orzu/courses.png',
    ],
    featured: true,
    galleryLayout: 'landscape',
    liveUrl: 'https://orzu-app.vercel.app',
    githubUrl: 'https://github.com/pulatov077/orzu-app',
    translations: {
      ru: {
        title: 'ORZU — Образовательная платформа подготовки к экзаменам IELTS и SAT',
        client: 'ORZU — The Dream Project',
        industry: 'EdTech и образование',
        services: [
          'Веб-платформа',
          'EdTech система',
          'UI/UX Дизайн',
          'Мок-тесты и аналитика',
        ],
        shortDesc:
          'Современная образовательная EdTech веб-платформа с менторской поддержкой, индивидуальными планами обучения и мониторингом прогресса для подготовки к экзаменам IELTS и SAT (стартовая MVP-версия, разработана за 2 недели).',
        challenge:
          'Студентам, готовящимся к сдаче IELTS и SAT, не хватало структурированной пошаговой программы обучения и оперативной экспертной обратной связи по письменным работам и разговорной части. Проект был принят в августе с требованием запустить полнофункциональную начальную MVP-версию всего за 2 недели.',
        solution:
          'Команда GME Technologies за 2 недели реализовала стартовую версию платформы ORZU на базе авторской методики DREAM Project (Diagnose, Reinforce, Execute, Analyze, Master). Были разработаны адаптивные учебные треки, тестовые модули с таймером, система менторских рецензий и детальный дашборд прогресса, помогающий учащимся достигать целевых баллов (IELTS 8.0+, SAT 1500+).',
        results: [
          { label: 'Срок разработки', value: '2 недели' },
          { label: 'Старт проекта', value: 'Август' },
          { label: 'Статус проекта', value: 'Стартовый MVP' },
        ],
      },
      en: {
        title: 'ORZU — IELTS & SAT Exam Preparation Learning Platform',
        client: 'ORZU — The Dream Project',
        industry: 'EdTech & Education',
        services: [
          'Web Platform',
          'EdTech System',
          'UI/UX Design',
          'Mock Tests & Analytics',
        ],
        shortDesc:
          'A structured EdTech web platform offering mentor-guided learning paths, timed mock tests, and real-time progress analytics for students preparing for IELTS and SAT exams (initial MVP stage, engineered in 2 weeks).',
        challenge:
          'Students preparing for high-stakes IELTS and SAT exams often struggle with unstructured resources and lack timely mentor feedback on essays and speaking modules. The project was commissioned in August with an ambitious requirement: deliver a responsive, ready-to-test initial MVP platform within a tight 2-week timeframe.',
        solution:
          'Within 2 weeks, GME Technologies engineered the functional initial MVP of the ORZU platform based on the DREAM Project methodology (Diagnose, Reinforce, Execute, Analyze, Master). The solution features adaptive lesson pathways, timed practice exams, mentor review workflows, and visual performance tracking dashboards guiding learners toward top scores (IELTS 8.0+, SAT 1500+).',
        results: [
          { label: 'Development time', value: '2 weeks' },
          { label: 'Initiated in', value: 'August' },
          { label: 'Project status', value: 'Initial MVP' },
        ],
      },
    },
  },
  {
    slug: 'shukrona-zam-zam-suvlari',
    placeholder: false,
    title: 'Shukrona Zam Zam Suvlari — Avtomatlashtirilgan Yetkazib Berish & Moliya Tizimi',
    client: 'Shukrona Zam Zam Suvlari',
    industry: 'Logistika & Savdo',
    year: 2025,
    services: [
      'Telegram Bot',
      'Telegram Mini App',
      'Moliya & CRM Tizimi',
      'Kuryerlar Boshqaruvi',
    ],
    shortDesc:
      'Suv yetkazib berish biznesi uchun to‘liq avtomatlashtirilgan Telegram bot, Mini App va moliya-analitika boshqaruv tizimi.',
    challenge:
      'Mijozlar buyurtmalarini qabul qilish, manzillarni Yandex Maps xaritasida aniqlash, kuryerlarga buyurtmalarni taqsimlash va har kungi sof foyda, tushum hamda xarajatlar hisob-kitobini yuritish jarayonlari qo‘lda bajarilib, vaqt yo‘qotishlari va noaniqliklar yuzaga kelayotgan edi.',
    solution:
      'GME Technologies jamoasi tomonidan mijozlar uchun qulay buyurtma beruvchi Telegram bot (@ShukronaZamZamSuvlari_bot) va rahbarlar/kuryerlar uchun zamonaviy Telegram Mini App (Web App) yaratildi. Tizim orqali buyurtmalar real vaqtda kuryerlarga biriktiriladi, Yandex xaritasi orqali aniq manzil ko‘rsatiladi, moliya paneli esa sof foyda, yalpi tushum, kuryerlar reytingi va xarajatlarni avtomatik hisoblab boradi.',
    results: [
      { label: 'Bajarilgan buyurtmalar', value: '1 100+' },
      { label: 'Qayta ishlash tezligi', value: '3x tezroq' },
      { label: 'Moliya shaffofligi', value: '100%' },
    ],
    techStack: [
      'Vue 3',
      'TypeScript',
      'Node.js',
      'Telegram Mini Apps API',
      'Yandex Maps API',
      'PostgreSQL',
    ],
    coverImage: '/images/projects/shukrona/cover.jpg',
    gallery: [
      '/images/projects/shukrona/cover.jpg',
      '/images/projects/shukrona/moliya.jpg',
      '/images/projects/shukrona/bot-interface.jpg',
      '/images/projects/shukrona/orders.jpg',
      '/images/projects/shukrona/couriers.jpg',
    ],
    featured: true,
    galleryLayout: 'portrait',
    botUrl: 'https://t.me/ShukronaZamZamSuvlari_bot',
    githubUrl: 'https://github.com/pulatov077/Shukrona-Suvlari-Bot',
    backendGithubUrl: 'https://github.com/azamatp047/shukrona-backend',
    translations: {
      ru: {
        title: 'Shukrona Zam Zam Water — Автоматизированная система доставки и финансового учета',
        client: 'Shukrona Zam Zam Water',
        industry: 'Логистика и торговля',
        services: [
          'Telegram-бот',
          'Telegram Mini App',
          'Система финансов и CRM',
          'Управление курьерами',
        ],
        shortDesc:
          'Полностью автоматизированный Telegram-бот, Mini App и аналитическая система управления финансами для службы доставки воды.',
        challenge:
          'Прием клиентских заказов, определение адресов на Яндекс Картах, распределение по курьерам и ежедневный расчет чистой прибыли, выручки и расходов велись вручную, вызывая задержки и неточности.',
        solution:
          'Команда GME Technologies разработала удобного Telegram-бота для заказов (@ShukronaZamZamSuvlari_bot) и современный Telegram Mini App (Web App) для руководства и курьеров. Заказы распределяются в реальном времени с точной навигацией по Яндекс Картам, а финансовая панель автоматически вычисляет чистую прибыль, валовую выручку, рейтинг курьеров и операционные расходы.',
        results: [
          { label: 'Выполненных заказов', value: '1 100+' },
          { label: 'Скорость обработки', value: 'В 3 раза быстрее' },
          { label: 'Прозрачность финансов', value: '100%' },
        ],
      },
      en: {
        title: 'Shukrona Zam Zam Water — Automated Delivery & Financial Control System',
        client: 'Shukrona Zam Zam Water',
        industry: 'Logistics & Trade',
        services: [
          'Telegram Bot',
          'Telegram Mini App',
          'Finance & CRM System',
          'Courier Management',
        ],
        shortDesc:
          'Fully automated Telegram bot, Mini App, and financial analytics management system for drinking water delivery.',
        challenge:
          'Handling incoming customer orders, locating delivery points on Yandex Maps, dispatching couriers, and balancing daily net profits, revenue, and expenses were done manually, resulting in delays, inaccuracies, and lost time.',
        solution:
          'GME Technologies engineered an intuitive ordering Telegram bot (@ShukronaZamZamSuvlari_bot) and an administrative Telegram Mini App (Web App). Orders are assigned to couriers in real time with precise Yandex Maps routing, while the financial dashboard automatically tracks net profits, gross revenue, courier rankings, and operational expenses.',
        results: [
          { label: 'Delivered orders', value: '1,100+' },
          { label: 'Processing speed', value: '3x faster' },
          { label: 'Financial transparency', value: '100%' },
        ],
      },
    },
  },
  {
    slug: 'mun-caravan',
    placeholder: false,
    title: 'MUN Caravan — Xalqaro Model BMT (MUN) Ekotizimi Veb-Platformasi',
    client: 'New Renaissance Builders',
    industry: 'Ta’lim & Xalqaro Diplomatiya',
    year: 2025,
    services: [
      'Veb-platforma',
      'UI/UX Dizayn',
      'Diplomatiya & Ta’lim',
      'Tadbirlar Ekotizimi',
    ],
    shortDesc:
      'Oddiy konferensiya tashkilotchisidan ko‘proq. New Renaissance Builders tashabbusi bo‘lib, Model Birlashgan Millatlar Tashkiloti (MUN) ekotizimini mustahkamlashga qaratilgan zamonaviy platforma. MUN Caravan jamoalar va dasturlarni rivojlantirish, konferensiyalarni qo‘llab-quvvatlash, ishtirokchilarni o‘qitish, institutsional asoslarni yaratish va tashkilotchilar o‘rtasida hamkorlik o‘rnatishning to‘liq siklini qamrab oladi.',
    challenge:
      'Model Birlashgan Millatlar Tashkiloti (MUN) tadbirlarini tashkil qilish, yosh delegatlarni tayyorlash dasturlari va xalqaro konferensiyalar o‘rtasida institutsional aloqalarni o‘rnatish jarayonlari tarqoq va samarasiz usullarda olib borilar edi. Tashabbus yetakchilari va ishtirokchilari uchun yagona, ishonchli va xalqaro standartlarga javob beradigan markazlashgan raqamli platforma zarur edi.',
    solution:
      'GME Technologies jamoasi tomonidan New Renaissance Builders uchun MUN Caravan veb-platformasi ishlab chiqildi. Platformada xalqaro diplomatiya ruhidagi nafis dizayn (Playfair Display va Deep Navy), konferensiyalar rejalashtiruvchisi, delegatlar tayyorlash modullari, qo‘mitalar faoliyati va tashkiliy tuzilmalar o‘rtasidagi aloqalarni yagona interfeysda birlashtiruvchi zamonaviy arxitektura yaratildi.',
    results: [
      { label: 'Ekotizim qamrovi', value: 'To‘liq sikl' },
      { label: 'Platforma holati', value: 'Jonli (Production)' },
      { label: 'Xalqaro standart', value: '100% MUN' },
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vercel'],
    coverImage: '/images/projects/muncaravan/cover.png',
    gallery: ['/images/projects/muncaravan/cover.png'],
    galleryLayout: 'landscape',
    featured: true,
    liveUrl: 'https://mun-caravan-seven.vercel.app/',
    githubUrl: 'https://github.com/wilsonlorean/MUN-Caravan',
    translations: {
      ru: {
        title: 'MUN Caravan — Образовательная веб-платформа экосистемы Модели ООН',
        client: 'New Renaissance Builders',
        industry: 'Образование и международная дипломатия',
        services: [
          'Веб-платформа',
          'UI/UX Дизайн',
          'Дипломатия и образование',
          'Экосистема мероприятий',
        ],
        shortDesc:
          'Больше, чем просто организатор конференций. Инициатива New Renaissance Builders, направленная на развитие и укрепление экосистемы Модели ООН (MUN). MUN Caravan охватывает полный жизненный цикл инициатив: от формирования команд и учебных программ до поддержки конференций, подготовки делегатов, создания институциональной базы и объединения организаторов.',
        challenge:
          'Организация конференций Модели ООН, подготовка команд делегатов и взаимодействие между организаторами саммитов велись разрозненно. Сообществу требовалась единая централизованная веб-платформа для координации комитетов, образовательных программ, аккредитации и международного партнерства.',
        solution:
          'Команда GME Technologies разработала веб-платформу MUN Caravan для инициативы New Renaissance Builders. Платформа объединяет календарь международных саммитов, модули подготовки делегатов, координацию комитетов и институциональные связи в едином элегантном цифровом пространстве.',
        results: [
          { label: 'Охват инициатив', value: 'Полный цикл' },
          { label: 'Статус платформы', value: 'Production' },
          { label: 'Стандарты ООН', value: '100% MUN' },
        ],
      },
      en: {
        title: 'MUN Caravan — Model United Nations Ecosystem Platform',
        client: 'New Renaissance Builders',
        industry: 'Education & International Diplomacy',
        services: [
          'Web Platform',
          'UI/UX Design',
          'Diplomacy & Education',
          'Event Ecosystem',
        ],
        shortDesc:
          'More than a conference organizer. An initiative of New Renaissance Builders focused on strengthening the Model United Nations ecosystem. MUN Caravan works across the full lifecycle of MUN initiatives — from developing teams and programs to supporting conferences, training participants, building institutional frameworks, and creating connections between organizers.',
        challenge:
          'Organizing Model United Nations initiatives, training delegate cohorts, and establishing formal institutional connections across conferences were fragmented. Organizers and participants lacked a unified digital home to coordinate programs, access standardized frameworks, and scale diplomatic leadership initiatives.',
        solution:
          'GME Technologies engineered the MUN Caravan web platform for New Renaissance Builders. The platform unites international summit scheduling, delegate training modules, committee coordination, and institutional networking within a distinguished, high-performance web experience.',
        results: [
          { label: 'Ecosystem Scope', value: 'Full Lifecycle' },
          { label: 'Platform Status', value: 'Live Production' },
          { label: 'Global Standards', value: '100% MUN' },
        ],
      },
    },
  },
  {
    slug: 'zukkopay',
    placeholder: false,
    title: 'ZukkoPay — Maktab O‘quvchilari Uchun Gamifikatsiya & Rag‘batlantirish Platformasi',
    client: 'ZukkoPay Startup (LaunchLab, School 21)',
    industry: 'EdTech & FinTech',
    year: 2026,
    services: [
      'Veb-platforma',
      'Gamifikatsiya',
      'Kundalik.com Integratsiyasi',
      'FinTech & NFT Pass',
      'Demo MVP',
    ],
    shortDesc:
      'Maktab o‘quvchilarining darslarga qiziqishi va davomatini oshirish uchun ZukkoCoin (ZP) mukofotlash tizimi, ota-onalar monitoringi va o‘quv kurslari jamlangan startap platformasi (Demo MVP).',
    challenge:
      'Maktablarda o‘quvchilarning darslarga e’tiborsizligi, dars qoldirish (past davomat) holatlari ko‘paygani va o‘rganishga bo‘lgan ichki motivatsiyaning pasayganligi dolzarb muammo edi. Shu bilan birga, ota-onalar farzandlarining maktabga borgan-bormaganligini va darslardagi kundalik o‘zlashtirishini real vaqtda kuzatib borishda noqulayliklarga duch kelayotgan edi.',
    solution:
      'Samarqanddagi School 21 binosida o‘tkazilgan LaunchLab akseleratori doirasida ZukkoPay startapining to‘liq ishchi Demo MVP versiyasi ishlab chiqildi. Platformada har bir o‘quvchi o‘zining darsdagi yuqori baholari, topshirgan testlari (quizlar) va 100% davomati uchun ZukkoCoin (ZP) virtual tangalari bilan taqdirlanadi. Kundalik.com tizimi bilan integratsiya orqali ota-onalar farzand davomati va baholarini onlayn nazorat qilib boradi. To‘plangan tangalarni o‘quvchilar maktab formasi vaucherlari, do‘kon/oshxona chegirmalari hamda dasturlash (Python, Frontend, Kiberxavfsizlik) va moliya savodxonligi kurslariga almashtirishlari mumkin.',
    results: [
      { label: 'Loyiha holati', value: 'Demo MVP' },
      { label: 'Akselerator', value: 'LaunchLab School 21' },
      { label: 'Ishlab chiqilgan vaqt', value: 'Mart, 2026' },
    ],
    techStack: [
      'Vue 3',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'PostgreSQL',
      'Kundalik API',
      'QR Payment API',
    ],
    coverImage: '/images/projects/zukkopay/cover.jpg',
    gallery: [
      '/images/projects/zukkopay/cover.jpg',
      '/images/projects/zukkopay/dashboard.png',
      '/images/projects/zukkopay/courses.png',
      '/images/projects/zukkopay/quiz-quest.png',
      '/images/projects/zukkopay/wallet-card.png',
    ],
    featured: false,
    galleryLayout: 'portrait',
    githubUrl: 'https://github.com/pulatov077/zukkopay',
    translations: {
      ru: {
        title: 'ZukkoPay — Платформа геймификации и поощрения школьников',
        client: 'ZukkoPay Startup (LaunchLab, School 21)',
        industry: 'EdTech & FinTech',
        services: [
          'Веб-платформа',
          'Геймификация',
          'Интеграция с Kundalik.com',
          'FinTech & NFT Pass',
          'Demo MVP',
        ],
        shortDesc:
          'Стартап-платформа с системой поощрения ZukkoCoin (ZP), родительским контролем и учебными курсами для повышения посещаемости и интереса к учебе (Demo MVP).',
        challenge:
          'Невнимательность учащихся на уроках, частые пропуски занятий и снижение внутренней мотивации к учебе стали острой проблемой. При этом родителям не хватало удобного инструмента для отслеживания посещаемости и текущих оценок в реальном времени.',
        solution:
          'В рамках акселератора LaunchLab в кампусе School 21 в Самарканде была создана полнофункциональная версия Demo MVP стартапа ZukkoPay. За отличные оценки, тесты и 100% посещаемость ученики получают токены ZukkoCoin (ZP). Интеграция с Kundalik.com позволяет родителям контролировать учебу, а накопленные баллы школьники могут обменивать на школьные ваучеры, скидки в столовой и курсы программирования (Python, Frontend, кибербезопасность).',
        results: [
          { label: 'Статус проекта', value: 'Demo MVP' },
          { label: 'Акселератор', value: 'LaunchLab School 21' },
          { label: 'Период разработки', value: 'Март, 2026' },
        ],
      },
      en: {
        title: 'ZukkoPay — Gamification & Reward Platform for School Students',
        client: 'ZukkoPay Startup (LaunchLab, School 21)',
        industry: 'EdTech & FinTech',
        services: [
          'Web Platform',
          'Gamification',
          'Kundalik.com Integration',
          'FinTech & NFT Pass',
          'Demo MVP',
        ],
        shortDesc:
          'Startup platform featuring ZukkoCoin (ZP) rewards, parental monitoring, and educational courses designed to boost student engagement and attendance (Demo MVP).',
        challenge:
          'Declining student attention, rising absenteeism, and lack of intrinsic motivation in schools represented a severe challenge. Concurrently, parents struggled to monitor daily school attendance and real-time academic progress easily.',
        solution:
          'Developed during the LaunchLab accelerator at School 21 Samarkand, a complete functional Demo MVP of ZukkoPay was built. Students earn ZukkoCoin (ZP) virtual tokens for excellent grades, passed quizzes, and 100% attendance. Kundalik.com integration empowers parents with real-time academic monitoring. Earned tokens can be redeemed for school uniform vouchers, cafeteria discounts, and IT courses (Python, Frontend, Cyber Security).',
        results: [
          { label: 'Project status', value: 'Demo MVP' },
          { label: 'Accelerator', value: 'LaunchLab School 21' },
          { label: 'Completed in', value: 'March, 2026' },
        ],
      },
    },
  },
]

export function getLocalizedProject(project: Project, locale: Locale | string): Project {
  const lang = (locale || 'uz') as Locale
  if (lang === 'uz' || !project.translations?.[lang]) {
    return project
  }
  const tr = project.translations[lang]!
  return {
    ...project,
    title: tr.title ?? project.title,
    client: tr.client ?? project.client,
    industry: tr.industry ?? project.industry,
    services: tr.services ?? project.services,
    shortDesc: tr.shortDesc ?? project.shortDesc,
    challenge: tr.challenge ?? project.challenge,
    solution: tr.solution ?? project.solution,
    results: tr.results ?? project.results,
  }
}
