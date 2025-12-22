<template>
	<view class="ranking rankBg">
		<view :style="statusBarStyle"></view>
		<view class="goBack" :style="{ top: goBackTop + 'px' }" @click="goBack">
			<uni-icons type="back" color="#fff" size="20"></uni-icons>
		</view>
		<view class="circle">
			<view class="box"></view>
			<view class="box"></view>
		</view>
		<view class="title">
			<view class="item">壁纸</view>
			<view class="item">排行榜</view>
		</view>
		<view class="datetime">
			<uni-datetime-picker type="daterange" v-model="dataRange" :border="false" :clear-icon="false" rangeSeparator=" 至 " :start="start" :end="end" @change="dateChange" />
		</view>
		<view class="content">
			<view class="tabs">
				<view class="item" @click="clickTasbs(item.type)" :class="tabsActive == item.type ? 'active' : ''" v-for="item in tabs" :key="item.type">{{ item.text }}</view>
			</view>
			<view class="list" v-if="!loading">
				<view class="item" v-for="(item, index) in rank" :key="index">
					<view class="link">
						<view class="order" :style="{ color: index < 3 ? colors[index] : colors[colors.length - 1] }">
							No.
							<text>{{ item.idx + 1 }}</text>
						</view>
						<view class="pic">
							<picture-item :item="item" :classList="rank"></picture-item>
						</view>
						<view class="progress">
							<progress
								:percent="prgFormat(item.countTotal)"
								stroke-width="7"
								:active-color="index < 3 ? colors[index] : colors[colors.length - 1]"
								border-radius="10"></progress>
						</view>
						<view class="num">{{ formatNumber(item.countTotal) }}</view>
					</view>
				</view>
			</view>

			<view class="skeletons" v-else>
				<uv-skeletons :loading="loading" :skeleton="skeleton"></uv-skeletons>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onUnload, onReachBottom, onShareAppMessage } from '@dcloudio/uni-app';
import { getStatusBarHeight, getTitleBarHeight, toHeightStyle, getMpMenuRect } from '@/utils/layout';
import { formatNumber, getDateRange } from '@/utils/tools';
import { showToast } from '@/utils/common';
import { apiRank } from '@/api/apis.js';

const statusBarStyle = ref(toHeightStyle(getStatusBarHeight()));
const titleBarStyle = ref(toHeightStyle(getTitleBarHeight()));
const goBackTop = ref(getStatusBarHeight() + (getTitleBarHeight() - 30) / 2);
const colors = ref(['#EE6666', '#FC8452', '#FAC858', '#b1b5b3']);
const tabs = ref([
	{ text: '下载榜', type: 'download' },
	{ text: '评分榜', type: 'score' }
]);
const tabsActive = ref('download');
const rank = ref([]);
const dataRange = ref(getDateRange());
const start = ref(Date.now() - 15552000000);
const end = ref(Date.now());
const loading = ref(true);
const skeleton = ref([
	{
		type: 'flex',
		num: 6,
		gap: '30rpx',
		children: [
			{
				type: 'custom',
				num: 1,
				style: 'width:50rpx;height:50rpx;borderRadius:50%;marginRight: 30rpx'
			},
			{
				type: 'line',
				num: 1,
				gap: '30rpx',
				style: ['width: 100%;height:50rpx']
			}
		]
	}
]);

const prgFormat = (curt) => {
	let max = rank.value[0].countTotal;
	let value = (curt * 100) / max;
	return value;
};

//点击切换tabs
const clickTasbs = (type) => {
	if (loading.value) return showToast({ title: '数据加载中，请稍后...' });
	tabsActive.value = type;
	getRank();
};

const getRank = async () => {
	rank.value = [];
	loading.value = true;
	let { data, errCode } = await apiRank({ type: tabsActive.value, dataRange: dataRange.value.join() });
	data = data.map((item, index) => ({ ...item, idx: index }));
	console.log(data);
	rank.value = data;
	loading.value = false;
};

//日期选择
const dateChange = () => {
	getRank();
};

//点击返回上一页
const goBack = () => {
	uni.navigateBack({
		success: (res) => {},
		fail: (err) => {
			uni.reLaunch({
				url: '/pages/index/index'
			});
		}
	});
};

onShareAppMessage((res) => {
	return {
		title: '壁纸排行榜',
		path: '/pages_quick/ranking'
	};
});

getRank();
</script>

<style lang="scss" scoped>
.rankBg {
	background: linear-gradient(to bottom, #a4e6f2, transparent 800rpx);
	min-height: 100vh;
}
.ranking {
	position: relative;
	width: 100vw;
	overflow-x: hidden;
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
	.datetime {
		position: absolute;
		z-index: 12;
		right: 30rpx;
		top: 200rpx;
		:deep() {
			.uni-date-x {
				background: none;
				color: #00bcd4;
				transform: scale(0.95);
				transform-origin: right top;
			}
			.icon-calendar {
				text {
					color: #00bcd4 !important;
				}
			}
		}
	}
	.skeletons {
		background: #fff;
		min-height: 80vh;
		border-radius: 0 0 20rpx 20rpx;
		padding: 60rpx 30rpx;
	}
	.content {
		width: 690rpx;
		margin: 60rpx auto;
		.tabs {
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			.item {
				width: 50%;
				background: #f7f7f7;
				height: 80rpx;
				border-radius: 20rpx 20rpx 0 0;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 36rpx;
				color: #666;
				transition: height 0.3s;
				&.active {
					background: #fff url('https://cdn.qingnian8.com/project/bizhi/tabsActive.png') no-repeat center calc(100% - 10rpx);
					height: 100rpx;
					font-size: 44rpx;
					font-weight: bolder;
					color: #000;
					background-size: 60%;
				}
			}
		}
		.list {
			background: #fff;
			min-height: 50vh;
			border-radius: 0 0 20rpx 20rpx;
			padding: 30rpx;
			.item {
				.link {
					display: flex;
					align-items: center;
					padding: 16rpx 0;
					.order {
						width: 90rpx;
						font-size: 25rpx;
						font-weight: bolder;
						line-height: 1em;
						text {
							font-size: 30rpx;
						}
					}
					.pic {
						width: 75rpx;
						height: 120rpx;
						border-radius: 10rpx;
						overflow: hidden;
					}
					.progress {
						flex: 1;
						padding: 0 40rpx;
					}
					.num {
						width: 80rpx;
						font-size: 30rpx;
						color: #666;
					}
				}
				.ad {
					padding: 30rpx 0rpx;
					box-sizing: border-box;
					ad {
						width: 100%;
					}
				}
			}
		}
	}
}
</style>
