export function compareTimestamp(timestamp) {
	const currentTime = new Date().getTime();
	const timeDiff = currentTime - timestamp;

	if (timeDiff < 60000) {
		return '1分钟内';
	} else if (timeDiff < 3600000) {
		return Math.floor(timeDiff / 60000) + '分钟';
	} else if (timeDiff < 86400000) {
		return Math.floor(timeDiff / 3600000) + '小时';
	} else if (timeDiff < 2592000000) {
		return Math.floor(timeDiff / 86400000) + '天';
	} else if (timeDiff < 7776000000) {
		return Math.floor(timeDiff / 2592000000) + '月';
	} else {
		return null;
	}
}

export function gotoHome() {
	uni.showModal({
		title: '提示',
		content: '页面有误将返回首页',
		showCancel: false,
		success: (res) => {
			if (res.confirm) {
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}
		}
	});
}

//页面间跳转
export function routerTo(url, type = 'navigateTo') {
	if (type == 'navigateTo') {
		uni.navigateTo({
			url,
			fail: (err) => {
				console.log(err);
				routerTo(url, 'reLaunch');
			}
		});
	} else if (type == 'reLaunch') {
		uni.reLaunch({
			url
		});
	} else if (type == 'redirectTo') {
		uni.redirectTo({
			url,
			fail: (err) => {
				console.log(err);
				routerTo(url, 'reLaunch');
			}
		});
	}
}

//点击返回上一页
export const goBack = () => {
	uni.navigateBack({
		success: (res) => {},
		fail: (err) => {
			uni.reLaunch({
				url: '/pages/index/index'
			});
		}
	});
};

//toast消息提示
export function showToast({ title = '', duration = 1500, icon = 'none', mask = false } = {}) {
	uni.showToast({
		title: String(title),
		icon,
		duration,
		mask
	});
}
