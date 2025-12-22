<script>
export default {
	onLaunch: function () {
		console.log('App Launch');
	},
	onShow: function () {
		console.log('App Show');
	},
	onHide: function () {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
@import 'common/style/common-style.scss';
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
</style>
