# GME Technologies — Rasmiy Veb-sayti

Samarqanddagi IT kompaniyasi uchun korporativ veb-sayt.

- **Stack:** Vue 3 (Composition API, `<script setup>`), TypeScript, Vite, Vue Router, vue-i18n, Tailwind CSS (v4 via `@tailwindcss/vite`).
- **Dizayn tamoyillari:** Arxitekturaviy, qat’iy 12 ustunli to‘r, Manrope shrifti, qora (`#0B0F14`) va iliq qog‘oz (`#F4F2EE`), signal zarg‘aldoq (`#FF5A1F`) aksent.

---

## Ishga tushirish (Development)

```bash
# Paketlarni o‘rnatish
npm install

# Mahalliy serverni ishga tushirish
npm run dev
```

Mahalliy server odatda `http://localhost:5173` manzilida ishlaydi.

---

## Loyihani yig‘ish (Production Build)

```bash
# TypeScript tekshiruvi va production build
npm run build

# Yig‘ilgan natijani ko‘rish
npm run preview
```

---

## Kodni tekshirish (Lint & Format)

```bash
# Linter (oxlint + eslint)
npm run lint

# Formatlash (prettier)
npm run format
```

---

## Muhit o‘zgaruvchilari (Environment Variables)

`.env.example` faylidan nusxa olib `.env` yarating:

```env
VITE_API_URL=https://api.gmetechnologies.uz
```

*Eslatma: Agar `VITE_API_URL` ko‘rsatilmasa, ishlab chiqish rejimida (dev mode) ariza ma’lumotlari brauzer konsoliga chiqariladi va muvaffaqiyatli topshirilgan holati ko‘rsatiladi.*

---

## TODO: Haqiqiy ma’lumotlarni kiritish

Barcha ma’lumotlar alohida typed fayllarga ajratilgan va `placeholder: true` belgisi qo‘yilgan:

1. **Loyihalar:** [`src/data/projects.ts`](src/data/projects.ts)
2. **Statistika raqamlari:** [`src/data/stats.ts`](src/data/stats.ts)
3. **Mijozlar fikrlari:** [`src/data/testimonials.ts`](src/data/testimonials.ts)
4. **Jamoa:** [`src/data/team.ts`](src/data/team.ts)
5. **Hamkorlar va Rezidentlik:** [`src/data/partners.ts`](src/data/partners.ts), [`src/data/residents.ts`](src/data/residents.ts)
6. **Bog‘lanish kontaktlari:** [`src/locales/uz.ts`](src/locales/uz.ts), [`src/locales/ru.ts`](src/locales/ru.ts), [`src/locales/en.ts`](src/locales/en.ts)
