<template>
  <div class="stats-card" :class="colorClass">
    <div class="icon">{{ icon }}</div>

    <div class="content">
      <span class="value">{{ value }}</span>
      <span class="title">{{ title }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  colorClass: {
    type: String,
    required: true,
    validator(value) {
      return ['blue', 'green', 'yellow', 'purple'].includes(value)
    }
  }
})
</script>

<style scoped>
.stats-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-left: 4px solid;
  border-radius: 8px;
  background: white;
}

.icon {
  font-size: 2rem;
}

.content {
  display: flex;
  flex-direction: column;
}

.value {
  font-size: 1.5rem;
  font-weight: bold;
}

.title {
  font-size: 0.9rem;
}

.blue {
  border-left-color: #3b82f6;
  color: #3b82f6;
}

.green {
  border-left-color: #10b981;
  color: #10b981;
}

.yellow {
  border-left-color: #f59e0b;
  color: #f59e0b;
}

.purple {
  border-left-color: #8b5cf6;
  color: #8b5cf6;
}
</style>