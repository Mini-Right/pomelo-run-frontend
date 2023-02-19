import { reactive, defineAsyncComponent } from 'vue';
import { manageDatabaseAPI } from '/@/api/pomelo/manage/database-api';
import { pomeloAPINotification } from '/@/utils/other';
/* 连接状态 */
export const ConnectionState = defineAsyncComponent(() => import('/@/components/pomelo/connectionState.vue'));
/* 人员卡片 */
export const Chip = defineAsyncComponent(() => import('/@/components/pomelo/chip.vue'));
/* 管理状态 */
export const ManageStatus = defineAsyncComponent(() => import('/@/components/pomelo/manageStatus.vue'));

const { database_query_api, database_change_status_api } = manageDatabaseAPI();

export const state = reactive({
	form: {
		database_name: '',
	},
	tableData: [],
});

/**
 * 查询
 */
export const handleQuery = async () => {
	state.tableData = [];
	const { code, data: tableData, msg } = await database_query_api(state.form);
	if (pomeloAPINotification(code, msg)) {
		state.tableData = tableData;
	}
};

/**
 * 变更数据库状态
 * @param status 状态
 * @param database_id 数据库ID
 */
export const handleStatus = async (status: number, database_id: string) => {
	const { code, msg } = await database_change_status_api({
		database_id: database_id,
		status: status,
	});
	if (pomeloAPINotification(code, msg)) {
		await handleQuery();
	}
};
