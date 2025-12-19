<template>
	<view class="subjectLayout">
		<!-- #ifndef MP-TOUTIAO -->
		<custom-nav-bar title="专题" :search="true"></custom-nav-bar>
		<navbar-fillbox></navbar-fillbox>
		<!-- #endif -->
		
		<view class="subject-list">	
			<view 
				class="subject-item" 
				v-for="item in subjectList" 
				:key="item.id"
				@click="goSubjectDetail(item.id)"
			>
				<view class="subject-image">
					<!-- 第一张图片（中间） -->
					<view 
						class="collage-img img-center" 
						v-if="item.imageUrls[0]"
						:style="{ backgroundImage: `url(${item.imageUrls[0]})` }"
					></view>
					
					<!-- 第二张图片（左上角） -->
					<view 
						class="collage-img img-top-left" 
						v-if="item.imageUrls[1]"
						:style="{ backgroundImage: `url(${item.imageUrls[1]})` }"
					></view>
					
					<!-- 第三张图片（右下角） -->
					<view 
						class="collage-img img-bottom-right" 
						v-if="item.imageUrls[2]"
						:style="{ backgroundImage: `url(${item.imageUrls[2]})` }"
					></view>
					
					<!-- 如果没有图片，显示占位 -->
					<view class="no-images-placeholder" v-if="item.imageUrls.length === 0">
						<uni-icons type="picture" size="40" color="#ccc"></uni-icons>
						<text class="placeholder-text">暂无图片</text>
					</view>
				</view>
				
				<view class="subject-info">
					<view class="subject-title">{{item.title}}</view>
					<view class="subject-meta">
						<view class="meta-left">
							<uni-icons type="heart-filled" size="14" color="#ff6b6b"></uni-icons>
							<text class="like-count">{{item.likes}}人喜欢</text>
						</view>
						<view class="meta-right">
							<text class="image-count">{{item.imageCount}}P</text>
						</view>
					</view>
				</view>
			</view>
		</view>
			
		<!-- 加载更多按钮 -->
		<view class="load-more" v-if="!noMore && subjectList.length > 0">
			<button class="load-more-btn" @click="loadMore" :disabled="loading">
				<text v-if="!loading">获取更多专题</text>
				<view v-else class="loading">
					<uni-icons type="refresh" size="16" class="loading-icon"></uni-icons>
					<text>加载中...</text>
				</view>
			</button>
		</view>		
		
		<!-- 空状态 -->
		<view class="empty-state" v-if="!loading && subjectList.length === 0 && !error">
			<image src="/static/images/empty-subject.png" mode="aspectFit" class="empty-image"></image>
			<text class="empty-text">暂无专题推荐</text>
			<button class="empty-btn" @click="getSubject">重新加载</button>
		</view>
		
		<!-- 错误状态 -->
		<view class="error-state" v-if="error">
			<uni-icons type="cloud-upload" size="60" color="#ccc"></uni-icons>
			<text class="error-text">加载失败</text>
			<button class="retry-btn" @click="retryLoad">重新加载</button>
		</view>
		
	</view>
</template>

<script setup>

import {ref} from "vue";	
import { onLoad,onShareAppMessage,onShareTimeline } from "@dcloudio/uni-app"
import {apiGetSubject} from "@/api/apis.js"

const subjectList = ref([]); // 初始化为空数组
const loading = ref(false);
const noMore = ref(false);
const error = ref(false);
const showSearch = ref(false);
const keyword = ref('');

const allDataList = ref([]); // 存储从API获取的所有数据
const page = ref(1); // 当前页码
const pageSize = ref(2); // 定义每次加载的数目
const totalLoaded = ref(0); // 已加载的总数

