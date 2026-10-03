<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { projects } from '@/data/projects'
import ProjectCard from '@/components/ProjectCard.vue'
import SectionHeading from '@/components/SectionHeading.vue'

const { t } = useI18n()

const selectedIndustry = ref<string>('all')
const selectedService = ref<string>('all')

const industries = computed(() => {
  const set = new Set<string>()
  projects.forEach((p) => set.add(p.industry))
  return ['all', ...Array.from(set)]
})

const servicesList = computed(() => {
  const set = new Set<string>()
  projects.forEach((p) => p.services.forEach((s) => set.add(s)))
  return ['all', ...Array.from(set)]
})

const filteredProjects = computed(() => {
  return projects.filter((p) => {
    const matchIndustry =
      selectedIndustry.value === 'all' || p.industry === selectedIndustry.value
    const matchService =
      selectedService.value === 'all' || p.services.includes(selectedService.value)
    return matchIndustry && matchService
  })
})
</script>

<template>
  <div class="projects-page section-py">
    <div class="container">
      <!-- Header -->
      <SectionHeading
        label="PORTFOLIO"
        :title="t('projects.title')"
        :subtitle="t('projects.subtitle')"
      />

      <!-- Filter bar -->
      <div class="filter-bar">
        <div class="filter-group">
          <span class="label filter-group-label">{{ t('projects.filter') }}:</span>
          <button
            v-for="ind in industries"
            :key="ind"
            class="filter-pill"
            :class="{ 'filter-pill--active': selectedIndustry === ind }"
            @click="selectedIndustry = ind"
          >
            {{ ind === 'all' ? t('projects.allIndustries') : ind }}
          </button>
        </div>

        <div v-if="servicesList.length > 2" class="filter-group">
          <button
            v-for="serv in servicesList"
            :key="serv"
            class="filter-pill"
            :class="{ 'filter-pill--active': selectedService === serv }"
            @click="selectedService = serv"
          >
            {{ serv === 'all' ? t('projects.allServices') : serv }}
          </button>
        </div>
      </div>

      <!-- Dev Notice -->
      <div class="dev-notice">
        <span class="dev-notice-tag">DEV INFO</span>
        <p>Barcha loyihalar <code>src/data/projects.ts</code> faylida saqlanadi va TODO placeholderlar bilan to‘ldirilgan. Haqiqiy loyihalar ma’lumoti kiritilishi bilan avtomatik tarzda to‘liq ko‘rinadi.</p>
      </div>

      <!-- Grid -->
      <div v-if="filteredProjects.length" class="projects-grid">
        <ProjectCard
          v-for="proj in filteredProjects"
          :key="proj.slug"
          :project="proj"
        />
      </div>

      <div v-else class="empty-state">
        <p>Tanlangan mezon bo‘yicha loyihalar topilmadi.</p>
        <button class="btn btn--outline" @click="selectedIndustry = 'all'; selectedService = 'all'">
          Filtrlarni tozalash
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border-light);
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.filter-group-label {
  color: var(--color-muted);
  margin-right: 0.5rem;
}

.filter-pill {
  border: 1px solid var(--color-border-light);
  background: transparent;
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 999px;
  cursor: pointer;
  color: var(--color-ink);
  transition: all var(--duration) var(--ease-out);
}

.filter-pill:hover {
  border-color: var(--color-ink);
}

.filter-pill--active {
  background: var(--color-ink);
  color: var(--color-paper);
  border-color: var(--color-ink);
}

.dev-notice {
  background: rgba(255, 90, 31, 0.08);
  border: 1px solid rgba(255, 90, 31, 0.3);
  padding: 1rem 1.25rem;
  border-radius: 2px;
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dev-notice-tag {
  font-size: 0.6875rem;
  font-weight: 800;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  padding: 0.125rem 0.375rem;
  border-radius: 2px;
}

.dev-notice p {
  font-size: 0.8125rem;
  color: var(--color-ink);
  line-height: 1.4;
}

.dev-notice code {
  background: rgba(11, 15, 20, 0.06);
  padding: 0.125rem 0.375rem;
  border-radius: 2px;
  font-family: monospace;
}

.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2rem, 4vw, 3.5rem);
}

@media (min-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
</style>
