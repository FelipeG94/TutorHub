<script setup>
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: '',
	},
	options: {
		type: Array,
		default: () => [],
	},
	placeholder: {
		type: String,
		default: 'Seleccionar...',
	},
	error: {
		type: String,
		default: '',
	},
})

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()

const selectClasses = computed(() => ['app-select__field', props.error ? 'is-invalid' : ''])

const handleChange = (event) => {
	emit('update:modelValue', event.target.value)
}
</script>

<template>
	<div class="app-select" :class="{ 'has-error': error }">
		<select
			v-bind="attrs"
			:value="modelValue"
			:class="selectClasses"
			@change="handleChange"
		>
			<option disabled value="">{{ placeholder }}</option>
			<option v-for="option in options" :key="option.value" :value="option.value">
				{{ option.label }}
			</option>
		</select>

		<p v-if="error" class="app-select__error" role="alert">
			{{ error }}
		</p>
	</div>
</template>

<style scoped>
.app-select {
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
}

.app-select__field {
	width: 100%;
	box-sizing: border-box;
	padding: 0.85rem 1rem;
	border: 1px solid #cbd5e1;
	border-radius: 0.9rem;
	background: #ffffff;
	color: #0f172a;
	font: inherit;
	transition:
		border-color 0.18s ease,
		box-shadow 0.18s ease;
}

.app-select__field:focus {
	outline: none;
	border-color: #2563eb;
	box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.app-select__field.is-invalid {
	border-color: #dc2626;
	box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.12);
}

.app-select__error {
	margin: 0;
	font-size: 0.875rem;
	color: #dc2626;
}
</style>
