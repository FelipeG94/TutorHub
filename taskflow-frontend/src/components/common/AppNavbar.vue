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

const isActive = (path) => {
  if (path === '/tareas') {
    return route.path === '/tareas' || route.path.startsWith('/tareas/')
  }
  return route.path === path
}

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
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(217, 225, 237, 0.6);
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
}

@media (max-width: 768px) {
  .app-navbar {
    padding: 0.875rem 1rem;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .app-navbar {
    padding: 0.75rem 0.875rem;
  }
}

.app-navbar__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  text-decoration: none;
  color: inherit;
  flex: 0 0 auto;
  transition: transform 0.2s ease;
}

.app-navbar__brand:hover {
  transform: scale(1.02);
}

.app-navbar__brand-mark {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.08em;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.app-navbar__brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.app-navbar__brand-text strong {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.app-navbar__brand-text small {
  font-size: 0.75rem;
  color: #64748b;
}

.app-navbar__toggle {
  display: none;
  width: 2.5rem;
  height: 2.5rem;
  margin-left: auto;
  border: 0;
  border-radius: 0.75rem;
  background: #eff6ff;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.app-navbar__toggle:hover {
  background: #dbeafe;
}

.app-navbar__toggle span {
  display: block;
  width: 1.15rem;
  height: 2px;
  margin: 0.25rem auto;
  border-radius: 999px;
  background: #1e293b;
  transition: all 0.3s ease;
}

.app-navbar__shell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex: 1 1 auto;
}

.app-navbar__links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  justify-content: center;
  flex: 1 1 auto;
}

.app-navbar__link {
  padding: 0.65rem 1rem;
  border-radius: 0.75rem;
  text-decoration: none;
  color: #3a4a5c;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.app-navbar__link:hover {
  background: #e8f1ff;
  color: #0a0e27;
  transform: translateY(-1px);
}

.app-navbar__link.active {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
}

.app-navbar__user {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 0 0 auto;
}

.app-navbar__email {
  max-width: 14rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #334155;
  font-weight: 600;
  font-size: 0.95rem;
}

.app-navbar__logout {
  border: 0;
  border-radius: 0.75rem;
  padding: 0.65rem 1.25rem;
  font: inherit;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.app-navbar__logout:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

.app-navbar__logout:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .app-navbar {
    flex-wrap: wrap;
  }

  .app-navbar__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .app-navbar__shell {
    display: none;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    padding-top: 0.75rem;
    border-top: 1px solid #e2e8f0;
    gap: 0.75rem;
    order: 3;
  }

  .app-navbar__shell.is-open {
    display: flex;
  }

  .app-navbar__links {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .app-navbar__link {
    width: 100%;
    text-align: center;
    padding: 0.6rem;
  }

  .app-navbar__user {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .app-navbar__email {
    max-width: 100%;
    text-align: center;
    padding: 0.5rem;
  }

  .app-navbar__logout {
    width: 100%;
    text-align: center;
    padding: 0.65rem 1rem;
  }

  .app-navbar__brand-text small {
    display: none;
  }
}

@media (max-width: 480px) {
  .app-navbar {
    gap: 0.75rem;
  }

  .app-navbar__brand-mark {
    width: 2rem;
    height: 2rem;
    font-size: 0.85rem;
  }

  .app-navbar__brand-text strong {
    font-size: 0.9rem;
  }

  .app-navbar__link {
    font-size: 0.9rem;
    padding: 0.55rem 0.75rem;
  }

  .app-navbar__email {
    font-size: 0.85rem;
  }

  .app-navbar__logout {
    font-size: 0.9rem;
    padding: 0.55rem 0.9rem;
  }
}
</style>