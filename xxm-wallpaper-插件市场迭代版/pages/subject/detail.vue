<template>
	<view class="listLayout" v-if="Object.keys(detail).length">
		<view class="head" :style="`background-image: url(${detail.picList[0].smallPicurl});`">
			<view class="inner" :style="{ paddingTop: getStatusBarHeight() + 'px' }">
				<view :style="{ height: getTitleBarHeight() + 'px' }" class="backOut">
					<view class="goBack" @click="goBack">
						<uni-icons type="back" color="#fff" size="20"></uni-icons>
					</view>
				</view>
				<view class="theme">
					{{ detail.theme }}
				</view>
				<view class="day">{{ detail.day }}推荐</view>
				<view class="description" v-if="detail.description">
					{{ detail.description }}
				</view>
			</view>
		</view>

		<view class="content">
			<view class="size">共{{ detail.picList.length }}张，{{ detail.view_count }}人看过</view>
			<view class="list">
				<view class="item" v-for="item in detail.picList" :key="item._id">
					<picture-item :item="item" :classList="detail.picList"></picture-item>
				</view>
			</view>
			<view class="loadingLayout">
				<uni-load-more status="noData"></uni-load-more>
			</view>
		</view>
	</view>

	<view v-else class="loadingLayout" style="padding-top: 200rpx">
		<uni-load-more status="loading"></uni-load-more>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue';
import { getStatusBarHeight, getTitleBarHeight, getNavBarHeight } from '@/utils/layout.js';
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { showToast } from '@/utils/common';
import { apiSubjectDetail } from '@/api/apis';

//分类列表数据
const detail = ref({});

let id, name;

onLoad((e) => {
	({ id, name } = e);

	//执行获取分类列表方法
	getDetail();
});

//获取分类列表网络数据
const getDetail = async () => {
	let { data, errCode } = await apiSubjectDetail({ id });
	if (errCode !== 0) return showToast({ title: '查询有误' });
	detail.value = data;
	console.log(data);
};

//分享给好友
onShareAppMessage((e) => {
	return {
		title: name,
		path: '/pages/subject/detail?id=' + id + '&name=' + name
	};
});

//分享朋友圈
onShareTimeline(() => {
	return {
		title: name,
		query: 'id=' + id + '&name=' + name
	};
});

//返回上一页
const goBack = () => {
	uni.navigateBack({
		success: () => {},
		fail: (err) => {
			uni.reLaunch({
				url: '/pages/index/index'
			});
		}
	});
};
</script>

<style lang="scss" scoped>
.listLayout {
	.backOut {
		display: flex;
		align-items: center;
		.goBack {
			width: 38px;
			height: 38px;
			background: rgba(0, 0, 0, 0.5);
			margin-left: 30rpx;
			border-radius: 100px;
			backdrop-filter: blur(10rpx);
			border: 1rpx solid rgba(255, 255, 255, 0.3);
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.head {
		background-size: cover;
		position: relative;
		overflow: hidden;
		.inner {
			width: 100%;
			min-height: 200rpx;
			background-color: rgba(0, 0, 0, 0.2);
			backdrop-filter: blur(30px) saturate(180%);
			padding-bottom: 80rpx;
			.theme {
				color: #fff;
				font-weight: bolder;
				font-size: 50rpx;
				text-align: center;
				padding-left: 30rpx;
				padding-right: 30rpx;
			}

			.day {
				padding: 10rpx 30rpx 30rpx;
				font-size: 28rpx;
				color: #fff;
				text-align: center;
			}

			.description {
				font-size: 32rpx;
				padding: 30rpx;
				padding-top: 10rpx;
				color: rgba(255, 255, 255, 0.7);
				line-height: 1.7em;
			}

			&::before {
				content: '';
				display: block;
				width: 400rpx;
				height: 400rpx;
				border-radius: 50%;
				background: rgba(255, 255, 255, 0.07);
				position: absolute;
				right: -100rpx;
				top: -50rpx;
			}
			&::after {
				content: '';
				display: block;
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				background: rgba(255, 255, 255, 0.05);
				position: absolute;
				right: 250rpx;
				top: 150rpx;
			}
		}
	}

	.content {
		width: 100%;
		min-height: 500px;
		background: #fff;
		border-radius: 70rpx 70rpx 0 0;
		transform: translateY(-70rpx);
		.size {
			font-size: 22rpx;
			color: $text-font-color-3;
			line-height: 70rpx;
			text-align: center;
		}
		.list {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 15rpx;
			padding: 15rpx 30rpx;
			padding-top: 0;
			.item {
				height: 440rpx;
				border-radius: 18rpx;
				overflow: hidden;
			}
		}
	}
}
</style>
