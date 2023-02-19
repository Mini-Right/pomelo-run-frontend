<script setup lang="ts">
import { reactive, defineAsyncComponent, ref } from 'vue';
import { manageDatabaseAPI } from '/@/api/pomelo/manage/database-api';
import { publicAPI } from '/@/api/pomelo/public';
import { pomeloAPINotification } from '/@/utils/other';
import { getCurrentDatetime } from '/@/utils/formatTime';
import { Loading, Select, CloseBold } from '@element-plus/icons-vue';
const NoticeBar = defineAsyncComponent(() => import('/@/components/noticeBar/index.vue'));

const emit = defineEmits(['refresh']);
const { database_query_detail_api, database_create_api, database_update_api } = manageDatabaseAPI();
const { database_connection_mysql_api } = publicAPI();
const ruleFormRef = ref();

enum ConnectionStateEnum {
	Success = 1,
	Fail = 2,
	Loading = '-1',
	Not = 0,
}

const connectionStateCodeConfig = {
	0: {
		text: 'Test Connection',
		color: '#909399',
	},
	'-1': {
		text: 'Loading...',
		color: '#409eff',
	},
	1: {
		text: 'Succeeded',
		color: '#67c23a',
	},
	2: {
		text: 'Fail',
		color: '#ff461f',
	},
};

const state = reactive({
	isShow: false,
	title: '',
	form: {
		database_id: null,
		database_name: null,
		database_user: null,
		database_port: null,
		database_host: null,
		database_password: null,
		database_schema: null,
		last_connection_state: ConnectionStateEnum.Not,
		last_connection_time: '',
		remark: null,
	},
	rules: {
		database_name: { required: true, message: '请输入数据库名称', trigger: 'blur' },
		database_user: { required: true, message: '请输入user', trigger: 'blur' },
		database_port: { required: true, message: '请输入port', trigger: 'blur' },
		database_host: { required: true, message: '请输入host', trigger: 'blur' },
		database_password: { required: true, message: '请输入password', trigger: 'blur' },
	},
	dialogTitleClass: '',
});

const initForm = {
	database_id: null,
	database_name: null,
	database_user: null,
	database_port: null,
	database_host: null,
	database_password: null,
	database_schema: null,
	last_connection_state: ConnectionStateEnum.Not,
	last_connection_time: '',
	remark: null,
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
 * 打开对话框
 * @param link_id 链接ID
 */
const openDialog = async (database_id: string) => {
	state.isShow = true;
	if (database_id) {
		const { data } = (await database_query_detail_api(database_id)) as any;
		state.form = data;

		state.title = '数据库修改';
		state.dialogTitleClass = 'card-border-left-warning';
	} else {
		state.title = '数据库新增';
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
			const { code, msg } = state.form.database_id ? await database_update_api(state.form) : await database_create_api(state.form);
			console.log(code, msg);
			if (pomeloAPINotification(code, msg)) {
				emit('refresh');
				closeDialog();
			}
		}
	});
};

/**
 * 测试连接
 */
const connection = async () => {
	state.form.last_connection_state = ConnectionStateEnum.Loading;
	const { code, msg } = (await database_connection_mysql_api(state.form)) as any;
	state.form.last_connection_state = pomeloAPINotification(code, msg) ? 1 : 2;
	state.form.last_connection_time = getCurrentDatetime();
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<template>
	<div class="template-container">
		<el-dialog v-model="state.isShow" width="50%" :title="state.title" style="border-radius: 20px" @close="closeDialog">
			<template #header="{ titleId, titleClass }">
				<div :class="state.dialogTitleClass">
					<h4 :id="titleId" :class="titleClass" style="margin-left: 10px">{{ state.title }}</h4>
				</div>
			</template>
			<NoticeBar
				text="在添加/编辑数据库配置之前，记得先测试连接是否可用哟"
				leftIcon="iconfont icon-tongzhi2"
				background="#ecf5ff"
				color="#409eff"
				:speed="0"
			/>
			<el-form ref="ruleFormRef" size="default" label-width="100px" :model="state.form" :rules="state.rules">
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item class="mt20" label="数据库名称" prop="database_name">
							<el-input v-model="state.form.database_name" clearable /> </el-form-item
					></el-col>
					<el-col :span="12">
						<el-form-item class="mt20" label="host" prop="database_host">
							<el-input v-model="state.form.database_host" style="width: 100%" clearable /> </el-form-item
					></el-col>
					<el-col :span="12">
						<el-form-item class="mt20" label="port" prop="database_port">
							<el-input-number v-model="state.form.database_port" clearable /> </el-form-item
					></el-col>
					<el-col :span="12">
						<el-form-item class="mt20" label="user" prop="database_user">
							<el-input v-model="state.form.database_user" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item class="mt20" label="password" prop="database_password">
							<el-input v-model="state.form.database_password" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="12"
						><el-form-item class="mt20" label="schema" prop="database_schema">
							<template #label>
								<span>schema</span>
								<el-tooltip class="box-item" content="不输入schema时 进行查询需指定schema名称" effect="dark" placement="top">
									<el-icon class="ml5" style="color: #e6a23c">
										<ele-InfoFilled />
									</el-icon>
								</el-tooltip>
							</template>
							<el-input v-model="state.form.database_schema" clearable />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item class="mt20" label="描述" prop="remark">
							<el-input v-model="state.form.remark" :rows="2" type="textarea" clearable /> </el-form-item
					></el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<!-- <el-button size="default" style="float: left" @click="connection">测试连接</el-button> -->
					<!-- 测试连接 -->
					<el-button text :style="{ color: connectionStateCodeConfig[state.form.last_connection_state].color, float: 'left' }" @click="connection">
						<el-icon v-if="state.form.last_connection_state !== ConnectionStateEnum.Not">
							<Loading
								v-if="state.form.last_connection_state === ConnectionStateEnum.Loading"
								:style="{ color: connectionStateCodeConfig[state.form.last_connection_state].color, animation: 'rotating 2s linear infinite' }"
							/>
							<Select
								v-if="state.form.last_connection_state === ConnectionStateEnum.Success"
								:style="{ color: connectionStateCodeConfig[state.form.last_connection_state].color }"
							/>
							<CloseBold
								v-if="state.form.last_connection_state === ConnectionStateEnum.Fail"
								:style="{ color: connectionStateCodeConfig[state.form.last_connection_state].color }"
							/>
						</el-icon>
						{{ connectionStateCodeConfig[state.form.last_connection_state].text }}
					</el-button>
					<el-button size="default" @click="closeDialog"> 取消 </el-button>
					<el-button size="default" type="primary" @click="handleSubmit"> 提交 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<style lang="scss" scoped></style>
