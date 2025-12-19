<template>
	<view class="homeLayout pageBg">
		<!-- #ifndef MP-TOUTIAO -->
		<custom-nav-bar title="推荐"></custom-nav-bar>
		<!-- #endif -->
		
		
		
		<view class="banner">
			<swiper circular indicator-dots indicator-color="rgba(255,255,255,0.5)" 
			indicator-active-color="#fff" autoplay>
				<swiper-item v-for="item in bannerList" :key="item._id">
					
					<navigator v-if="item.target == 'miniProgram'" 
					:url="item.url" 
					class="like"
					target="miniProgram"
					:app-id="item.appid"
					>
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
						<navigator :url="'/pages/notice/detail?id='+item._id">
							{{item.title}}
						</navigator>
					</swiper-item>
				</swiper>
			</view>
			<view class="right">
				<uni-icons type="right" size="16" color="#333"></uni-icons>
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
					<view class="box" v-for="item in randomList" :key="item._id" 
					@click="goPreview(item._id)">					
						<image :src="item.smallPicurl" mode="aspectFill"></image>					
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
				<theme-item v-for="item in classifyList" 
				:key="item._id"
				:item="item"
				></theme-item>
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
			
			<view class="subject-content">
					<!-- 骨架屏（加载中） -->
					<scroll-view v-if="subjectLoading && subjectList.length === 0" class="subject-scroll subject-skeleton" scroll-x="true">
						<view class="subject-scroll-container">
							<view class="subject-item" v-for="n in 4" :key="n">
								<view class="subject-image"></view>
								<view class="subject-info">
									<view class="subject-title"></view>
									<view class="subject-meta">
										<view class="meta-left"></view>
										<view class="meta-right"></view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
					
					<!-- 有数据时显示 -->
					<scroll-view v-else-if="subjectList.length > 0" class="subject-scroll" scroll-x="true" :scroll-with-animation="true" :show-scrollbar="false">
						<view class="subject-scroll-container">
							<view class="subject-item" v-for="item in subjectList" :key="item.id" @click="goSubjectDetail(item.id)">
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
								</view>
								<view class="subject-info">
									<view class="subject-title">{{item.title || '专题标题'}}</view>
									<view class="subject-meta">
										<view class="meta-left">
											<uni-icons type="heart-filled" size="14" color="#ff6b6b"></uni-icons>
											<text class="like-count">{{item.likes || 0}}人喜欢</text>
										</view>
										<view class="meta-right" v-if="item.imageCount">
											<text class="image-count">{{item.imageCount}}P</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
					
					<!-- 加载失败时显示重试按钮 -->
					<view v-else-if="subjectError && !subjectLoading" class="subject-error">
						<uni-icons type="cloud-upload" size="60" color="#ccc"></uni-icons>
						<text class="error-text">数据加载失败</text>
						<button class="retry-btn" @click="retryLoadSubject">重新加载</button>
					</view>
					
					<!-- 空状态（无数据且无错误） -->
					<view v-else-if="!subjectLoading && !subjectError && subjectList.length === 0" class="subject-empty">
						<uni-icons type="picture" size="60" color="#ccc"></uni-icons>
						<text class="empty-text">暂无专题推荐</text>
					</view>
				</view>
		</view>
		
	</view>
</template>

<script setup>
import { ref } from 'vue';
import {onShareAppMessage,onShareTimeline} from "@dcloudio/uni-app"
import {apiGetBanner,apiGetDayRandom,apiGetNotice,apiGetClassify,apiGetSubject} from "@/api/apis.js"

const bannerList= ref([]);
const randomList = ref([]);
const noticeList = ref([]);
const classifyList = ref([]);
const subjectLoading = ref(false); 
const subjectList = ref([]);

const pageNum = ref(1); // 当前页码
const pageSize = ref(5); // 每次加载2条

