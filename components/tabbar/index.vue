<template>
	<view class="container">
		<view class="tabbar">
			<u-tabbar :value="name" inactiveColor="#C2C2C2" activeColor="#595959" :border="false" :fixed="true"
				:placeholder="true" :safeAreaInsetBottom="true">
				<u-tabbar-item name="avatar" text="首页"
					:icon="name=='avatar'?'/static/ui/tabbar/home-select-02.png':'/static/ui/tabbar/home.png'"
					@click="onClickItem"></u-tabbar-item>
<!-- 				<u-tabbar-item name="cover" text="封面"
					:icon="name=='cover'?'/static/ui/tabbar/cover-icon-select.png':'/static/ui/tabbar/cover-icon.png'"
					@click="onClickItem"></u-tabbar-item> -->
				<u-tabbar-item name="mask" text="挂件"
					:icon="name=='mask'?'/static/ui/tabbar/mask-on.png':'/static/ui/tabbar/mask-off.png'"
					@click="onClickItem"></u-tabbar-item>
				<u-tabbar-item name="text" text="文字"
					:icon="name=='text'?'/static/ui/tabbar/wenzi-on.png':'/static/ui/tabbar/wenzi-off.png'"
					@click="onClickItem"></u-tabbar-item>
				<u-tabbar-item name="me" text="我的"
					:icon="name=='me'?'/static/ui/tabbar/me-select-02.png':'/static/ui/tabbar/me.png'"
					@click="onClickItem"></u-tabbar-item>
			</u-tabbar>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'tabbar',
		data() {
			return {};
		},
		props: {
			name: {
				type: String,
				value: 'avatar'
			}
		},
		methods: {
			onClickItem(e) {
				console.log(e)
				switch (e) {
					case 'avatar':
						uni.reLaunch({
							url: '/pages/avatar/index'
						});
						break;
					case 'cover':
						uni.reLaunch({
							url: '/pages/cover/index'
						});
						break;
					case 'mask':
							uni.reLaunch({
								url: '/pages/mask/index'
							});
						break;
					case 'text':
							uni.reLaunch({
								url: '/pages/text/index'
							});
						break;
					case 'me':
						uni.reLaunch({
							url: '/pages/me/index'
						});
						break;
				}
			}
		}
	};
</script>

<style lang="scss"></style>
