export function formatUpdateTime(timestamp) {
	const currentTime = Date.now();
	const timeDifference = currentTime - timestamp;
	// 計算時間差的分鐘數、小時數、天數和月數
	const minutes = Math.floor(timeDifference / (1000 * 60));
	const hours = Math.floor(timeDifference / (1000 * 60 * 60));
	const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
	if (minutes < 1) {
		return `1分钟`;
	} else if (minutes < 60) {
		return `${minutes}分钟`;
	} else if (hours < 24) {
		return `${hours}小时`;
	} else if (days < 31) {
		return `${days}天`;
	} else if (months < 3) {
		return `${months}月`;
	} else {
		return null;
	}
}

//数字补充0
export function addLeadingZero(num) {
	return num < 10 ? '0' + num : num.toString();
}

//数字格式化方法
export function formatNumber(num) {
	if (num >= 10000) {
		// 超过1万显示为w单位，保留1位小数
		return (num / 10000).toFixed(1) + 'w';
	} else if (num >= 1000) {
		// 超过1千显示为k单位，保留1位小数
		return (num / 1000).toFixed(1) + 'k';
	}
	// 不足1千直接返回原数字
	return num.toString();
}

/**
 * 根据当前日期返回包含7天前和当前日期的数组，格式为年-月-日
 * @param {Date} [customDate] 可选，自定义基准日期（默认使用当前日期）
 * @returns {string[]} 数组[7天前日期, 当前日期]
 */
export function getDateRange(customDate) {
	// 确定基准日期（优先使用自定义日期，否则用当前日期）
	const currentDate = customDate ? new Date(customDate) : new Date();

	// 复制当前日期对象，避免修改原对象
	const sevenDaysAgo = new Date(currentDate);
	// 减去7天的毫秒数（1天=24小时×60分钟×60秒×1000毫秒）
	sevenDaysAgo.setDate(currentDate.getDate() - 7);

	/**
	 * 格式化日期为年-月-日（补零处理）
	 * @param {Date} date 日期对象
	 * @returns {string} 格式化后的日期字符串
	 */
	function formatDate(date) {
		const year = date.getFullYear();
		// 月份从0开始，需+1，补零到2位
		const month = String(date.getMonth() + 1).padStart(2, '0');
		// 日期补零到2位
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	// 返回格式化后的日期数组
	return [formatDate(sevenDaysAgo), formatDate(currentDate)];
}
