import request from '/@/utils/request';

export function manageDatabaseAPI() {
	return {
		database_create_api: (data: object) => {
			return request({
				url: '/manage/database/create',
				method: 'post',
				data,
			});
		},
		database_update_api: (data: object) => {
			return request({
				url: '/manage/database/update',
				method: 'post',
				data,
			});
		},
		database_change_status_api: (data: object) => {
			return request({
				url: '/manage/database/change_status',
				method: 'post',
				data,
			});
		},
		database_query_api: (data: object) => {
			return request({
				url: '/manage/database/query',
				method: 'post',
				data,
			});
		},
		database_query_detail_api: (database_id: string) => {
			return request({
				url: '/manage/database/query_detail/' + database_id,
				method: 'get',
			});
		},
	};
}
