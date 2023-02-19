import { reactive } from 'vue';
import { manageProjectAPI } from '/@/api/pomelo/manage/project-api';
import { pomeloAPINotification } from '/@/utils/other';

const { project_query_api } = manageProjectAPI();

export const state = reactive({
	form: {
		project_name: '',
	},
	tableData: [],
});

/**
 * 查询
 */
export const handleQuery = async () => {
	state.tableData = [];
	const { code, data: tableData, msg } = await project_query_api(state.form);
	if (pomeloAPINotification(code, msg)) {
		state.tableData = tableData;
	}
};
