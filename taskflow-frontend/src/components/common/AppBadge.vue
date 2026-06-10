<script setup>
import { computed } from 'vue'

const props = defineProps({
	text: {
		type: String,
		required: true,
	},
	variant: {
		type: String,
		default: 'default',
		validator: (value) => ['success', 'warning', 'info', 'default'].includes(value),
	},
})

const variantClasses = {
	success: 'is-success',
	warning: 'is-warning',
	info: 'is-info',
	default: 'is-default',
}

const badgeClasses = computed(() => ['app-badge', variantClasses[props.variant]])
</script>

<template>
	<span :class="badgeClasses">
		{{ text }}
	</span>
</template>

<style scoped>
.app-badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.35rem 0.7rem;
	border-radius: 999px;
	font-size: 0.8125rem;
	font-weight: 700;
	line-height: 1;
	letter-spacing: 0.01em;
}

.is-success {
	background: rgba(22, 163, 74, 0.14);
	color: #15803d;
}

.is-warning {
	background: rgba(234, 179, 8, 0.16);
	color: #a16207;
}

.is-info {
	background: rgba(37, 99, 235, 0.14);
	color: #1d4ed8;
}

.is-default {
	background: rgba(148, 163, 184, 0.18);
	color: #475569;
}
</style>
