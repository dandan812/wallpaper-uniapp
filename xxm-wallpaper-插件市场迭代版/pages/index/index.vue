<template>
	<view class="homeLayout pageBg">
		<!-- #ifndef MP-TOUTIAO -->
		<custom-nav-bar title="推荐"></custom-nav-bar>
		<!-- #endif -->

		<view class="banner">
			<swiper circular indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff" autoplay>
				<swiper-item v-for="item in bannerList" :key="item._id">
					<navigator v-if="item.target == 'miniProgram'" :url="item.url" class="like" target="miniProgram" :app-id="item.appid">
						<image :src="item.picurl" mode="aspectFill"></image>
					</navigator>

					<navigator v-else :url="`/pages/classlist/classlist?${item.url}`" class="like">
						<image :src="item.picurl" mode="aspectFill"></image>
					</navigator>
				</swiper-item>
			</swiper>
		</view>

		<view class="notice">
			<view class="left">
				<uni-icons type="sound-filled" size="20"></uni-icons>
				<text class="text">公告</text>
			</view>
			<view class="center">
				<swiper vertical autoplay interval="1500" duration="300" circular>
					<swiper-item v-for="item in noticeList" :key="item._id">
						<navigator :url="'/pages/notice/detail?id=' + item._id">
							{{ item.title }}
						</navigator>
					</swiper-item>
				</swiper>
			</view>
			<view class="right">
				<uni-icons type="right" size="16" color="#333"></uni-icons>
			</view>
		</view>

		<view class="quick">
			<view class="box" hover-class="boxHover" @click="routerTo('/pages_quick/ranking')">
				<image class="pic" src="https://cdn.qingnian8.com/project/bizhi/ranking.png" mode="aspectFill"></image>
			</view>
			<view class="box" hover-class="boxHover" @click="routerTo('/pages_quick/news')">
				<image class="pic" src="https://cdn.qingnian8.com/project/bizhi/upnew.png" mode="aspectFill"></image>
			</view>
		</view>

		<view class="select">
			<common-title>
				<template #name>每日推荐</template>
				<template #custom>
					<view class="date">
						<uni-icons type="calendar" size="18"></uni-icons>
						<view class="text">
							<uni-dateformat :date="Date.now()" format="dd日"></uni-dateformat>
						</view>
					</view>
				</template>
			</common-title>
			<view class="content">
				<scroll-view scroll-x>
					<view class="box" v-for="item in randomList" :key="item._id">
						<picture-item :item="item" :classList="randomList"></picture-item>
					</view>
				</scroll-view>
			</view>
		</view>

		<view class="theme">
			<common-title>
				<template #name>分类精选</template>
				<template #custom>
					<navigator url="/pages/classify/classify" open-type="reLaunch" class="more">More+</navigator>
				</template>
			</common-title>

			<view class="content">
				<theme-item v-for="item in classifyList" :key="item._id" :item="item"></theme-item>
				<theme-item :isMore="true"></theme-item>
			</view>
		</view>

		<!-- 专题推荐 -->
		<view class="subject">
			<common-title>
				<template #name>专题推荐</template>
				<template #custom>
					<navigator url="/pages/subject/subject" open-type="reLaunch" class="more">More+</navigator>
				</template>
			</common-title>

			<view class="content">
				<scroll-view scroll-x>
					<template v-if="subjectList.length">
						<view class="box" v-for="item in subjectList" :key="item._id">
							<subject-item :item="item"></subject-item>
						</view>
					</template>
					<template v-if="!subjectList.length">
						<view class="box" v-for="item in 2" :key="item">
							<uv-skeletons :skeleton="subjectSkeleton"></uv-skeletons>
						</view>
					</template>
				</scroll-view>
			</view>
		</view>

		<view class="copyright">技术支持：B站咸虾米</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { apiGetBanner, apiGetDayRandom, apiGetNotice, apiGetClassify, apiGetSubject } from '@/api/apis.js';
import { routerTo } from '@/utils/common.js';
const bannerList = ref([]);
const randomList = ref([]);
const noticeList = ref([]);
const classifyList = ref([]);
const subjectList = ref([]);

