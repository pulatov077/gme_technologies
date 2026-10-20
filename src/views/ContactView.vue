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
              <a href="tel:+998913131154" class="contact-link">+998 91 313 11 54</a>
              <span class="contact-hint">{{ t('contact.phoneHint') }}</span>
            </div>

            <!-- Telegram -->
            <div class="contact-card">
              <span class="label text-accent">{{ t('contact.telegram') }}</span>
              <a href="https://t.me/gme_technologies" target="_blank" rel="noopener noreferrer" class="contact-link">
                @gme_technologies
              </a>
              <span class="contact-hint">{{ t('contact.telegramHint') }}</span>
            </div>

            <!-- Email -->
            <div class="contact-card">
              <span class="label text-accent">{{ t('contact.email') }}</span>
              <a href="mailto:info@gmetech.uz" class="contact-link">
                info@gmetech.uz
              </a>
              <span class="contact-hint">{{ t('contact.emailHint') }}</span>
            </div>

            <!-- Address -->
            <div class="contact-card">
              <span class="label text-accent">{{ t('contact.address') }}</span>
              <p class="contact-address-text">
                {{ t('contact.addressVal') }}
              </p>
              <span class="contact-hint">{{ t('contact.addressHint') }}</span>
            </div>
          </div>

          <!-- Real Embedded Google Map -->
          <div class="map-box">
            <div class="map-wrapper">
              <iframe
                src="https://maps.google.com/maps?q=39.6743375,66.9735469&hl=uz&z=16&output=embed"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen="false"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="GME Technologies ofis manzili"
                class="map-iframe"
              ></iframe>
            </div>
            <div class="map-footer">
              <div class="map-footer-info">
                <span class="map-marker-dot"></span>
                <span>{{ t('about.addressVal') }}</span>
              </div>
              <a
                href="https://maps.google.com/?q=39.6743375,66.9735469"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn--outline btn--sm"
              >
                {{ t('contact.map') }} ↗
              </a>
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
  padding: clamp(1.25rem, 4vw, 1.75rem);
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

.map-box {
  margin-top: 1.5rem;
  border-radius: 4px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid var(--color-border-light);
  box-shadow: 0 4px 20px rgba(11, 15, 20, 0.04);
  max-width: 100%;
  box-sizing: border-box;
}

.map-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 260px;
  background: #111820;
  overflow: hidden;
}

.map-iframe {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  height: 100% !important;
  border: 0;
  display: block;
  filter: contrast(102%) brightness(98%);
}

.map-footer {
  padding: 0.875rem 1.25rem;
  background: #ffffff;
  border-top: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.map-footer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-ink);
}

.map-marker-dot {
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--color-accent);
}

.contact-form-wrapper {
  background: #ffffff;
  border: 1px solid var(--color-border-light);
  border-radius: 2px;
  padding: clamp(1.25rem, 4vw, 3.5rem);
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
</style>
