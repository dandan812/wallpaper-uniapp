<template>
	<view class="layout">
		<view class="navbar">
			<view class="statusBar" :style="{height:getStatusBarHeight()+'px'}"></view>
			<view class="titleBar" 
			:style="{height:getTitleBarHeight()+'px',marginLeft:getLeftIconLeft()+'px'}">
				<view class="title">{{title}}</view>
				<navigator url="/pages/search/search" class="search">
					 <uni-icons class="icon" type="search" color="#888" size="18"></uni-icons>
					 <text class="text">搜索</text>
				</navigator>
			</view>
		</view>
		
		<view class="fill" :style="{height:getNavBarHeight()+'px'}">
			
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import {getStatusBarHeight,getTitleBarHeight,getNavBarHeight,getLeftIconLeft} from "@/utils/system.js"

defineProps({
	title:{
		type:String,
		default:"壁纸"
	}
})


</script>

<style lang="scss" scoped>
.layout{
	.navbar{
		position: fixed;
		top:0;
		left:0;
		width: 100%;
		z-index: 10;
		background:
		linear-gradient(to bottom,transparent,#fff 400rpx),
		linear-gradient(to right,#beecd8 20%,#F4E2D8);
		.statusBar{}
		.titleBar{
			display: flex;	
			align-items: center;
			padding:0 30rpx;
				
			.title{
				font-size: 22px;
				font-weight: 700;
				color: $text-font-color-1;
			}
			.search{
				  width: 220rpx;
				  height: 50rpx;
				  border-radius: 60rpx;
				  background: rgba(255,255,255,0.4);
				  border:1px solid #fff;
				  margin-left:30rpx;
				  color:#999;
				  font-size: 28rpx;
				  display: flex;
				  align-items: center;
				  .icon{
					  margin-left:5rpx;
				  }
				  .text{
					  padding-left:10rpx;
				  }
			}
		}
	}
	.fill{
		
	}
}

@media screen and (min-width: 960px) {
	.layout{
		.navbar{
			background:
			linear-gradient(to bottom, rgba(255,255,255,0.92), rgba(255,255,255,0.72) 68%, rgba(255,255,255,0.3) 100%),
			linear-gradient(to right,#beecd8 20%,#F4E2D8);
			backdrop-filter: blur(16px);
			border-bottom: 1px solid rgba(255,255,255,0.7);

			.titleBar{
				max-width: 1280px;
				margin: 0 auto !important;
				padding: 0 24px;
				justify-content: space-between;

				.search{
					width: 280px;
					height: 40px;
					margin-left: 24px;
					font-size: 16px;

					.icon{
						margin-left: 10px;
					}
				}
			}
		}
	}
}
</style>