const subjectSkeleton = ref([
	{
		type: 'flex',
		children: [
			{
				type: 'custom',
				style: `aspectRatio:5/4;width: 500rpx;display: inlineBlock;marginRight: 16rpx;`
			}
		]
	}
]);

const getBanner = async () => {
	let res = await apiGetBanner();
	bannerList.value = res.data;
};

const getDayRandom = async () => {
	let res = await apiGetDayRandom();
	randomList.value = res.data;
};

const getNotice = async () => {
	let res = await apiGetNotice({ select: true });
	noticeList.value = res.data;
};

const getClassify = async () => {
	let res = await apiGetClassify({
		select: true
	});
	classifyList.value = res.data;
	console.log(res);
};

// 新增：获取专题推荐数据
const getSubject = async () => {
	let res = await apiGetSubject({ pageSize: 5 });
	subjectList.value = res.data;
	console.log(res);
};

//分享给好友
onShareAppMessage((e) => {
	return {
		title: '咸虾米壁纸，好看的手机壁纸',
		path: '/pages/classify/classify'
	};
});

//分享朋友圈
onShareTimeline(() => {
	return {
		title: '咸虾米壁纸，好看的手机壁纸'
	};
});

getBanner();
getDayRandom();
getNotice();
getClassify();
getSubject();
</script>

<style lang="scss" scoped>
.homeLayout {
	.banner {
		width: 750rpx;
		padding: 30rpx 0;
		swiper {
			width: 750rpx;
			height: 340rpx;
			&-item {
				width: 100%;
				height: 100%;
				padding: 0 30rpx;
				.like {
					width: 100%;
					height: 100%;
					image {
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
				}
			}
		}
	}
	.notice {
		width: 690rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: #f9f9f9;
		margin: 0 auto;
		border-radius: 80rpx;
		display: flex;
		.left {
			width: 140rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			:deep() {
				.uni-icons {
					color: $brand-theme-color !important;
				}
			}
			.text {
				color: $brand-theme-color;
				font-weight: 600;
				font-size: 28rpx;
			}
		}
		.center {
			flex: 1;
			swiper {
				height: 100%;
				&-item {
					height: 100%;
					font-size: 30rpx;
					color: #666;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
		.right {
			width: 70rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.quick {
		padding: 60rpx 30rpx 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.box {
			width: 330rpx;
			height: 150rpx;
			transition: 0.3s;
			.pic {
				width: 100%;
				height: 100%;
			}
		}
		.boxHover {
			transform: scale(0.96);
		}
	}

	.select {
		padding-top: 50rpx;
		.date {
			color: $brand-theme-color;
			display: flex;
			align-items: center;
			:deep() {
				.uni-icons {
					color: $brand-theme-color !important;
				}
			}
			.text {
				margin-left: 5rpx;
			}
		}
		.content {
			width: 720rpx;
			margin-left: 30rpx;
			margin-top: 30rpx;
			scroll-view {
				white-space: nowrap;
				.box {
					width: 200rpx;
					height: 430rpx;
					display: inline-block;
					margin-right: 15rpx;
					padding-bottom: 15rpx;
					image {
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
				}
				.box:last-child {
					margin-right: 30rpx;
				}
			}
		}
	}

	.theme {
		padding: 50rpx 0 0;
		.more {
			font-size: 32rpx;
			color: #888;
		}
		.content {
			margin-top: 30rpx;
			padding: 0 30rpx;
			display: grid;
			gap: 15rpx;
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.subject {
		padding-top: 50rpx;
		padding-bottom: 15rpx;
		.content {
			width: 720rpx;
			margin-left: 30rpx;
			margin-top: 30rpx;
			scroll-view {
				height: 100%;
				white-space: nowrap;
				padding-bottom: 10rpx;
				.box {
					min-height: 200rpx;
					position: relative;
					width: 500rpx;
					display: inline-block;
					margin-right: 16rpx;
					padding-bottom: 15rpx;
					&:last-child {
						margin-right: 30rpx;
					}
				}
			}
		}
	}
	.copyright {
		font-size: 18rpx;
		color: #aaa;
		text-align: center;
		padding-bottom: 30rpx;
	}
}
</style>
