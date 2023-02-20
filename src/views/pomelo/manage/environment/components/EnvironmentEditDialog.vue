<script setup lang="ts">
import { reactive, ref } from 'vue';
import { manageEnvAPI } from '/@/api/pomelo/manage/env-api';
import { pomeloAPINotification } from '/@/utils/other';
import { manageProjectAPI } from '/@/api/pomelo/manage/project-api';

const { project_query_api } = manageProjectAPI();
const emit = defineEmits(['refresh']);
const { env_update_api, env_create_api, env_query_detail_api } = manageEnvAPI();
const ruleFormRef = ref();
type ProjectItemType = { project_id: string; project_name: string };

const state = reactive({
	isShow: false,
	title: '',
	dialogTitleClass: '',
	form: {
		env_id: '',
		project_id: '',
		env_name: '',
		is_default: false,
		remark: '',
	},
	rules: {
		project_id: { required: true, message: '请选择项目名称', trigger: 'blur' },
		env_name: { required: true, message: '请输入环境名称', trigger: 'blur' },
		is_default: { required: true, message: '请选择是否为项目默认环境', trigger: 'blur' },
	},
	projectOptions: [] as Array<ProjectItemType>,
});

const initForm = {
	env_id: '',
	project_id: '',
	env_name: '',
	is_default: false,
	remark: '',
};

/**
 * 打开对话框
 * @param project_id 项目ID
 */
const openDialog = async (env_id: string) => {
	state.isShow = true;
	await hndleQueryProjectOptions();
	if (env_id) {
		const { data } = (await env_query_detail_api(env_id)) as any;
		state.form = data;
		state.title = '环境修改';
		state.dialogTitleClass = 'card-border-left-warning';
	} else {
		state.form = Object.assign({}, initForm);
		state.title = '环境新增';
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
			const { code, msg } = state.form.env_id ? await env_update_api(state.form) : await env_create_api(state.form);
			console.log(code, msg);
			if (pomeloAPINotification(code, msg)) {
				emit('refresh');
				closeDialog();
			}
		}
	});
};

/**
 * 查询项目Options
 */

const hndleQueryProjectOptions = async () => {
	const { data: options } = await project_query_api({});
	state.projectOptions = options as Array<ProjectItemType>;
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
						<el-form-item class="mt20" label="项目名称" prop="project_id">
							<el-select v-model="state.form.project_id" style="width: 100%" placeholder="请选择项目" size="default">
								<el-option v-for="item in state.projectOptions" :key="item.project_id" :label="item.project_name" :value="item.project_id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item class="mt20" label="环境名称" prop="env_name">
							<el-input v-model="state.form.env_name" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item class="mt20" label="是否默认" prop="is_default">
							<el-switch
								v-model="state.form.is_default"
								class="ml-2"
								style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
								:active-value="1"
								:inactive-value="0"
							/>
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
