<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps({
	state: {
		type: Number,
		default: () => 0,
	},
	size: {
		type: String,
		default: () => 'default',
	},
});

enum StateEnum {
	Not = 0,
	Success = 1,
	Fail = 2,
}
</script>
<template>
	<el-tag v-if="props.state === StateEnum.Not" :size="props.size" type="info">未连接</el-tag>
	<el-tag v-else-if="props.state === StateEnum.Success" :size="props.size" type="success">成功</el-tag>
	<el-tag v-else-if="props.state === StateEnum.Fail" :size="props.size" type="danger">失败</el-tag>
</template>
