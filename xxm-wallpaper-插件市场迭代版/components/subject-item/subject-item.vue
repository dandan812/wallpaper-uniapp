<template>
	<view class="subjectItem" @click="routerTo('/pages/subject/detail?id=' + item._id)">
		<view class="pics">
			<view class="group">
				<view class="pic" v-for="item in item.picList" :key="item._id">
					<image :src="item.smallPicurl" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view class="text">
			<view class="title">{{ item.theme }}</view>
			<view class="info">
				<view class="view">{{ item.view_count }}人喜欢</view>

				<view class="size">
					<uni-icons type="image" size="20" color="#aaa"></uni-icons>
					<text>{{ item.size }}P</text>
				</view>
			</view>
		</view>
		<view class="line line1"></view>
		<view class="line line2"></view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { routerTo } from '@/utils/common.js';

const props = defineProps(['item']);
</script>

<style lang="scss" scoped>
.subjectItem {
	width: 100%;
	position: relative;
	.pics {
		width: 100%;
		aspect-ratio: 5 / 3;
		overflow: hidden;
		background: #fff;
		border-radius: 15rpx 15rpx 0 0;
		.group {
			width: 100%;
			height: 150%;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 7rpx;
			position: relative;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%) rotate(33deg) scale(1.238);
			.pic {
				order: 0;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.pic:nth-child(2) {
				order: -1;
			}
		}
	}
	.text {
		background: #fff;
		padding: 30rpx 20rpx;
		border: 1px solid #e3e5e7;
		border-top: none;
		border-radius: 0 0 15rpx 15rpx;
		.title {
			font-size: 40rpx;
			word-spacing: normal;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		.info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 26rpx;
			padding-top: 10rpx;
			color: #aaa;
			.size {
				display: flex;
				align-items: center;
				text {
					padding-left: 4rpx;
				}
			}
		}
	}
	.line {
		display: block;
		content: '';
		width: 90%;
		height: 12rpx;
		background: #e3e5e7;
		border-radius: 0 0 13rpx 13rpx;
		margin: 0 auto;
	}
	.line2 {
		width: 80%;
		height: 12rpx;
		background: #e3e5e7;
		opacity: 0.4;
		border-radius: 0 0 10rpx 10rpx;
	}
}
</style>
