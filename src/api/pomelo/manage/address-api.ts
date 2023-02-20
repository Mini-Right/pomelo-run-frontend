import request from '/@/utils/request';

export function manageAddressAPI() {
	return {
		address_create_api: (data: object) => {
			return request({
				url: '/manage/address/create',
				method: 'post',
				data,
			});
		},
		address_update_api: (data: object) => {
			return request({
				url: '/manage/address/update',
				method: 'post',
				data,
			});
		},
		address_set_default_api: (data: object) => {
			return request({
				url: '/manage/address/set_default',
				method: 'post',
				data,
			});
		},
		address_query_api: (data: object) => {
			return request({
				url: '/manage/address/query',
				method: 'post',
				data,
			});
		},
		address_query_detail_api: (address_id: string) => {
			return request({
				url: '/manage/address/query_detail/' + address_id,
				method: 'get',
			});
		},
	};
}
