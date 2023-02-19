<script setup lang="ts">
import { reactive, ref, defineAsyncComponent } from 'vue';
import { manageProjectAPI } from '/@/api/pomelo/manage/project-api';
import { pomeloAPINotification } from '/@/utils/other';
const UserSelect = defineAsyncComponent(() => import('/@/components/pomelo/userSelect.vue'));

const emit = defineEmits(['refresh']);
const { project_query_detail_api, project_create_api, project_update_api } = manageProjectAPI();
const ruleFormRef = ref();
const state = reactive({
	isShow: false,
	title: '',
	dialogTitleClass: '',
	form: {
		project_id: '',
		project_name: '',
		owner_user: '',
		remark: '',
	},
	rules: {
		project_name: { required: true, message: '请输入项目名称', trigger: 'blur' },
		owner_user: { required: true, message: '请选择负责人', trigger: 'blur' },
	},
});

const initForm = {
	project_id: '',
	project_name: '',
	owner_user: '',
	remark: '',
};

/**
 * 打开对话框
 * @param project_id 项目ID
 */
const openDialog = async (project_id: string) => {
	state.isShow = true;
	if (project_id) {
		const { data } = (await project_query_detail_api(project_id)) as any;
		state.form = data;
		state.title = '项目修改';
		state.dialogTitleClass = 'card-border-left-warning';
	} else {
		state.form = Object.assign({}, initForm);
		state.title = '项目新增';
		state.dialogTitleClass = 'card-border-left-success';
	}
	console.log(state.title);
};

/**
 * 关闭对话框
 */
const closeDialog = () => {
	state.isShow = false;
	state.form = Object.assign({}, initForm);
	state.title = '';
};

/**
 * 提交
 */
const handleSubmit = async () => {
	if (!ruleFormRef.value) return;
	await ruleFormRef.value?.validate(async (valid: any) => {
		if (valid) {
			const { code, msg } = state.form.project_id ? await project_update_api(state.form) : await project_create_api(state.form);
			console.log(code, msg);
			if (pomeloAPINotification(code, msg)) {
				emit('refresh');
				closeDialog();
			}
		}
	});
};

/**
 * 项目负责人选择
 */

const updateOwnerUserID = (user_id: string) => {
	state.form.owner_user = user_id;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<template>
	<div class="template-container">
		<el-dialog v-model="state.isShow" width="30%" :title="state.title" style="border-radius: 20px" @close="closeDialog">
			<template #header="{ titleId, titleClass }">
				<div :class="state.dialogTitleClass">
					<h4 :id="titleId" :class="titleClass" style="margin-left: 10px">{{ state.title }}</h4>
				</div>
			</template>
			<el-form ref="ruleFormRef" size="default" label-width="100px" :model="state.form" :rules="state.rules">
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item class="mt20" label="项目名称" prop="project_name"> <el-input v-model="state.form.project_name" clearable /> </el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item class="mt20" label="项目负责人" prop="owner_user">
							<UserSelect :user_id="state.form.owner_user" @update:user_id="updateOwnerUserID" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item class="mt20" label="描述" prop="remark">
							<el-input v-model="state.form.remark" :rows="2" type="textarea" clearable />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button size="default" @click="closeDialog"> 取消 </el-button>
					<el-button size="default" type="primary" @click="handleSubmit"> 提交 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
