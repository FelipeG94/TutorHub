<script setup>
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: '',
	},
	label: {
		type: String,
		default: '',
	},
	placeholder: {
		type: String,
		default: '',
	},
	error: {
		type: String,
		default: '',
	},
	type: {
		type: String,
		default: 'text',
		validator: (value) => ['text', 'email', 'password'].includes(value),
	},
	required: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()

const inputId = computed(() => attrs.id ?? `app-input-${Math.random().toString(36).slice(2, 10)}`)
const isInvalid = computed(() => Boolean(props.error))

const inputClasses = computed(() => [
	'app-input__field',
	isInvalid.value ? 'is-invalid' : '',
])

const handleInput = (event) => {
	emit('update:modelValue', event.target.value)
}
</script>

<template>
	<div class="app-input" :class="{ 'has-error': error }">
		<label v-if="label" class="app-input__label" :for="inputId">
			{{ label }}
			<span v-if="required" class="app-input__required" aria-hidden="true">*</span>
		</label>

		<input
			:id="inputId"
			:type="type"
			:value="modelValue"
			:placeholder="placeholder"
			:required="required"
			v-bind="attrs"
			:class="inputClasses"
			@input="handleInput"
		/>

		<p v-if="error" class="app-input__error" role="alert">
			{{ error }}
		</p>
	</div>
</template>

<style scoped>
.app-input {
	display: flex;
	flex-direction: column;
	gap: 0.45rem;
}

.app-input__label {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.95rem;
	font-weight: 600;
	color: #0f172a;
}

.app-input__required {
	color: #dc2626;
}

.app-input__field {
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

.app-input__field::placeholder {
	color: #94a3b8;
}

.app-input__field:focus {
	outline: none;
	border-color: #2563eb;
	box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.app-input__field.is-invalid {
	border-color: #dc2626;
	box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.12);
}

.app-input__error {
	margin: 0;
	font-size: 0.875rem;
	color: #dc2626;
}
</style>
