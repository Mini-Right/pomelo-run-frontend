<script setup lang="ts">
import { defineProps, reactive, onMounted, watch } from 'vue';

const emit = defineEmits(['update:status']);

const props = defineProps({
	status: {
		type: Number,
		default: () => 0,
	},
	size: {
		type: String,
		default: () => 'default',
	},
});

watch(
	() => props.status,
	(status: number) => {
		console.log('status', status);
		state.status = status;
	}
);

const state = reactive({
	status: 0,
});

onMounted(() => {
	state.status = props.status;
});

/**
 * 变更事件emit
 * @param value 变更后的状态
 */
const updateStatus = (value: number) => {
	emit('update:status', value);
};
</script>
<template>
	<el-switch
		v-model="state.status"
		style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
		inline-prompt
		active-text="启用"
		inactive-text="禁用"
		:active-value="0"
		:inactive-value="1"
		:size="props.size"
		@change="updateStatus"
	/>
</template>