// 获取专题数据
const getSubject = async () => {	
	if (loading.value) return;
	
	loading.value = true;
	error.value = false;
	
	try {
		// 调用数据
		let res =await apiGetSubject();	
		
		// 处理响应数据
		let data = res.data;
		
		// 如果返回的是字符串，尝试解析JSON
		if (typeof data === 'string') {
			try {
				data = JSON.parse(data);
			} catch (e) {
				console.error('JSON解析错误:', e);
				data = { errCode: -1, data: [] };
				throw new Error('数据格式错误');
			}
		}
		
		// 检查数据结构
		if (data && data.errCode === 0 && data.data && Array.isArray(data.data)) {
			// 处理并格式化数据
			allDataList.value = data.data.map(item => {
				
				// 获取最多三张图片的URL
				let imageUrls = [];
				if (item.picList && Array.isArray(item.picList)) {
					const maxImages = Math.min(item.picList.length, 3);
					for (let i = 0; i < maxImages; i++) {
						if (item.picList[i] && item.picList[i].smallPicurl) {
							let imgUrl = item.picList[i].smallPicurl;
							imageUrls.push(imgUrl);
						}
					}
				}
				
				// 如果没有图片，使用默认图
				if (imageUrls.length === 0) {
					imageUrls = [
						'/static/images/default-subject.png',
						'/static/images/default-subject.png',
						'/static/images/default-subject.png'
					];
				}
				
				
				return {
					id: item._id ,
					imageUrls: imageUrls,
					title: item.theme || '专题标题',
					likes: item.view_count || 0,
					imageCount: item.size || 0,
					rawData: item
				};
			}); 
			
			// console.log('处理后的专题数据:', allDataList.value);
			
			// 如果数据为空，不显示任何内容（保持空数组）
			if (allDataList.value.length === 0) {
				console.log('专题数据为空');
			}
			
			// 首次加载
			const firstItems = allDataList.value.slice(0, pageSize.value);
			subjectList.value = firstItems;
			totalLoaded.value = firstItems.length;
			
			// 判断是否还有更多数据
			if (allDataList.value.length <= pageSize.value) {
				noMore.value = true;
			} else {
				noMore.value = false;
			}
			
			
		} else {
			// API返回错误码
			console.error('API错误:', data?.errMsg);
			error.value = true;
			subjectList.value = []; // 确保是空数组
			uni.showToast({
				title: data?.errMsg || '加载失败',
				icon: 'none'
			});
		}
		
	} catch (err) {
		console.error('获取专题失败:', err);
		error.value = true;
		subjectList.value = []; // 确保是空数组
		uni.showToast({
			title: '网络错误，请重试',
			icon: 'none'
		});
	} finally {
		loading.value = false;
		// console.log('加载完成，当前专题数量:', subjectList.value.length);
	}
}

// 加载更多专题
const loadMore = () => {
	if (loading.value || noMore.value) return;
	
	// console.log('点击加载更多，当前已加载:', totalLoaded.value);
	
	loading.value = true;
	
	try {
		// 计算应该加载哪些数据
		const startIndex = totalLoaded.value;
		const endIndex = startIndex + pageSize.value;
		const nextItems = allDataList.value.slice(startIndex, endIndex);
		
		// console.log('从索引', startIndex, '到', endIndex, '加载数据');
		// console.log('下一批数据:', nextItems);
		
		if (nextItems.length > 0) {
			// 追加到现有列表后面
			subjectList.value = [...subjectList.value, ...nextItems];
			totalLoaded.value += nextItems.length;
			page.value++;
			
			// console.log('加载更多，追加了', nextItems.length, '个专题');
			// console.log('当前总共显示:', subjectList.value.length, '个专题');
			
			// 检查是否还有更多数据
			if (totalLoaded.value >= allDataList.value.length) {
				noMore.value = true;
				console.log('已加载所有数据');
			}
		} else {
			noMore.value = true;
			console.log('没有更多数据了');
		}
		
	} catch (error) {
		console.error('加载更多失败:', error);
	} finally {
		loading.value = false;
	}
}

// 重新加载
const retryLoad = () => {
	console.log('重新加载');
	error.value = false;
	getSubject(true);
}

// 搜索专题
const onSearch = (e) => {
	keyword.value = e.value;
	getSubject(true);
}

// 清空搜索
const onClearSearch = () => {
	keyword.value = '';
	getSubject(true);
}

// 跳转到专题详情
const goSubjectDetail = (id) => {
	if (!id) return;
	uni.navigateTo({
		url: `/pages/subject/detail?id=${id}`
	});
}

// 分享功能
onShareAppMessage((e) => {
	return {
		title: '发现更多精美专题壁纸',
		path: '/pages/subject/list'
	}
})

onShareTimeline(() => {
	return {
		title: '发现更多精美专题壁纸'
	}
})


getSubject();

</script>

