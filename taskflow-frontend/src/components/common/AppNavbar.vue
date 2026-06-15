<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['logout'])

const route = useRoute()
const menuOpen = ref(false)

const userEmail = computed(() => props.user?.email ?? '')

const navigationLinks = computed(() => [
  { label: 'Mis Tareas', path: '/tareas' },
  ...(props.isAdmin
    ? [
        { label: 'Admin', path: '/admin' },
        { label: 'Categorías', path: '/admin/categorias' },
      ]
    : []),
])

const isActive = (path) => route.path === path || route.path.startsWith(`${path}/`)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

const handleLogout = () => {
  closeMenu()
  emit('logout')
}
</script>

<template>
  <nav class="app-navbar">
    <RouterLink to="/tareas" class="app-navbar__brand" @click="closeMenu">
      <span class="app-navbar__brand-mark">TF</span>
      <span class="app-navbar__brand-text">
        <strong>TaskFlow</strong>
        <small>Gestión de tareas</small>
      </span>
    </RouterLink>

    <button
      type="button"
      class="app-navbar__toggle"
      :aria-expanded="menuOpen"
      aria-label="Abrir o cerrar navegación"
      @click="toggleMenu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div class="app-navbar__shell" :class="{ 'is-open': menuOpen }">
      <div class="app-navbar__links">
        <RouterLink
          v-for="link in navigationLinks"
          :key="link.path"
          :to="link.path"
          class="app-navbar__link"
          :class="{ active: isActive(link.path) }"
          @click="closeMenu"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <div class="app-navbar__user">
        <span class="app-navbar__email">{{ userEmail }}</span>
        <button type="button" class="app-navbar__logout" @click="handleLogout">
          Cerrar sesión
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.app-navbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.22);
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.04);
}

.app-navbar__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  text-decoration: none;
  color: inherit;
  flex: 0 0 auto;
}

.app-navbar__brand-mark {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.85rem;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.app-navbar__brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.app-navbar__brand-text strong {
  font-size: 1rem;
  color: #0f172a;
}

.app-navbar__brand-text small {
  color: #64748b;
}

.app-navbar__toggle {
  display: none;
  width: 2.75rem;
  height: 2.75rem;
  margin-left: auto;
  border: 0;
  border-radius: 0.9rem;
  background: #eff6ff;
  cursor: pointer;
}

.app-navbar__toggle span {
  display: block;
  width: 1.15rem;
  height: 2px;
  margin: 0.22rem auto;
  border-radius: 999px;
  background: #1e293b;
}

.app-navbar__shell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex: 1 1 auto;
}

.app-navbar__links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  flex: 1 1 auto;
}

.app-navbar__link {
  padding: 0.7rem 0.95rem;
  border-radius: 999px;
  text-decoration: none;
  color: #475569;
  font-weight: 600;
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.app-navbar__link:hover {
  background: #eaf2ff;
  color: #0f172a;
}

.app-navbar__link.active {
  background: #2563eb;
  color: #ffffff;
}

.app-navbar__user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 0 0 auto;
}

.app-navbar__email {
  max-width: 14rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #334155;
  font-weight: 600;
}

.app-navbar__logout {
  border: 0;
  border-radius: 999px;
  padding: 0.72rem 1rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.18s ease;
}

.app-navbar__logout:hover {
  opacity: 0.92;
}

@media (max-width: 768px) {
  .app-navbar {
    flex-wrap: wrap;
  }

  .app-navbar__toggle {
    display: inline-block;
  }

  .app-navbar__shell {
    display: none;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    padding-top: 0.5rem;
  }

  .app-navbar__shell.is-open {
    display: flex;
  }

  .app-navbar__links {
    flex-direction: column;
    align-items: stretch;
  }

  .app-navbar__link {
    width: 100%;
    text-align: center;
  }

  .app-navbar__user {
    flex-direction: column;
    align-items: stretch;
  }

  .app-navbar__email,
  .app-navbar__logout {
    width: 100%;
    text-align: center;
  }
}
</style>