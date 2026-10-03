<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionHeading from '@/components/SectionHeading.vue'
import LeadForm from '@/components/LeadForm.vue'

const { t } = useI18n()
</script>

<template>
  <div class="contact-page section-py">
    <div class="container">
      <SectionHeading
        label="ALOQA"
        :title="t('contact.title')"
        :subtitle="t('contact.subtitle')"
      />

      <div class="contact-layout">
        <!-- Contact Info & Map placeholder -->
        <div class="contact-info-col">
          <div class="contact-cards-grid">
            <!-- Phone -->
            <div class="contact-card">
              <span class="label text-accent">{{ t('contact.phone') }}</span>
              <a href="tel:+998000000000" class="contact-link">+998 00 000 00 00</a>
              <span class="contact-hint">Dush–Jum: 09:00–18:00</span>
            </div>

            <!-- Telegram -->
            <div class="contact-card">
              <span class="label text-accent">{{ t('contact.telegram') }}</span>
              <a href="https://t.me/gmetechnologies" target="_blank" rel="noopener noreferrer" class="contact-link">
                @gmetechnologies
              </a>
              <span class="contact-hint">Tezkor muloqot va savollar</span>
            </div>

            <!-- Email -->
            <div class="contact-card">
              <span class="label text-accent">{{ t('contact.email') }}</span>
              <a href="mailto:info@gmetech.uz" class="contact-link">
                info@gmetech.uz
              </a>
              <span class="contact-hint">Rasmiy takliflar va hisob-kitob</span>
            </div>

            <!-- Address -->
            <div class="contact-card">
              <span class="label text-accent">{{ t('contact.address') }}</span>
              <p class="contact-address-text">
                Samarqand shahri, Universitet xiyoboni ko‘chasi, 15-uy
              </p>
              <span class="contact-hint">Mo‘ljal: Samarqand Davlat Universiteti</span>
            </div>
          </div>

          <!-- Embedded Map Placeholder -->
          <div class="map-placeholder-box">
            <div class="map-placeholder-inner">
              <div class="map-crosshair"></div>
              <div class="map-content">
                <span class="label text-accent">OFIS XARITASI</span>
                <h4 class="h3 text-white">Samarqand ofisi</h4>
                <p class="text-map-sub">
                  Google Maps / Yandex Maps integratsiyasi — TODO (API kalit kiritilgach faollashadi)
                </p>
                <a
                  href="https://maps.google.com/?q=Samarkand"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn--outline btn--sm btn-map"
                >
                  {{ t('contact.map') }} ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Request Form -->
        <div class="contact-form-col">
          <div class="contact-form-wrapper">
            <div class="contact-form-heading">
              <h2 class="h2">{{ t('form.title') }}</h2>
              <p class="contact-form-desc">{{ t('form.subtitle') }}</p>
            </div>
            <LeadForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(3rem, 6vw, 5rem);
}

@media (min-width: 1024px) {
  .contact-layout {
    grid-template-columns: 6fr 6fr;
  }
}

.contact-cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .contact-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.contact-card {
  background: #ffffff;
  padding: 1.75rem;
  border: 1px solid var(--color-border-light);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-link {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-ink);
  text-decoration: none;
  transition: color var(--duration) var(--ease-out);
}

.contact-link:hover {
  color: var(--color-accent);
}

.contact-address-text {
  font-size: 0.9375rem;
  color: var(--color-ink);
  line-height: 1.4;
  font-weight: 600;
}

.contact-hint {
  font-size: 0.75rem;
  color: var(--color-muted);
}

.map-placeholder-box {
  margin-top: 2rem;
  border-radius: 2px;
  overflow: hidden;
  background-color: #0b0f14;
  border: 1px solid var(--color-border);
}

.map-placeholder-inner {
  position: relative;
  aspect-ratio: 16 / 9;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 32px 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.map-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  max-width: 36ch;
}

.text-map-sub {
  font-size: 0.8125rem;
  color: rgba(244, 242, 238, 0.5);
  line-height: 1.4;
}

.btn-map {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-map:hover {
  border-color: #ffffff;
}

.contact-form-wrapper {
  background: #ffffff;
  border: 1px solid var(--color-border-light);
  border-radius: 2px;
  padding: clamp(2rem, 5vw, 3.5rem);
  box-shadow: 0 10px 30px rgba(11, 15, 20, 0.04);
}

.contact-form-heading {
  margin-bottom: 2rem;
}

.contact-form-desc {
  margin-top: 0.5rem;
  font-size: 0.9375rem;
  color: var(--color-muted);
}

.text-accent {
  color: var(--color-accent);
}

.text-white {
  color: #ffffff;
}
</style>
