import { request } from "@/utils/request.js";

// 轮播图
export function apiGetBanner() {
	return request({
		url: "/homeBanner"
	});
}

// 随机壁纸
export function apiGetDayRandom() {
	return request({ url: "/randomWall" });
}

// 公告列表
export function apiGetNotice(data = {}) {
	return request({
		url: "/wallNewsList",
		data
	});
}

// 公告详情
export function apiNoticeDetail(data = {}) {
	return request({
		url: `/wallNewsDetail/${data.id}`
	});
}

// 分类列表
export function apiGetClassify(data = {}) {
	return request({
		url: "/classify",
		data
	});
}

// 壁纸列表
export function apiGetClassList(data = {}) {
	return request({
		url: "/wallList",
		data
	});
}

// 壁纸详情
export function apiDetailWall(data = {}) {
	return request({
		url: `/detailWall/${data.id}`
	});
}

// 搜索壁纸
export function apiSearchData(data = {}) {
	return request({
		url: "/searchWall",
		data
	});
}

// 评分
export function apiGetSetupScore(data = {}) {
	return request({
		url: "/setupScore",
		method: "POST",
		data
	});
}

// 下载记录
export function apiWriteDownload(data = {}) {
	return request({
		url: "/downloadWall",
		method: "POST",
		data
	});
}

// 用户信息
export function apiUserInfo(data = {}) {
	return request({
		url: "/userInfo",
		data
	});
}

// 用户历史列表
export function apiGetHistoryList(data = {}) {
	return request({
		url: "/userWallList",
		data
	});
}
