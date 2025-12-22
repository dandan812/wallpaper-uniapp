<template>
	<view class="news nsBg">
		<view :style="statusBarStyle"></view>
		<view class="goBack" :style="{ top: goBackTop + 'px' }" @click="goBack">
			<uni-icons type="back" color="#fff" size="20"></uni-icons>
		</view>
		<view class="circle">
			<view class="box"></view>
			<view class="box"></view>
		</view>
		<view class="title">
			<view class="item">近期上新</view>
			<view class="item">壁纸</view>
		</view>
		<view class="content">
			<view class="skeletons" v-if="!listData.length">
				<uv-skeletons :loading="!listData.length" :skeleton="skeleton"></uv-skeletons>
			</view>
			<view class="list">
				<view class="item" :class="item.ad ? 'aditem' : ''" v-for="(item, index) in listData" :key="index">
					<view class="link" v-if="!item.ad">
						<picture-item :item="item" :classList="listData"></picture-item>
					</view>

					<view v-else class="wxAd">
						<!-- #ifdef MP-WEIXIN -->
						<ad unit-id="adunit-fb844e826db2ca11" ad-type="video" ad-theme="white"></ad>
						<!-- #endif -->
					</view>
				</view>
			</view>

			<view class="pageLoading" v-if="noData || listData.length">
				<uni-load-more :status="noData ? 'noMore' : 'loading'" />
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onUnload, onReachBottom, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { getStatusBarHeight, getTitleBarHeight, toHeightStyle, getMpMenuRect } from '@/utils/layout';
import { formatNumber } from '@/utils/tools';
import { showToast, goBack } from '@/utils/common';
import { apiUptodate } from '@/api/apis.js';
const statusBarStyle = ref(toHeightStyle(getStatusBarHeight()));
const titleBarStyle = ref(toHeightStyle(getTitleBarHeight()));
const goBackTop = ref(getStatusBarHeight() + (getTitleBarHeight() - 30) / 2);

const listData = ref([]);
const noData = ref(false);
const queryParams = ref({
	pageNum: 1,
	pageSize: 12
});
const skeleton = ref([
	{
		type: 'flex',
		num: 1,
		gap: '15rpx',
		children: [
			{
				type: 'custom',
				style: 'width:210rpx;height:440rpx;'
			},
			{
				type: 'custom',
				style: 'width:210rpx;height:440rpx;marginLeft:15rpx;'
			},
			{
				type: 'custom',
				style: 'width:210rpx;height:440rpx;marginLeft:15rpx;'
			}
		]
	},
	{
		type: 'flex',
		num: 1,
		gap: '15rpx',
		children: [
			{
				type: 'custom',
				style: 'width:210rpx;height:440rpx;marginTop:15rpx;'
			},
			{
				type: 'custom',
				style: 'width:210rpx;height:440rpx;marginLeft:15rpx;marginTop:15rpx;'
			}
		]
	}
]);

const getList = async () => {
	let { data, errCode } = await apiUptodate(queryParams.value);
	// #ifdef MP-WEIXIN
	if (data.length > 9) data.splice(9, 0, { ad: true });
	// #endif
	listData.value = [...listData.value, ...data];
	if (queryParams.value.pageSize > data.length) noData.value = true;
	console.log(data);
};

//触底加载更多
onReachBottom(() => {
	if (noData.value) return;
	queryParams.value.pageNum++;
	getList();
});

onShareAppMessage((res) => {
	return {
		title: '近期上新',
		path: '/pages_quick/news'
	};
});

onShareTimeline((res) => {
	return {
		title: '近期上新'
	};
});

getList();
</script>

<style lang="scss" scoped>
.nsBg {
	background: linear-gradient(to bottom, #f4e2d8, transparent 800rpx);
	min-height: 100vh;
}
.news {
	position: relative;
	.title {
		font-size: 106rpx;
		font-weight: bolder;
		padding-left: 60rpx;
		padding-top: 40rpx;
		line-height: 1.2em;
		position: relative;
		z-index: 10;
		.item {
			font-style: italic;
		}
	}
	.circle {
		.box {
			position: absolute;
			border-radius: 50%;
			background-blend-mode: multiply;
		}
		.box:nth-child(1) {
			width: 500rpx;
			height: 500rpx;
			background: rgba(255, 255, 255, 0.25);
			right: -100rpx;
			top: -50rpx;
		}
		.box:nth-child(2) {
			width: 200rpx;
			height: 200rpx;
			background: rgba(255, 255, 255, 0.35);
			left: 30rpx;
			top: 260rpx;
		}
	}
	.content {
		width: 690rpx;
		margin: 60rpx auto;
		padding-bottom: 100rpx;
		.list {
			background: #fff;
			min-height: 50vh;
			border-radius: 20rpx;
			padding: 15rpx;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 15rpx;
			.item {
				height: 440rpx;
				border-radius: 18rpx;
				overflow: hidden;
				.link {
					width: 100%;
					height: 100%;
				}
			}
		}
		.skeletons {
			background: #fff;
			min-height: 50vh;
			border-radius: 20rpx;
			padding: 15rpx;
		}
	}
	.aditem {
		grid-column: 1/4;
		height: auto !important;
		width: 100%;
	}
}
</style>
