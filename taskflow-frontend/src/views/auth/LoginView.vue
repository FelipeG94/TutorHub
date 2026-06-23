<script setup>
import { onMounted, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'

const { email, password, isLoading, error, handleLogin } = useAuth()
const emailInputRef = ref(null)


onMounted(() => {
  emailInputRef.value?.$el?.querySelector('input')?.focus()
})
</script>

<template>
  <main class="login-page">
    <section class="login-card" aria-labelledby="login-title">
      <div class="login-brand" aria-hidden="true">
        <span class="login-brand__mark">TF</span>
      </div>

      <header class="login-header">
        <p class="login-kicker">Task management made simple</p>
        <h1 id="login-title">Bienvenido a TaskFlow</h1>
        <p class="login-copy">Accedé para organizar tareas, seguir avances y retomar trabajo sin perder contexto.</p>
      </header>

      <div v-if="error" class="login-alert" role="alert">
        {{ error }}
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
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
          placeholder="Enter your password"
          required
        />

        <AppButton type="submit" :loading="isLoading" :disabled="isLoading" class="login-submit">
          Iniciar sesión
        </AppButton>
      </form>

      <p class="login-footer">
        ¿No tenés cuenta?
        <RouterLink to="/register">Registrate</RouterLink>
      </p>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 2rem 1.25rem;
  background:
    radial-gradient(circle at top, rgba(37, 99, 235, 0.16), transparent 42%),
    linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
}

.login-card {
  width: 100%;
  padding: 2rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(18px);
}

.login-brand {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.login-brand__mark {
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

.login-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-kicker {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2563eb;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.login-header h1 {
  margin: 0;
  font-size: 2rem;
  line-height: 1.1;
}

.login-copy {
  margin-top: 0.75rem;
  color: #475569;
  font-size: 0.98rem;
}

.login-alert {
  margin-bottom: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(220, 38, 38, 0.25);
  background: rgba(220, 38, 38, 0.1);
  color: #b91c1c;
  font-size: 0.95rem;
}

.login-form {
  display: grid;
  gap: 1rem;
}

.login-submit {
  width: 100%;
}

.login-footer {
  margin-top: 1.25rem;
  text-align: center;
  color: #64748b;
  font-size: 0.95rem;
}

.login-footer a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>