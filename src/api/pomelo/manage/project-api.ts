import request from '/@/utils/request';

export function manageProjectAPI() {
	return {
		project_create_api: (data: object) => {
			return request({
				url: '/manage/project/create',
				method: 'post',
				data,
			});
		},
		project_update_api: (data: object) => {
			return request({
				url: '/manage/project/update',
				method: 'post',
				data,
			});
		},
		project_change_status_api: (data: object) => {
			return request({
				url: '/manage/project/change_status',
				method: 'post',
				data,
			});
		},
		project_query_api: (data: object) => {
			return request({
				url: '/manage/project/query',
				method: 'post',
				data,
			});
		},
		project_query_detail_api: (project_id: string) => {
			return request({
				url: '/manage/project/query_detail/' + project_id,
				method: 'get',
			});
		},
	};
}
