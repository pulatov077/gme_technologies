import type { Testimonial } from '@/types'

export const testimonials: Testimonial[] = [
  {
    id: 'shukrona-water',
    placeholder: false,
    personName: 'Davlat aka',
    personRole: 'Direktor',
    company: 'Shukrona Zam Zam Suvlari',
    quote:
      '«Ilgari suv yetkazib berish va hisob-kitoblar qo‘lda yuritilib, buyurtmalarda noaniqliklar bo‘lardi. GME Technologies jamoasi qisqa fursatda qulay Telegram bot va kuryerlarimiz uchun Mini App ishlab chiqib berdi. Hozir barcha jarayonlar va kunlik moliya to‘liq avtomatlashgan, ish unumdorligimiz ancha oshdi.»',
    videoUrl: null,
    translations: {
      ru: {
        personRole: 'Директор',
        quote:
          '«Раньше доставка воды и учет велись вручную, случались задержки и неточности. Команда GME Technologies оперативно разработала удобный Telegram-бот и Mini App для наших курьеров. Сейчас все заказы и финансовый учет полностью автоматизированы.»',
      },
      en: {
        personRole: 'Director',
        quote:
          '«Previously, water delivery logistics and accounting were managed manually, leading to delays. The GME Technologies team swiftly built a convenient Telegram bot and Mini App for our couriers. Today, all orders and daily finances are fully automated.»',
      },
    },
  },
  {
    id: 'mun-caravan',
    placeholder: false,
    personName: 'Javohir Alimov',
    personRole: 'Ijrochi direktor',
    company: 'MUN Caravan',
    quote:
      '«GME Technologies bilan ishlash biz kutgandek juda samarali kechdi. Jamoaning muhandislik yondashuvi va mas’uliyati yuqori — xalqaro Model BMT loyihamiz uchun veb-platformani belgilangan muddatda, zamonaviy dizayn va qulay interfeys bilan sifatli topshirishdi. O‘z ishining ustalari bilan ishlaganimizdan mamnunmiz.»',
    videoUrl: null,
    translations: {
      ru: {
        personRole: 'Исполнительный директор',
        quote:
          '«Сотрудничество с GME Technologies получилось действительно продуктивным. У ребят сильная инженерная культура и ответственный подход — платформу для нашего международного проекта Модели ООН реализовали точно в срок, с продуманным дизайном и удобным интерфейсом.»',
      },
      en: {
        personRole: 'Executive Director',
        quote:
          '«Collaborating with GME Technologies was truly productive. The team demonstrated strong engineering capabilities and high accountability — delivering our international Model UN platform on schedule, with a modern design and seamless interface.»',
      },
    },
  },
]
