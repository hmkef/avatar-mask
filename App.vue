<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function(options) {
			if (options.query.referee_id && options.query.referee_id > 0) {
				uni.setStorageSync("referee_id", options.query.referee_id)
			}
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	page{
		background-color: #F5F7FA;
	}
</style>
