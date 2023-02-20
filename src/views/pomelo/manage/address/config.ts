import { reactive } from 'vue';
import { manageProjectAPI } from '/@/api/pomelo/manage/project-api';
import { manageEnvAPI } from '/@/api/pomelo/manage/env-api';
import { manageAddressAPI } from '/@/api/pomelo/manage/address-api';
import { pomeloAPINotification } from '/@/utils/other';

const { project_query_api } = manageProjectAPI();

const { env_query_api } = manageEnvAPI();

const { address_query_api } = manageAddressAPI();

export const state = reactive({
	form: {
		project_id: '',
		env_id: '',
	},
	projectOptions: [],
	envOptions: [],
	tableData: [],
	loading: false,
});

/**
 * 查询
 */
export const handleQuery = async () => {
	state.tableData = [];
	state.loading = true;
	const { code, data: tableData, msg } = await address_query_api(state.form);
	if (pomeloAPINotification(code, msg)) {
		state.tableData = tableData;
	}
	state.loading = false;
};

/**
 * 查询项目Options
 */

export const hndleQueryProjectOptions = async () => {
	const { data: options } = await project_query_api({});
	state.projectOptions = options;
};

/**
 * 查询环境Options
 */

export const hndleQueryEnvOptions = async () => {
	const { data: options } = await env_query_api({ project_id: state.form.project_id });
	state.envOptions = options;
};

export const changeProjectID = async () => {
	state.form.env_id = '';
	await hndleQueryEnvOptions();
};
