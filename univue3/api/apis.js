import { request } from "@/utils/request.js";

// 轮播图
export function apiGetBanner() {
	return request({
		url: "/banners"
	});
}

// 随机壁纸
export function apiGetDayRandom() {
	return request({ url: "/wallpapers/random" });
}

// 公告列表
export function apiGetNotice(data = {}) {
	return request({
		url: "/notices",
		data
	});
}

// 公告详情
export function apiNoticeDetail(data = {}) {
	return request({
		url: `/notices/${data.id}`
	});
}

// 分类列表
export function apiGetClassify(data = {}) {
	return request({
		url: "/categories",
		data
	});
}

// 壁纸列表
export function apiGetClassList(data = {}) {
	return request({
		url: "/wallpapers",
		data
	});
}

// 壁纸详情
export function apiDetailWall(data = {}) {
	return request({
		url: `/wallpapers/${data.id}`
	});
}

// 搜索壁纸
export function apiSearchData(data = {}) {
	return request({
		url: "/wallpapers/search",
		data
	});
}

// 评分
export function apiGetSetupScore(data = {}) {
	return request({
		url: "/wallpapers/score",
		method: "POST",
		data
	});
}

// 下载记录
export function apiWriteDownload(data = {}) {
	return request({
		url: "/wallpapers/download",
		method: "POST",
		data
	});
}

// 用户信息
export function apiUserInfo(data = {}) {
	return request({
		url: "/users/me",
		data
	});
}

// 用户历史列表
export function apiGetHistoryList(data = {}) {
	return request({
		url: "/users/wallpapers",
		data
	});
}
