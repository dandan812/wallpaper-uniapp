<template>
	<view class="picture" @click="goPreview(item._id)">
		<image :src="item.smallPicurl" mode="aspectFill"></image>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
	item: {
		type: Object
	},
	classList: {
		type: Array
	}
});

const goPreview = (id) => {
	const previewList = ref('previewList_' + Math.random().toString(36).substring(3, 9));
	uni.navigateTo({
		url: '/pages/preview/preview?id=' + id + '&previewList=' + previewList.value
	});
	uni.setStorageSync(previewList.value, props.classList);
	console.log(props.classList);
};
</script>

<style lang="scss" scoped>
.picture {
	width: 100%;
	height: 100%;
	image {
		width: 100%;
		height: 100%;
		display: block;
	}
}
</style>
