<script setup>
import { onMounted, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'

const { email, password, confirmPassword, isLoading, error, handleRegister } = useAuth()
const emailInputRef = ref(null)

onMounted(() => {
  emailInputRef.value?.$el?.querySelector('input')?.focus()
})
</script>

<template>
  <main class="register-page">
    <section class="register-card" aria-labelledby="register-title">
      <div class="register-brand" aria-hidden="true">
        <span class="register-brand__mark">TF</span>
      </div>

      <header class="register-header">
        <p class="register-kicker">Start building your flow</p>
        <h1 id="register-title">Bienvenido a TaskFlow</h1>
        <p class="register-copy">Creá tu cuenta para gestionar tareas, equipos y seguimiento en un solo lugar.</p>
      </header>

      <div v-if="error" class="register-alert" role="alert">
        {{ error }}
      </div>

      <form class="register-form" @submit.prevent="handleRegister">
        <AppInput
          ref="emailInputRef"
          v-model="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          required
        />

        <AppInput
          v-model="password"
          type="password"
          label="Password"
          placeholder="Create a password"
          required
        />

        <AppInput
          v-model="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="Repeat your password"
          required
        />

        <AppButton type="submit" :loading="isLoading" :disabled="isLoading" class="register-submit">
          Crear cuenta
        </AppButton>
      </form>

      <p class="register-footer">
        Ya tengo cuenta
        <RouterLink to="/login">Iniciar sesión</RouterLink>
      </p>
    </section>
  </main>
</template>

<style scoped>
.register-page {
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 2rem 1.25rem;
  background:
    radial-gradient(circle at top, rgba(37, 99, 235, 0.16), transparent 42%),
    linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
}

.register-card {
  width: 100%;
  padding: 2rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(18px);
}

.register-brand {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.register-brand__mark {
  width: 3.5rem;
  height: 3.5rem;
  display: grid;
  place-items: center;
  border-radius: 1rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.08em;
  box-shadow: 0 16px 32px rgba(37, 99, 235, 0.28);
}

.register-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.register-kicker {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2563eb;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.register-header h1 {
  margin: 0;
  font-size: 2rem;
  line-height: 1.1;
}

.register-copy {
  margin-top: 0.75rem;
  color: #475569;
  font-size: 0.98rem;
}

.register-alert {
  margin-bottom: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(220, 38, 38, 0.25);
  background: rgba(220, 38, 38, 0.1);
  color: #b91c1c;
  font-size: 0.95rem;
}

.register-form {
  display: grid;
  gap: 1rem;
}

.register-submit {
  width: 100%;
}

.register-footer {
  margin-top: 1.25rem;
  text-align: center;
  color: #64748b;
  font-size: 0.95rem;
}

.register-footer a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style>