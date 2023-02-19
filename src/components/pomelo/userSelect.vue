<script setup lang="ts">
import { reactive, onMounted, defineEmits, watch } from 'vue';
import { publicAPI } from '/@/api/pomelo/public/index.ts';
const { user_info_list_api } = publicAPI();
const emit = defineEmits(['update:user_id']);
const props = defineProps({
	multiple: {
		type: Boolean,
		default: () => false,
	},
	user_id: {
		type: String,
		default: () => '',
	},
});

type UserItemType = {
	user_id: string;
	nickname: string;
	username: string;
	avatar: string;
};

const state = reactive({
	userData: [] as Array<UserItemType>,
	currentUser: {
		user_id: '',
		nickname: '',
		username: '',
		avatar: '',
	} as UserItemType,
});

const handleQueryUserList = async () => {
	const { data } = await user_info_list_api();
	state.userData = data;
};

const changeUserID = (userInfo: UserItemType) => {
	state.currentUser = Object.assign({}, userInfo);
	emit('update:user_id', state.currentUser.user_id);
};

const initCurrentUser = async (user_id: string) => {
	if (state.userData.length === 0) {
		await handleQueryUserList();
	}
	for (let index = 0; index < state.userData.length; index++) {
		const element = state.userData[index];
		if (user_id === element.user_id) {
			state.currentUser = Object.assign({}, element);
		}
	}
};

watch(
	() => props.user_id,
	async (user_id: string) => {
		if (!user_id.length) {
			state.currentUser = Object.assign(
				{},
				{
					user_id: '',
					nickname: '',
					username: '',
					avatar: '',
				}
			);
		}

		await initCurrentUser(user_id);
	}
);

onMounted(async () => {
	await initCurrentUser(props.user_id);
});
</script>

<template>
	<el-select v-model="state.currentUser.nickname" :multiple="props.multiple" style="width: 100%" @change="changeUserID">
		<template #prefix>
			<el-avatar v-if="state.currentUser.avatar" class="user-select-avatar" size="small" :src="state.currentUser.avatar" />
		</template>
		<el-option v-for="item in state.userData" :key="item.user_id" :value="item">
			<span class="user-select-avatar">
				<el-avatar size="small" :src="item.avatar" />
				{{ item.nickname }}
			</span>
		</el-option>
	</el-select>
</template>
<style lang="scss" scoped>
.user-select-avatar {
	display: flex;
	align-items: center;
	justify-content: center;
	float: left;
	.el-avatar {
		margin-right: 10px;
	}
}
</style>
