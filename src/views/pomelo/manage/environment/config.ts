import { reactive } from 'vue';
import { manageEnvAPI } from '/@/api/pomelo/manage/env-api';
import { pomeloAPINotification } from '/@/utils/other';
import { manageProjectAPI } from '/@/api/pomelo/manage/project-api';

const { project_query_api } = manageProjectAPI();

const { env_query_api } = manageEnvAPI();
export const state = reactive({
	form: {
		project_id: '',
	},
	projectOptions: [],
	tableData: [],
	loading: false,
});

/**
 * 查询
 */
export const handleQuery = async () => {
	state.tableData = [];
	state.loading = true;
	const { code, data: tableData, msg } = await env_query_api(state.form);
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