// 新增：获取专题推荐数据
const getSubject = async () => {
	if (subjectLoading.value) return;
	
	subjectLoading.value = true;
	
	try {
		// 调用数据
		let res =await apiGetSubject({
			pageNum: pageNum.value,
			pageSize: pageSize.value
		});
		console.log(res);
		
		// 处理响应数据
		// let data = res.data;
		let data = res;
		if (typeof data === 'string') {
			try {
				data = JSON.parse(data);
			} catch (e) {
				console.error('JSON解析错误:', e);
				data = { errCode: -1, data: [] };
			}
		}
		
		// 根据实际API返回的数据结构调整
		// 检查数据结构
		if (data && data.errCode === 0 && data.data && Array.isArray(data.data)) {
			// 处理并格式化数据
			subjectList.value = data.data.map(item => {
				// 获取前三张图片的URL
					let imageUrls = [];
					if (item.picList && Array.isArray(item.picList)) {
						// 获取最多三张图片
						const maxImages = Math.min(item.picList.length, 3);
						for (let i = 0; i < maxImages; i++) {
							let imgUrl = item.picList[i].smallPicurl;
							imageUrls.push(imgUrl);
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
					id: item._id, // 使用 _id 作为唯一标识
					// cover: cover,
					imageUrls: imageUrls, // 存储三张图片URL
					title: item.theme || '专题标题',
					likes: item.view_count || 0,
					imageCount: item.size || 0,
					// 保留原始数据，可能在其他地方有用
					rawData: item
				};
			});
			
			// console.log('处理后的专题数据:', subjectList.value);
			
			// 限制首页显示的数量
			if (subjectList.value.length > 5) {
				subjectList.value = subjectList.value.slice(0, 5);
			}
			
			// 如果数据为空，不显示任何内容（保持空数组）
			if (subjectList.value.length === 0) {
				console.log('专题数据为空');
			}
		} else {
			// 如果数据结构不正确，记录错误
			console.error('API返回数据格式不正确:', data);
			subjectError.value = true;
			
			if (data && data.errMsg) {
				console.error('错误信息:', data.errMsg);
			}
		}
	} catch (error) {
		console.error('获取专题失败:', error);
		subjectError.value = true;
		uni.showToast({
			title: '加载失败',
			icon: 'none',
			duration: 2000
		});
	} finally {
		subjectLoading.value = false;
	}
	console.log(data);
}

// 跳转到专题详情页
const goSubjectDetail = (id) => {
	uni.navigateTo({
		url: `/pages/subject/detail?id=${id}`
	});
}


const getBanner = async ()=>{
	let res =await apiGetBanner();	
	bannerList.value = res.data;	
}

const getDayRandom = async ()=>{
	let res =await apiGetDayRandom();
	randomList.value = res.data	
}

const getNotice = async()=>{
	let res =await apiGetNotice({select:true});
	noticeList.value = res.data
}

const getClassify =async()=>{
	let res =await apiGetClassify({
		select:true
	});
	classifyList.value = res.data
	console.log(res);
}


//跳转到预览页面
const goPreview = (id)=>{
	uni.setStorageSync("storgClassList",randomList.value);
	uni.navigateTo({
		url:"/pages/preview/preview?id="+id
	})	
}


//分享给好友
onShareAppMessage((e)=>{
	return {
		title:"咸虾米壁纸，好看的手机壁纸",
		path:"/pages/classify/classify"
	}
})

//分享朋友圈
onShareTimeline(()=>{
	return {
		title:"咸虾米壁纸，好看的手机壁纸"
	}
})


getBanner();
getDayRandom();
getNotice();
getClassify();
getSubject();
</script>

<style lang="scss" scoped>
.homeLayout{
	.banner{
		width: 750rpx;
		padding:30rpx 0;
		swiper{
			width: 750rpx;
			height: 340rpx;
			&-item{
				width: 100%;
				height: 100%;
				padding:0 30rpx;
				.like{
					width: 100%;
					height: 100%;
					image{
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
				}
				
			}
		}
	}
	.notice{
		width: 690rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: #f9f9f9;
		margin: 0 auto;
		border-radius: 80rpx;
		display: flex;
		.left{
			width: 140rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			:deep(){
				.uni-icons{
					color:$brand-theme-color !important;
				}
			}			
			.text{
				color:$brand-theme-color;
				font-weight: 600;
				font-size: 28rpx;
			}
		}
		.center{
			flex:1;
			swiper{
				height: 100%;
				&-item{
					height: 100%;
					font-size: 30rpx;
					color:#666;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
		.right{
			width: 70rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	
	.select{
		padding-top:50rpx;
		.date{
			color:$brand-theme-color;
			display: flex;
			align-items: center;
			:deep(){
				.uni-icons{
					color:$brand-theme-color !important;
				}
			}	
			.text{
				margin-left:5rpx;
			}
		}
		.content{
			width: 720rpx;
			margin-left: 30rpx;
			margin-top: 30rpx;
			scroll-view{
				white-space: nowrap;
				.box{
					width: 200rpx;
					height: 430rpx;
					display: inline-block;
					margin-right: 15rpx;
					image{
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}
				}
				.box:last-child{margin-right: 30rpx;}
			}
		}
	}
	
	.theme{
		padding:50rpx 0;
		.more{
			font-size: 32rpx;
			color:#888;
			
		}
		.content{
			margin-top:30rpx;
			padding:0 30rpx;
			display: grid;
			gap:15rpx;
			grid-template-columns: repeat(3,1fr);
		}
	}
	
	// <!-- 专题模块的style -->
	.subject{
		padding: 50rpx 0 30rpx;
		
		.more{
			font-size: 32rpx;
			color: #888;
			font-weight: 500;
		}
		
		.subject-content{
			width: 100%;
			margin-top: 30rpx;
			
			.subject-scroll{
				width: 100%;
				height: 400rpx;
				white-space: nowrap;
				
				.subject-scroll-container{
					display: inline-flex;
					padding: 0 30rpx 10rpx;
					height: 100%;
				}
				
				.subject-item{
					width: 320rpx;
					background: #fff;
					border-radius: 20rpx;
					overflow: hidden;
					box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
					margin-right: 20rpx;
					display: inline-flex;
					flex-direction: column;
					vertical-align: top;
					white-space: normal;
					transition: all 0.3s ease;
					position: relative;
					
					&:last-child{
						margin-right: 30rpx;
					}
					
					&:active{
						transform: scale(0.98);
						box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
					}
					
					.subject-image{
						position: relative;
						width: 100%;
						height: 240rpx;
						overflow: hidden;
						background: #f5f5f5;
						
						.subject-cover{
							width: 100%;
							height: 100%;
							object-fit: contain;
							// transition: transform 0.5s ease;
						}
						
						&:hover .subject-cover{
							transform: scale(1.05);
						}
						
						.count-label{
							position: absolute;
							bottom: 15rpx;
							right: 15rpx;
							background: rgba(0,0,0,0.7);
							color: #fff;
							font-size: 24rpx;
							padding: 4rpx 12rpx;
							border-radius: 6rpx;
							font-weight: 500;
							backdrop-filter: blur(10rpx);
						}
						
						// 三张图片的共同样式
						.collage-img{
							position: absolute;
							background-size: cover;
							background-position: center;
							background-repeat: no-repeat;
							border-radius: 10rpx;
							transform: rotate(3deg); // 轻微旋转
						}
						
						// 第一张：中间
						.img-center{
							width: 40%;
							height: 160%;
							top: -28%;
							left: 29%;
							z-index: 3;
							transform: rotate(30deg); 
						}
						
						// 第二张：左上角
						.img-top-left{
							width: 40%;
							height: 160%;
							top: -35%;
							left: -17%;
							z-index: 2;
							transform: rotate(30deg);
						}
						
						// 第三张：右下角
						.img-bottom-right{
							width: 40%;
							height: 160%;
							bottom: -35%;
							right: -16%;
							z-index: 1;
							transform: rotate(30deg);
						}
					}
					
					.subject-info{
						flex: 1;
						padding: 20rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						
						.subject-title{
							font-size: 30rpx;
							font-weight: 600;
							color: #333;
							line-height: 1.4;
							margin-bottom: 15rpx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
							height: 84rpx;
							font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
						}
						
						.subject-meta{
							display: flex;
							align-items: center;
							padding-top: 8rpx;
							border-top: 1rpx solid #f0f0f0;
							
							.uni-icons{
								margin-right: 8rpx;
								filter: drop-shadow(0 2rpx 4rpx rgba(255,107,107,0.3));
							}
							
							.like-count{
								font-size: 26rpx;
								color: #666;
								font-weight: 500;
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
		}
	}
	
	// 滚动条美化
	::-webkit-scrollbar {
		height: 6rpx;
	}
	
	::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3rpx;
		margin: 0 30rpx;
	}
	
	::-webkit-scrollbar-thumb {
		background: linear-gradient(90deg, #ff6b6b, #ff8e53);
		border-radius: 3rpx;
	}
	
	::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(90deg, #ff5252, #ff7b39);
	}
	
	// 加载状态
	.subject-loading{
		height: 380rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.loading-text{
			font-size: 28rpx;
			color: #999;
			margin-left: 15rpx;
		}
	}
	
	// 空状态
	.subject-empty{
		height: 380rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #f9f9f9;
		border-radius: 20rpx;
		margin: 0 30rpx;
		
		.empty-icon{
			color: #ccc;
			margin-bottom: 20rpx;
		}
		
		.empty-text{
			font-size: 28rpx;
			color: #999;
		}
	}
	
	// 骨架屏
	.subject-skeleton{
		.subject-item{
			background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
			background-size: 200% 100%;
			animation: skeleton-loading 1.5s infinite;
		}
		
		.subject-image{
			background: #e0e0e0;
		}
		
		.subject-title{
			height: 40rpx;
			background: #e0e0e0;
			border-radius: 10rpx;
			margin-bottom: 15rpx;
		}
		
		.subject-meta{
			height: 30rpx;
			background: #e0e0e0;
			border-radius: 10rpx;
		}
	}
	
	// 错误状态
	.subject-error{
		height: 380rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #f9f9f9;
		border-radius: 20rpx;
		margin: 0 30rpx;
		
		.error-text{
			font-size: 28rpx;
			color: #999;
			margin: 20rpx 0;
		}
		
		.retry-btn{
			width: 200rpx;
			height: 70rpx;
			line-height: 70rpx;
			font-size: 28rpx;
			color: #fff;
			background: linear-gradient(135deg, #ff6b6b, #ff8e53);
			border-radius: 35rpx;
			border: none;
			margin-top: 10rpx;
			
			&::after{
				border: none;
			}
			
			&:active{
				opacity: 0.8;
			}
		}
	}
	
	// 空状态
	.subject-empty{
		height: 380rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #f9f9f9;
		border-radius: 20rpx;
		margin: 0 30rpx;
		
		.empty-icon{
			color: #ccc;
			margin-bottom: 20rpx;
		}
		
		.empty-text{
			font-size: 28rpx;
			color: #999;
		}
	}
	
	@keyframes skeleton-loading {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}
	
	@keyframes loadingRotate {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.loading-spinner {
		animation: loadingRotate 1s linear infinite;
		color: #ff6b6b;
	}
}
</style>
