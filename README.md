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

# Supabase (Ma'lumotlar bazasi)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

*Eslatma: Agar `VITE_API_URL` ko‘rsatilmasa, ishlab chiqish rejimida (dev mode) ariza ma’lumotlari brauzer konsoliga chiqariladi va muvaffaqiyatli topshirilgan holati ko‘rsatiladi.*
