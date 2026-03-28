<template>
	<view class="classlist">
		
		<view class="loadingLayout" v-if="!classList.length && !noData">
			<uni-load-more status="loading"></uni-load-more>
		</view>
		
		<view class="content">
			<navigator :url="'/pages/preview/preview?id='+item.id" class="item" 
			v-for="item in classList"
			:key="item.id"
			>			
				<image :src="item.smallPicurl" mode="aspectFill"></image>
			</navigator>
		</view>
		
		<view class="loadingLayout" v-if="classList.length || noData">
			<uni-load-more :status="noData?'noMore':'loading'"></uni-load-more>
		</view>
		
		<view class="safe-area-inset-bottom"></view>
	</view>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import {onLoad,onUnload,onReachBottom,onShareAppMessage,onShareTimeline} from "@dcloudio/uni-app"

import {apiGetClassList,apiGetHistoryList} from "@/api/apis.js"
import {gotoHome} from "@/utils/common.js"
//分类列表数据
const classList = ref([]);
const noData = ref(false)
const loading = ref(false)

//定义data参数
const queryParams = {
	limit:12,
	skip:0
}
let pageName;

onLoad((e)=>{	
	let {id=null,name=null,type=null} = e;
	if(type) queryParams.type = type;
	if(id) queryParams.classid = id;	
	
	pageName = name || "列表"	
	//修改导航标题
	uni.setNavigationBarTitle({
		title:pageName
	})
	//执行获取分类列表方法
	getClassList();
})

onReachBottom(()=>{
	if(noData.value || loading.value) return;
	queryParams.skip += queryParams.limit;
	getClassList();
})

// H5 桌面端一屏能放下很多卡片，首屏内容不满一屏时不会触发 onReachBottom。
// 这里在每次请求完成后补一次高度检查，不够一屏就自动继续拉下一页。
const tryLoadMoreForDesktop = async ()=>{
	if(noData.value || loading.value) return;
	if(typeof window === "undefined" || typeof document === "undefined") return;

	await nextTick();

	const pageHeight = Math.max(
		document.body?.scrollHeight || 0,
		document.documentElement?.scrollHeight || 0
	);
	const viewportHeight = window.innerHeight || 0;

	if(pageHeight <= viewportHeight + 20){
		queryParams.skip += queryParams.limit;
		await getClassList();
	}
}

//获取分类列表网络数据
const getClassList = async ()=>{
	if(loading.value) return;
	loading.value = true;
	let res;
	try{
		if(queryParams.classid) {
			res = await apiGetClassList(queryParams);
		} else if(queryParams.type) {
			res = await apiGetHistoryList(queryParams);
		}

		if(!res || !Array.isArray(res.data)) {
			noData.value = true;
			classList.value = [];
			if(!queryParams.classid && !queryParams.type) gotoHome();
			return;
		}
		
		classList.value = [...classList.value , ...res.data];
		if(queryParams.limit > res.data.length) noData.value = true; 
		uni.setStorageSync("storgClassList",classList.value);	
		console.log(classList.value);	
	} finally {
		loading.value = false;
	}

	await tryLoadMoreForDesktop();
}


//分享给好友
onShareAppMessage((e)=>{
	return {
		title:"咸虾米壁纸-"+pageName,
		path:"/pages/classlist/classlist?id="+queryParams.classid+"&name="+pageName
	}
})


//分享朋友圈
onShareTimeline(()=>{
	return {
		title:"咸虾米壁纸-"+pageName,
		query:"id="+queryParams.classid+"&name="+pageName
	}
})

onUnload(()=>{
	uni.removeStorageSync("storgClassList")
})

</script>

<style lang="scss" scoped>
.classlist{
	.content{
		display: grid;
		grid-template-columns: repeat(3,1fr);
		gap:5rpx;
		padding:5rpx;
		.item{
			height: 440rpx;
			image{
				width: 100%;
				height: 100%;
				display: block;
			}
		}
	}
}

@media screen and (min-width: 960px) {
	.classlist{
		max-width: 1320px;
		margin: 0 auto;
		padding: 24px 24px 96px;

		.content{
			grid-template-columns: repeat(5, minmax(0, 1fr));
			gap: 16px;
			padding: 0;

			.item{
				height: 320px;
				border-radius: 14px;
				overflow: hidden;
				box-shadow: 0 12px 30px rgba(21,34,28,0.10);
			}
		}
	}
}
</style>
