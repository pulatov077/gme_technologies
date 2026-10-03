<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLeadForm } from '@/composables/useLeadForm'

const emit = defineEmits<{ success: [] }>()

const { t } = useI18n()
const { fields, errors, status, submit, reset } = useLeadForm()

const services = ['website', 'telegram', 'crm', 'mobile', 'custom'] as const

async function handleSubmit() {
  await submit()
  if (status.value === 'success') {
    setTimeout(() => {
      reset()
      emit('success')
    }, 2000)
  }
}

function formatPhone(e: Event) {
  const input = e.target as HTMLInputElement
  let val = input.value.replace(/\D/g, '')
  if (val.startsWith('998')) val = '+' + val
  else if (val.startsWith('9') && !val.startsWith('998')) val = '+998' + val
  else if (!val.startsWith('+')) val = '+998' + val
  // Format: +998 XX XXX XX XX
  const digits = val.replace(/\D/g, '')
  if (digits.length <= 3) {
    fields.phone = '+' + digits
  } else if (digits.length <= 5) {
    fields.phone = `+${digits.slice(0, 3)} ${digits.slice(3)}`
  } else if (digits.length <= 8) {
    fields.phone = `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`
  } else if (digits.length <= 10) {
    fields.phone = `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
  } else {
    fields.phone = `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`
  }
}
</script>

<template>
  <!-- Success state -->
  <div v-if="status === 'success'" class="lf-success" role="status" aria-live="polite">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <path d="M22 4 12 14.01l-3-3"/>
    </svg>
    <p>{{ t('form.success') }}</p>
  </div>

  <!-- Form -->
  <form v-else class="lead-form" novalidate @submit.prevent="handleSubmit">
    <!-- Honeypot (hidden from real users) -->
    <input
      v-model="fields._hp"
      type="text"
      name="_hp"
      tabindex="-1"
      autocomplete="off"
      aria-hidden="true"
      class="lf-honeypot"
    />

    <!-- Name -->
    <div class="lf-field" :class="{ 'lf-field--error': errors.name }">
      <label for="lf-name" class="lf-label">{{ t('form.name') }} *</label>
      <input
        id="lf-name"
        v-model="fields.name"
        type="text"
        class="lf-input"
        :placeholder="t('form.namePlaceholder')"
        autocomplete="name"
        :aria-invalid="!!errors.name"
        aria-describedby="lf-name-err"
      />
      <span v-if="errors.name" id="lf-name-err" class="lf-error" role="alert">
        {{ t(`form.${errors.name}`) }}
      </span>
    </div>

    <!-- Phone -->
    <div class="lf-field" :class="{ 'lf-field--error': errors.phone }">
      <label for="lf-phone" class="lf-label">{{ t('form.phone') }} *</label>
      <input
        id="lf-phone"
        v-model="fields.phone"
        type="tel"
        class="lf-input"
        :placeholder="t('form.phonePlaceholder')"
        autocomplete="tel"
        :aria-invalid="!!errors.phone"
        aria-describedby="lf-phone-err"
        @input="formatPhone"
      />
      <span v-if="errors.phone" id="lf-phone-err" class="lf-error" role="alert">
        {{ t(`form.${errors.phone}`) }}
      </span>
    </div>

    <!-- Service -->
    <div class="lf-field" :class="{ 'lf-field--error': errors.service }">
      <label for="lf-service" class="lf-label">{{ t('form.service') }} *</label>
      <select
        id="lf-service"
        v-model="fields.service"
        class="lf-input lf-select"
        :aria-invalid="!!errors.service"
        aria-describedby="lf-service-err"
      >
        <option value="" disabled>{{ t('form.servicePlaceholder') }}</option>
        <option v-for="s in services" :key="s" :value="s">
          {{ t(`form.services.${s}`) }}
        </option>
      </select>
      <span v-if="errors.service" id="lf-service-err" class="lf-error" role="alert">
        {{ t(`form.${errors.service}`) }}
      </span>
    </div>

    <!-- Message -->
    <div class="lf-field">
      <label for="lf-message" class="lf-label">{{ t('form.message') }}</label>
      <textarea
        id="lf-message"
        v-model="fields.message"
        class="lf-input lf-textarea"
        :placeholder="t('form.messagePlaceholder')"
        rows="4"
      />
    </div>

    <!-- Consent -->
    <div class="lf-field lf-consent-field" :class="{ 'lf-field--error': errors.consent }">
      <label class="lf-consent-label">
        <input
          v-model="fields.consent"
          type="checkbox"
          class="lf-checkbox"
          :aria-invalid="!!errors.consent"
          aria-describedby="lf-consent-err"
        />
        <span>{{ t('form.consent') }}</span>
      </label>
      <span v-if="errors.consent" id="lf-consent-err" class="lf-error" role="alert">
        {{ t(`form.${errors.consent}`) }}
      </span>
    </div>

    <!-- Error state -->
    <p v-if="status === 'error'" class="lf-form-error" role="alert" aria-live="assertive">
      {{ t('form.error') }}
    </p>

    <!-- Submit -->
    <button
      type="submit"
      class="btn btn--accent btn--full"
      :disabled="status === 'loading'"
      :aria-busy="status === 'loading'"
    >
      {{ status === 'loading' ? t('cta.sending') : t('cta.send') }}
    </button>
  </form>
</template>

<style scoped>
.lf-honeypot {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.lead-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.lf-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.lf-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-ink);
  letter-spacing: 0.01em;
}

.lf-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  color: var(--color-ink);
  background: #fff;
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  outline: none;
  transition: border-color var(--duration) var(--ease-out);
  appearance: none;
}

.lf-input:focus {
  border-color: var(--color-ink);
}

.lf-field--error .lf-input {
  border-color: #e53e3e;
}

.lf-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.875rem center;
  padding-right: 2.5rem;
  cursor: pointer;
}

.lf-textarea {
  resize: vertical;
  min-height: 100px;
}

.lf-error {
  font-size: 0.75rem;
  color: #e53e3e;
  font-weight: 500;
}

.lf-consent-field { gap: 0.5rem; }

.lf-consent-label {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: 0.8125rem;
  color: var(--color-muted);
  cursor: pointer;
  line-height: 1.5;
}

.lf-checkbox {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 2px;
  accent-color: var(--color-accent);
  cursor: pointer;
}

.lf-form-error {
  font-size: 0.875rem;
  color: #e53e3e;
  padding: 0.75rem 1rem;
  background: rgba(229, 62, 62, 0.08);
  border-radius: 4px;
  border: 1px solid rgba(229, 62, 62, 0.2);
}

/* Success */
.lf-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
  color: var(--color-ink);
}

.lf-success svg {
  color: #38a169;
}

.lf-success p {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
}
</style>
