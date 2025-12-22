<template>
	<view class="subjectLayout">
		<!-- #ifndef MP-TOUTIAO -->
		<custom-nav-bar title="专题" :search="true"></custom-nav-bar>
		<!-- #endif -->

		<view class="pageLoading" v-if="!dataList.length && !noData"><uni-load-more status="loading" :showText="false" /></view>

		<view class="content">
			<view class="box" v-for="item in dataList" :key="item._id">
				<subject-item :item="item"></subject-item>
			</view>

			<view class="adBtn" v-if="dataList.length">
				<template v-if="!btnDisabled && !noData">
					<button type="primary" :disabled="btnDisabled" @click="handlePage" plain>获取更多专题</button>
				</template>

				<template v-else>
					<view class="pageLoading" v-if="noData || dataList.length"><uni-load-more :status="noData ? 'noMore' : 'loading'" /></view>
				</template>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { apiGetSubject } from '@/api/apis.js';

const dataList = ref([]);
const queryParams = ref({
	pageNum: 1,
	pageSize: 5
});
const noData = ref(false);
const btnDisabled = ref(false);

// 获取专题数据
const getSubject = async (isLoadMore = false) => {
	try {
		let { data } = await apiGetSubject(queryParams.value);
		dataList.value = [...dataList.value, ...data];
		if (queryParams.value.pageSize > data.length) noData.value = true;
		console.log(data);
	} catch (err) {
		console.log(err);
		showToast({ title: '系统出错，请刷新重试' });
	} finally {
		btnDisabled.value = false;
	}
};
//控制翻页
const handlePage = () => {
	if (noData.value) return;
	btnDisabled.value = true;
	queryParams.value.pageNum++;
	getSubject();
};

// 分享功能
onShareAppMessage((e) => {
	return {
		title: '发现更多精美专题壁纸',
		path: '/pages/subject/subject'
	};
});

onShareTimeline(() => {
	return {
		title: '发现更多精美专题壁纸'
	};
});

getSubject();
</script>

<style lang="scss" scoped>
.content {
	padding: 30rpx;
	.adBtn {
		padding: 20rpx 0 40rpx;
	}
	.box {
		width: 100%;
		margin-bottom: 50rpx;
	}
}
</style>
