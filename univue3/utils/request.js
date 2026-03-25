import { BASE_URL, getAccessKey } from '@/config/env.js';

export function request(config = {}) {
	let {
		url,
		data = {},
		method = "GET",
		header = {}
	} = config;

	// 使用配置的 BASE_URL
	url = BASE_URL + url;

	// 使用配置的 access-key
	header['access-key'] = getAccessKey();

	return new Promise((resolve, reject) => {
		uni.request({
			url,
			data,
			method,
			header,
			success: res => {
				if (res.data.errCode === 0) {
					resolve(res.data);
				} else if (res.data.errCode === 400) {
					uni.showModal({
						title: "错误提示",
						content: res.data.errMsg,
						showCancel: false
					});
					reject(res.data);
				} else {
					uni.showToast({
						title: res.data.errMsg,
						icon: "none"
					});
					reject(res.data);
				}
			},
			fail: err => {
				uni.showToast({
					title: "网络请求失败",
					icon: "none"
				});
				reject(err);
			}
		});
	});
}
