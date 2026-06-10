<script setup>
import { computed } from 'vue'

const props = defineProps({
  email: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  completed: {
    type: Number,
    required: true
  }
})

const percentage = computed(() => props.total > 0 ? Math.round((props.completed / props.total) * 100) : 0)

const barColor = computed(() => {
  if (percentage.value >= 70) return 'green'
  if (percentage.value >= 30) return 'yellow'
  return 'red'
})
</script>

<template>
  <div class='user-progress' :class="barColor">
    <span class='email'>{{email}}</span>
    <span class='stats'>
      {{completed}}/{{total}}
    </span>
    <div class='bar-track'>
      <div
        class='bar-fill'
        :style='{ width: percentage + "%" }'
      ></div>
    </div>
    <span class='pct'>
      {{percentage}}%
    </span>
  </div>
</template>

<style scoped>
.user-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.email {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.stats {
  font-size: 12px;
  color: #666;
}

.bar-track {
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.user-progress.green .bar-fill {
  background-color: #10b981;
}

.user-progress.yellow .bar-fill {
  background-color: #f59e0b;
}

.user-progress.red .bar-fill {
  background-color: #ef4444;
}

.pct {
  font-size: 12px;
  font-weight: bold;
  color: #333;
}
</style>
