<script setup lang="ts">
import { reactive, ref } from 'vue';
import { pomeloAPINotification } from '/@/utils/other';
import { manageProjectAPI } from '/@/api/pomelo/manage/project-api';
import { manageEnvAPI } from '/@/api/pomelo/manage/env-api';

import { manageAddressAPI } from '/@/api/pomelo/manage/address-api';
const { project_query_api } = manageProjectAPI();

const { env_query_api } = manageEnvAPI();
const { address_query_detail_api, address_create_api, address_update_api } = manageAddressAPI();
const emit = defineEmits(['refresh']);
type ProjectItemType = { project_id: string; project_name: string };
type EnvItemType = { env_id: string; env_name: string };
const ruleFormRef = ref();
const state = reactive({
	isShow: false,
	title: '',
	dialogTitleClass: '',
	form: {
		address_id: '',
		env_id: '',
		project_id: '',
		address_name: '',
		address: '',
		is_default: false,
		remark: '',
	},
	rules: {
		env_id: { required: true, message: '请选择环境名称', trigger: 'blur' },
		project_id: { required: true, message: '请选择项目名称', trigger: 'blur' },
		address_name: { required: true, message: '请输入地址名称', trigger: 'blur' },
		address: { required: true, message: '请输入地址配置', trigger: 'blur' },
		is_default: { required: true, message: '请选择是否为环境默认地址', trigger: 'blur' },
	},
	projectOptions: [] as Array<ProjectItemType>,
	envOptions: [] as Array<EnvItemType>,
});

const initForm = {
	address_id: '',
	env_id: '',
	project_id: '',
	address_name: '',
	address: '',
	is_default: false,
	remark: '',
};
/**
 * 关闭对话框
 */
const closeDialog = () => {
	state.isShow = false;
	state.form = Object.assign({}, initForm);
	state.title = '';
};

const changeProjectID = async () => {
	state.form.env_id = '';
	await hndleQueryEnvOptions();
};
/**
 * 查询环境Options
 */

const hndleQueryEnvOptions = async () => {
	const { data: options } = await env_query_api({ project_id: state.form.project_id });
	state.envOptions = options;
};

const hndleQueryProjectOptions = async () => {
	const { data: options } = await project_query_api({});
	state.projectOptions = options as Array<ProjectItemType>;
};
/**
 * 打开对话框
 * @param project_id 项目ID
 */
const openDialog = async (address_id: string) => {
	state.isShow = true;
	await hndleQueryProjectOptions();
	if (address_id) {
		const { data } = (await address_query_detail_api(address_id)) as any;
		state.form = data;
		state.title = '地址修改';
		state.dialogTitleClass = 'card-border-left-warning';
	} else {
		state.form = Object.assign({}, initForm);
		state.title = '地址新增';
		state.dialogTitleClass = 'card-border-left-success';
	}
	console.log(state.title);
};

/**
 * 提交
 */
const handleSubmit = async () => {
	if (!ruleFormRef.value) return;
	await ruleFormRef.value?.validate(async (valid: any) => {
		if (valid) {
			const { code, msg } = state.form.address_id ? await address_update_api(state.form) : await address_create_api(state.form);
			console.log(code, msg);
			if (pomeloAPINotification(code, msg)) {
				emit('refresh');
				closeDialog();
			}
		}
	});
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
						<el-form-item class="mt20" label="地址名称" prop="address_name">
							<el-input v-model="state.form.address_name" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item class="mt20" label="项目名称" prop="project_id">
							<el-select v-model="state.form.project_id" placeholder="请选择项目" size="default" @change="changeProjectID" style="width: 100%">
								<el-option v-for="item in state.projectOptions" :key="item.project_id" :label="item.project_name" :value="item.project_id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item class="mt20" label="环境名称" prop="env_id">
							<el-select v-model="state.form.env_id" placeholder="请选择环境" size="default" style="width: 100%">
								<el-option v-for="item in state.envOptions" :key="item.env_id" :label="item.env_name" :value="item.env_id" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item class="mt20" label="地址配置" prop="address">
							<el-input v-model="state.form.address" clearable />
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
