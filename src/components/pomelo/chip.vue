<script lang="ts" setup>
import { reactive, watch, onMounted } from 'vue';
import { publicAPI } from '/@/api/pomelo/public';
const { user_info_api } = publicAPI();
const props = defineProps({
	user_id: {
		type: String,
		default: '',
	},
});

watch(
	() => props.user_id,
	(user_id: string) => {
		handleQuery(user_id);
	}
);

onMounted(() => {
	handleQuery(props.user_id);
});

const state = reactive({
	userInfo: {},
});

const handleQuery = async (user_id: string) => {
	const { data } = await user_info_api(user_id);
	state.userInfo = data;
};
</script>
<template>
	<div class="chip">
		<div class="content">
			<el-avatar :src="state.userInfo.avatar" />
			{{ state.userInfo.nickname }}
		</div>
	</div>
</template>
<style lang="scss" scoped>
.chip {
	display: inline-block;
	vertical-align: middle;
	padding: 0 10px;
	margin-right: 2px;
	border-radius: 20px;
	background-color: var(--el-fill-color-light);
	color: var(--el-text-color-primary);
	transition: background-color 0.3s, var(--el-transition-color);
	.content {
		display: flex;
		align-items: center;
		height: 24px;
		font-size: 12px;
		.el-avatar {
			width: 24px;
			height: 24px;
			line-height: 24px;
			margin-left: -8px;
			margin-right: 5px;
		}
		.el-avatar--circle {
			border-radius: 50%;
		}
	}
}
</style>
