<template>
	<view class="userLayout pageBg" v-if="userinfo">
		<view :style="{height:getNavBarHeight()+'px'}"></view>
		<view class="userInfo">
			<view class="avatar">
				<image src="../../static/images/xxmLogo.png" mode="aspectFill"></image>
			</view>
			<view class="ip">{{userinfo.IP}}</view>
			<view class="address">来自于：
	{{ userinfo.address.city || userinfo.address.province || userinfo.address.country}}

			</view>
		</view>
				
		
		<view class="section">
			<view class="list">
				<navigator 
				url="/pages/classlist/classlist?name=我的下载&type=download" 
				class="row">
					<view class="left">
						<uni-icons type="download-filled" size="20" ></uni-icons>
						<view class="text">我的下载</view>
					</view>
					<view class="right">
						<view class="text">{{userinfo.downloadSize}}</view>
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
				</navigator>
				
				<navigator  
				url="/pages/classlist/classlist?name=我的评分&type=score" 
				class="row">
					<view class="left">
						<uni-icons type="star-filled" size="20"></uni-icons>
						<view class="text">我的评分</view>
					</view>
					<view class="right">
						<view class="text">{{userinfo.scoreSize}}</view>
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
				</navigator>
				
				<view class="row">
					<view class="left">
						<uni-icons type="chatboxes-filled" size="20"></uni-icons>
						<view class="text">联系客服</view>
					</view>
					<view class="right">
						<view class="text"></view>
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
					<!-- #ifdef MP -->
					<button open-type="contact">联系客服</button>
					<!-- #endif -->
					<!-- #ifndef MP -->
					<button @click="clickContact">拨打电话</button>
					<!-- #endif -->				
					
					
				</view>
			</view>
		</view>
		
		<view class="section">
			<view class="list">
				<navigator url="/pages/notice/detail?id=1" class="row">
					<view class="left">
						<uni-icons type="notification-filled" size="20"></uni-icons>
						<view class="text">订阅更新</view>
					</view>
					<view class="right">
						<view class="text"></view>
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
				</navigator>
				
				<navigator url="/pages/notice/detail?id=2" class="row">
					<view class="left">
						<uni-icons type="flag-filled" size="20"></uni-icons>
						<view class="text">常见问题</view>
					</view>
					<view class="right">
						<view class="text"></view>
						<uni-icons type="right" size="15" color="#aaa"></uni-icons>
					</view>
				</navigator>
			</view>
		</view>
		
	</view>
	
	<view class="loadingLayout" v-else>
		<view :style="{height:getNavBarHeight()+'px'}"></view>
		<uni-load-more status="loading"></uni-load-more>
	</view>
</template>

<script setup>
import {getNavBarHeight} from "@/utils/system.js"
import {apiUserInfo} from "@/api/apis.js"
import { ref } from "vue";

const userinfo = ref(null)

const clickContact = ()=>{
	uni.makePhoneCall({
		phoneNumber:"114"
	})
}

const getUserInfo = ()=>{
	apiUserInfo().then(res=>{
		console.log(res);
		userinfo.value = res.data
	})
}

getUserInfo();
</script>

<style lang="scss" scoped>
.userLayout{
	padding-bottom: 80rpx;
	.userInfo{
		width: 690rpx;
		margin: 10rpx auto 0;
		padding: 40rpx 32rpx 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		border-radius: 36rpx;
		background: rgba(255,255,255,0.72);
		border: 1px solid rgba(255,255,255,0.85);
		box-shadow: 0 24rpx 60rpx rgba(15, 35, 25, 0.08);
		backdrop-filter: blur(18rpx);
		.avatar{
			width: 168rpx;
			height: 168rpx;
			border-radius: 50%;
			overflow: hidden;
			padding: 10rpx;
			background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.55));
			box-shadow: 0 18rpx 40rpx rgba(40,179,137,0.16);
			image{
				width: 100%;
				height: 100%;
				border-radius: 50%;
				display: block;
			}
		}
		.ip{
			font-size: 50rpx;
			font-weight: 600;
			color:#243247;
			letter-spacing: 1rpx;
			padding:26rpx 0 10rpx;
		}
		.address{
			font-size: 28rpx;
			color:#7f8a98;
			line-height: 1.6;
			text-align: center;
		}
	}
	
	.section{
		width: 690rpx;
		margin: 26rpx auto 0;
		border-radius: 30rpx;
		overflow: hidden;
		border: 1px solid rgba(255,255,255,0.9);
		background: rgba(255,255,255,0.82);
		box-shadow: 0 20rpx 50rpx rgba(15, 35, 25, 0.07);
		.list{
			.row{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding:0 30rpx 0 28rpx;
				min-height: 116rpx;
				border-bottom: 1px solid rgba(36,50,71,0.06);
				position: relative;
				background: transparent;
				&:last-child{border-bottom:0}
				.left{
					display: flex;
					align-items: center;
					flex: 1;
					min-width: 0;
					gap: 18rpx;
					:deep(){
						.uni-icons{
							color:$brand-theme-color !important;
							font-size: 22px !important;
						}
					}
					.text{
						color:#334155;
						font-size: 34rpx;
						font-weight: 500;
						line-height: 1.2;
					}
				}
				.right{
					display: flex;
					align-items: center;
					justify-content: flex-end;
					gap: 8rpx;
					position: absolute;
					right: 30rpx;
					top: 50%;
					transform: translateY(-50%);
					.text{
						text-align: right;
						font-size: 34rpx;
						font-weight: 500;
						color:#90a0b3;
						line-height: 1;
						white-space: nowrap;
					}
					.text:empty{
						display: none;
					}
					:deep(){
						.uni-icons{
							color:#b8c2cf !important;
							font-size: 18px !important;
						}
					}
				}
				button{
					position: absolute;
					top:0;
					left:0;
					height: 116rpx;
					width:100%;
					opacity: 0;
				}
			}
		}
	}
}
</style>
