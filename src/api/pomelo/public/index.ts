import request from '/@/utils/request';

export function publicAPI() {
	return {
		user_info_api: (user_id: string) => {
			return request({
				url: `/public/user_info/${user_id}`,
				method: 'get',
			});
		},
		user_info_list_api: () => {
			return request({
				url: `/public/user_info/list`,
				method: 'get',
			});
		},
		database_connection_mysql_api: (data: object) => {
			return request({
				url: '/public/database_connection/mysql',
				method: 'post',
				data,
			});
		},
	};
}
