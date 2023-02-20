import request from '/@/utils/request';

export function manageEnvAPI() {
	return {
		env_create_api: (data: object) => {
			return request({
				url: '/manage/env/create',
				method: 'post',
				data,
			});
		},
		env_update_api: (data: object) => {
			return request({
				url: '/manage/env/update',
				method: 'post',
				data,
			});
		},
		env_set_default_api: (data: object) => {
			return request({
				url: '/manage/env/set_default',
				method: 'post',
				data,
			});
		},
		env_query_api: (data: object) => {
			return request({
				url: '/manage/env/query',
				method: 'post',
				data,
			});
		},
		env_query_detail_api: (env_id: string) => {
			return request({
				url: '/manage/env/query_detail/' + env_id,
				method: 'get',
			});
		},
	};
}