<style lang="scss" scoped>
.subjectLayout {
	background-color: #f5f7f9;
	min-height: 100vh;
	padding-bottom: 100rpx;
	
	.search-box {
		padding: 20rpx 30rpx;
		background: #fff;
	}
	
	.subject-list {
		width: 100%;
		padding: 30rpx;
		
		.subject-item {
			background: #fff;
			border-radius: 20rpx;
			overflow: hidden;
			box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
			margin-bottom: 30rpx;
			
			&:last-child {
				margin-bottom: 0;
			}
			
			.subject-image {
				position: relative;
				width: 100%;
				height: 320rpx; // 单列可以更高一些
				overflow: hidden;
				background: #f5f5f5;
				
				// 三张图片的共同样式
				.collage-img {
					position: absolute;
					background-size: cover;
					background-position: center;
					background-repeat: no-repeat;
					border-radius: 10rpx;
					transform: rotate(3deg);
				}
				
				// 第一张：中间
				.img-center {
					width: 40%;
					height: 160%;
					top: -28%;
					left: 29%;
					z-index: 3;
					transform: rotate(30deg);
				}
				
				// 第二张：左上角
				.img-top-left {
					width: 40%;
					height: 160%;
					top: -35%;
					left: -17%;
					z-index: 2;
					transform: rotate(30deg);
				}
				
				// 第三张：右下角
				.img-bottom-right {
					width: 40%;
					height: 160%;
					bottom: -35%;
					right: -16%;
					z-index: 1;
					transform: rotate(30deg);
				}
				
				// 没有图片时的占位
				.no-images-placeholder {
					width: 100%;
					height: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					color: #ccc;
					
					.placeholder-text {
						font-size: 24rpx;
						margin-top: 10rpx;
					}
				}
			}
			
			.subject-info {
				padding: 30rpx;
				
				.subject-title {
					font-size: 32rpx;
					font-weight: 600;
					color: #333;
					line-height: 1.4;
					margin-bottom: 20rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					height: 90rpx;
				}
				
				.subject-meta {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-top: 15rpx;
					border-top: 1rpx solid #f0f0f0;
					
					.meta-left {
						display: flex;
						align-items: center;
						
						.uni-icons {
							margin-right: 8rpx;
						}
						
						.like-count {
							font-size: 28rpx;
							color: #666;
							font-weight: 500;
						}
					}
					
					.meta-right{
							// 确保右边容器不被压缩
							flex-shrink: 0;
							margin-left: auto;
							
						.image-count{
							font-size: 26rpx;
							color: #666;
							font-weight: 500;
						}
					}
				}
			}
		}
	}
	
	// 加载更多按钮
	.load-more {
		padding: 40rpx 30rpx;
		
		.load-more-btn {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			background: linear-gradient(135deg, #ff6b6b, #ff8e53);
			color: #fff;
			font-size: 30rpx;
			border-radius: 40rpx;
			border: none;
			
			&::after {
				border: none;
			}
			
			&:active {
				opacity: 0.9;
			}
			
			&:disabled {
				opacity: 0.6;
			}
			
			.loading {
				display: flex;
				align-items: center;
				justify-content: center;
				
				.loading-icon {
					animation: loadingRotate 1s linear infinite;
					margin-right: 10rpx;
				}
			}
		}
	}
	
	// 空状态
	.empty-state {
		padding: 100rpx 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
		.empty-image {
			width: 200rpx;
			height: 200rpx;
			margin-bottom: 30rpx;
			opacity: 0.6;
		}
		
		.empty-text {
			font-size: 30rpx;
			color: #999;
			margin-bottom: 40rpx;
		}
		
		.empty-btn {
			width: 240rpx;
			height: 70rpx;
			line-height: 70rpx;
			border-radius: 35rpx;
			background: linear-gradient(135deg, #ff6b6b, #ff8e53);
			color: #fff;
			font-size: 28rpx;
			border: none;
			
			&::after {
				border: none;
			}
		}
	}
	
	// 错误状态
	.error-state {
		padding: 100rpx 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
		.error-text {
			font-size: 28rpx;
			color: #999;
			margin: 20rpx 0;
		}
		
		.retry-btn {
			width: 240rpx;
			height: 70rpx;
			line-height: 70rpx;
			border-radius: 35rpx;
			background: linear-gradient(135deg, #ff6b6b, #ff8e53);
			color: #fff;
			font-size: 28rpx;
			border: none;
			
			&::after {
				border: none;
			}
		}
	}
}

// 加载动画
@keyframes loadingRotate {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
</style>
